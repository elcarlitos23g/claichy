import { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Playlist, Song } from '../types';

const DEFAULT_COVER = '/assets/images/playlist_top_global_1794094172053.jpg';

function sanitizeId(raw: string): string {
  const cleaned = String(raw || 'item')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 128);
  return cleaned || 'item';
}

function truncate(val: unknown, max: number, fallback = ''): string {
  const str = typeof val === 'string' ? val.trim() : fallback;
  return str.slice(0, max);
}

function safeCoverUrl(url: unknown): string {
  if (typeof url !== 'string' || !url.trim()) return DEFAULT_COVER;
  if (url.startsWith('data:') || url.length > 500) return DEFAULT_COVER;
  return url.slice(0, 500);
}

function safeDuration(dur: unknown): number {
  const n = Number(dur);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(Math.round(n), 86400);
}

function formatCreatedAt(ts: unknown): string {
  if (ts instanceof Timestamp) {
    return ts.toDate().toISOString().split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
}

export async function ensureUserProfile(user: User): Promise<void> {
  const uid = sanitizeId(user.uid);
  const userPath = `users/${uid}`;
  const userRef = doc(db, 'users', uid);

  const displayName = truncate(user.displayName || user.email?.split('@')[0] || 'Usuario Claichy', 120, 'Usuario Claichy') || 'Usuario Claichy';
  const photoURL = truncate(user.photoURL || '', 500, '');

  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid,
        displayName,
        photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(userRef, {
        displayName,
        photoURL,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

export async function savePlaylistToCloud(
  uid: string,
  playlist: Playlist,
  isNew: boolean
): Promise<void> {
  const ownerId = sanitizeId(uid);
  const playlistId = sanitizeId(playlist.id);
  const path = `users/${ownerId}/playlists/${playlistId}`;
  const ref = doc(db, 'users', ownerId, 'playlists', playlistId);

  const title = truncate(playlist.title, 100, 'Mi Lista') || 'Mi Lista';
  const description = truncate(playlist.description, 400, '');
  const coverUrl = safeCoverUrl(playlist.coverUrl);
  const color = truncate(playlist.color || '#f59e0b', 32, '#f59e0b');
  const isOfflineAvailable = Boolean(playlist.isOfflineAvailable);
  const author = truncate(playlist.author || 'Tú', 80, 'Tú');

  try {
    if (isNew) {
      await setDoc(ref, {
        id: playlistId,
        ownerId,
        title,
        description,
        coverUrl,
        color,
        isOfflineAvailable,
        author,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      const existingSnap = await getDoc(ref);
      if (!existingSnap.exists()) {
        await setDoc(ref, {
          id: playlistId,
          ownerId,
          title,
          description,
          coverUrl,
          color,
          isOfflineAvailable,
          author,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(ref, {
          title,
          description,
          coverUrl,
          color,
          isOfflineAvailable,
          author,
          updatedAt: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, path);
  }
}

export async function deletePlaylistFromCloud(uid: string, playlistIdRaw: string): Promise<void> {
  const ownerId = sanitizeId(uid);
  const playlistId = sanitizeId(playlistIdRaw);
  const tracksPath = `users/${ownerId}/playlists/${playlistId}/tracks`;
  const playlistPath = `users/${ownerId}/playlists/${playlistId}`;

  try {
    const tracksQuery = query(
      collection(db, 'users', ownerId, 'playlists', playlistId, 'tracks'),
      where('ownerId', '==', ownerId)
    );
    const tracksSnap = await getDocs(tracksQuery);
    if (!tracksSnap.empty) {
      const batch = writeBatch(db);
      tracksSnap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
    await deleteDoc(doc(db, 'users', ownerId, 'playlists', playlistId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, playlistPath || tracksPath);
  }
}

export async function addTrackToCloudPlaylist(
  uid: string,
  playlistIdRaw: string,
  song: Song
): Promise<void> {
  const ownerId = sanitizeId(uid);
  const playlistId = sanitizeId(playlistIdRaw);
  const trackDocId = sanitizeId(song.id);
  const path = `users/${ownerId}/playlists/${playlistId}/tracks/${trackDocId}`;

  try {
    await setDoc(doc(db, 'users', ownerId, 'playlists', playlistId, 'tracks', trackDocId), {
      id: truncate(song.id, 160, trackDocId) || trackDocId,
      playlistId,
      ownerId,
      title: truncate(song.title, 200, 'Canción sin título') || 'Canción sin título',
      artist: truncate(song.artist, 160, 'Artista') || 'Artista',
      album: truncate(song.album, 160, ''),
      duration: safeDuration(song.duration),
      youtubeId: truncate(song.youtubeId, 64, ''),
      coverUrl: safeCoverUrl(song.coverUrl),
      genre: truncate(song.genre, 80, 'Música'),
      addedAt: truncate(
        song.addedAt || new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        40,
        'Hoy'
      ),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function removeTrackFromCloudPlaylist(
  uid: string,
  playlistIdRaw: string,
  songIdRaw: string
): Promise<void> {
  const ownerId = sanitizeId(uid);
  const playlistId = sanitizeId(playlistIdRaw);
  const trackDocId = sanitizeId(songIdRaw);
  const path = `users/${ownerId}/playlists/${playlistId}/tracks/${trackDocId}`;

  try {
    await deleteDoc(doc(db, 'users', ownerId, 'playlists', playlistId, 'tracks', trackDocId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveLikedSongToCloud(uid: string, song: Song): Promise<void> {
  const ownerId = sanitizeId(uid);
  const likedDocId = sanitizeId(song.id);
  const path = `users/${ownerId}/likedSongs/${likedDocId}`;

  try {
    await setDoc(doc(db, 'users', ownerId, 'likedSongs', likedDocId), {
      id: truncate(song.id, 160, likedDocId) || likedDocId,
      ownerId,
      title: truncate(song.title, 200, 'Canción sin título') || 'Canción sin título',
      artist: truncate(song.artist, 160, 'Artista') || 'Artista',
      album: truncate(song.album, 160, ''),
      duration: safeDuration(song.duration),
      youtubeId: truncate(song.youtubeId, 64, ''),
      coverUrl: safeCoverUrl(song.coverUrl),
      genre: truncate(song.genre, 80, 'Música'),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function removeLikedSongFromCloud(uid: string, songIdRaw: string): Promise<void> {
  const ownerId = sanitizeId(uid);
  const likedDocId = sanitizeId(songIdRaw);
  const path = `users/${ownerId}/likedSongs/${likedDocId}`;

  try {
    await deleteDoc(doc(db, 'users', ownerId, 'likedSongs', likedDocId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function clearLikedSongsInCloud(uid: string): Promise<void> {
  const ownerId = sanitizeId(uid);
  const path = `users/${ownerId}/likedSongs`;

  try {
    const q = query(collection(db, 'users', ownerId, 'likedSongs'), where('ownerId', '==', ownerId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function mergeLocalToCloud(
  user: User,
  localPlaylists: Playlist[],
  localLikedSongs: Song[]
): Promise<void> {
  const ownerId = sanitizeId(user.uid);
  await ensureUserProfile(user);

  const playlistsPath = `users/${ownerId}/playlists`;
  const likedPath = `users/${ownerId}/likedSongs`;

  try {
    // 1. Sync custom playlists
    const existingPlSnap = await getDocs(
      query(collection(db, 'users', ownerId, 'playlists'), where('ownerId', '==', ownerId))
    );
    const cloudPlaylistIds = new Set(existingPlSnap.docs.map((d) => d.id));

    for (const pl of localPlaylists) {
      const plId = sanitizeId(pl.id);
      if (!cloudPlaylistIds.has(plId)) {
        await savePlaylistToCloud(ownerId, { ...pl, id: plId }, true);
      }

      // Sync tracks inside playlist
      const existingTracksSnap = await getDocs(
        query(
          collection(db, 'users', ownerId, 'playlists', plId, 'tracks'),
          where('ownerId', '==', ownerId)
        )
      );
      const cloudTrackIds = new Set(existingTracksSnap.docs.map((d) => d.id));

      for (const track of pl.tracks) {
        const trackDocId = sanitizeId(track.id);
        if (!cloudTrackIds.has(trackDocId)) {
          await addTrackToCloudPlaylist(ownerId, plId, track);
        }
      }
    }

    // 2. Sync liked songs
    const existingLikedSnap = await getDocs(
      query(collection(db, 'users', ownerId, 'likedSongs'), where('ownerId', '==', ownerId))
    );
    const cloudLikedIds = new Set(existingLikedSnap.docs.map((d) => d.id));

    for (const song of localLikedSongs) {
      const likedDocId = sanitizeId(song.id);
      if (!cloudLikedIds.has(likedDocId)) {
        await saveLikedSongToCloud(ownerId, song);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${playlistsPath} | ${likedPath}`);
  }
}

export function subscribeUserCloudData(
  uid: string,
  onPlaylistsUpdate: (playlists: Playlist[]) => void,
  onLikedSongsUpdate: (songs: Song[]) => void
): Unsubscribe {
  const ownerId = sanitizeId(uid);
  const playlistsMap = new Map<string, Playlist>();
  const tracksMap = new Map<string, Song[]>();
  const trackUnsubs = new Map<string, Unsubscribe>();

  const emitPlaylists = () => {
    const merged = Array.from(playlistsMap.values()).map((pl) => ({
      ...pl,
      tracks: tracksMap.get(pl.id) || [],
    }));
    onPlaylistsUpdate(merged);
  };

  const toMillis = (ts: unknown): number => {
    if (ts instanceof Timestamp) return ts.toMillis();
    return 0;
  };

  const playlistsQuery = query(
    collection(db, 'users', ownerId, 'playlists'),
    where('ownerId', '==', ownerId)
  );

  const unsubPlaylists = onSnapshot(
    playlistsQuery,
    (snapshot) => {
      const activeIds = new Set<string>();
      const orderedDocs = [...snapshot.docs].sort(
        (a, b) => toMillis(a.data().createdAt) - toMillis(b.data().createdAt)
      );
      playlistsMap.clear();

      orderedDocs.forEach((docSnap) => {
        const d = docSnap.data();
        const plId = docSnap.id;
        activeIds.add(plId);

        playlistsMap.set(plId, {
          id: plId,
          title: d.title || 'Lista',
          description: d.description || '',
          coverUrl: d.coverUrl || DEFAULT_COVER,
          color: d.color || '#f59e0b',
          tracks: tracksMap.get(plId) || [],
          createdAt: formatCreatedAt(d.createdAt),
          isOfflineAvailable: Boolean(d.isOfflineAvailable),
          isCustom: true,
          author: d.author || 'Tú',
        });

        if (!trackUnsubs.has(plId)) {
          const tracksQuery = query(
            collection(db, 'users', ownerId, 'playlists', plId, 'tracks'),
            where('ownerId', '==', ownerId)
          );
          const unsubTracks = onSnapshot(
            tracksQuery,
            (trackSnap) => {
              const orderedTrackDocs = [...trackSnap.docs].sort(
                (a, b) => toMillis(a.data().createdAt) - toMillis(b.data().createdAt)
              );
              const tracks: Song[] = orderedTrackDocs.map((tDoc) => {
                const td = tDoc.data();
                return {
                  id: td.id || tDoc.id,
                  title: td.title || 'Canción',
                  artist: td.artist || 'Artista',
                  album: td.album || '',
                  duration: typeof td.duration === 'number' ? td.duration : 0,
                  youtubeId: td.youtubeId || '',
                  coverUrl: td.coverUrl || DEFAULT_COVER,
                  genre: td.genre || 'Música',
                  addedAt: td.addedAt || '',
                };
              });
              tracksMap.set(plId, tracks);
              emitPlaylists();
            },
            (err) => {
              handleFirestoreError(err, OperationType.GET, `users/${ownerId}/playlists/${plId}/tracks`);
            }
          );
          trackUnsubs.set(plId, unsubTracks);
        }
      });

      // Clean up deleted playlists & their track listeners
      for (const existingId of Array.from(trackUnsubs.keys())) {
        if (!activeIds.has(existingId)) {
          tracksMap.delete(existingId);
          const unsubT = trackUnsubs.get(existingId);
          if (unsubT) {
            unsubT();
            trackUnsubs.delete(existingId);
          }
        }
      }

      emitPlaylists();
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${ownerId}/playlists`);
    }
  );

  const likedQuery = query(
    collection(db, 'users', ownerId, 'likedSongs'),
    where('ownerId', '==', ownerId)
  );

  const unsubLiked = onSnapshot(
    likedQuery,
    (snapshot) => {
      const orderedLikedDocs = [...snapshot.docs].sort(
        (a, b) => toMillis(b.data().createdAt) - toMillis(a.data().createdAt)
      );
      const songs: Song[] = orderedLikedDocs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: d.id || docSnap.id,
          title: d.title || 'Canción',
          artist: d.artist || 'Artista',
          album: d.album || '',
          duration: typeof d.duration === 'number' ? d.duration : 0,
          youtubeId: d.youtubeId || '',
          coverUrl: d.coverUrl || DEFAULT_COVER,
          genre: d.genre || 'Música',
        };
      });
      onLikedSongsUpdate(songs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${ownerId}/likedSongs`);
    }
  );

  return () => {
    unsubPlaylists();
    unsubLiked();
    trackUnsubs.forEach((u) => u());
    trackUnsubs.clear();
  };
}
