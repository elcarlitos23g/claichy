// IndexedDB and Local Storage Manager for Custom Playlists & Offline Mode

import { Playlist, Song } from '../types';

const DB_NAME = 'SpotiyOfflineDB';
const DB_VERSION = 1;
const STORE_PLAYLISTS = 'playlists';
const STORE_TRACKS = 'cached_tracks';
const STORE_AUDIO_BLOBS = 'audio_blobs';
const STORAGE_LIKES_KEY = 'spotiy_liked_song_ids';

class OfflineStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(STORE_PLAYLISTS)) {
          db.createObjectStore(STORE_PLAYLISTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_TRACKS)) {
          db.createObjectStore(STORE_TRACKS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_AUDIO_BLOBS)) {
          db.createObjectStore(STORE_AUDIO_BLOBS, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };

      request.onerror = (event: any) => {
        console.error('IndexedDB open error:', event.target.error);
        reject(event.target.error);
      };
    });

    return this.dbPromise;
  }

  // Playlists Storage
  public async getCustomPlaylists(): Promise<Playlist[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(STORE_PLAYLISTS, 'readonly');
        const store = transaction.objectStore(STORE_PLAYLISTS);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });
    } catch (e) {
      // Fallback to localStorage
      const cached = localStorage.getItem('spotiy_custom_playlists');
      return cached ? JSON.parse(cached) : [];
    }
  }

  public async savePlaylist(playlist: Playlist): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction(STORE_PLAYLISTS, 'readwrite');
      const store = transaction.objectStore(STORE_PLAYLISTS);
      store.put(playlist);
    } catch (e) {
      console.warn('DB save playlist failed, fallback to localstorage:', e);
    }
    // Also save backup to localStorage
    const existing = await this.getCustomPlaylists();
    const index = existing.findIndex((p) => p.id === playlist.id);
    if (index >= 0) {
      existing[index] = playlist;
    } else {
      existing.push(playlist);
    }
    localStorage.setItem('spotiy_custom_playlists', JSON.stringify(existing));
  }

  public async deletePlaylist(playlistId: string): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction(STORE_PLAYLISTS, 'readwrite');
      const store = transaction.objectStore(STORE_PLAYLISTS);
      store.delete(playlistId);
    } catch (e) {
      console.warn('DB delete playlist error:', e);
    }
    const existing = await this.getCustomPlaylists();
    const filtered = existing.filter((p) => p.id !== playlistId);
    localStorage.setItem('spotiy_custom_playlists', JSON.stringify(filtered));
  }

  // Liked Tracks
  public getLikedSongIds(): string[] {
    try {
      const saved = localStorage.getItem(STORAGE_LIKES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  public toggleLikeSong(songId: string): boolean {
    const likes = this.getLikedSongIds();
    const index = likes.indexOf(songId);
    let isNowLiked = false;
    if (index >= 0) {
      likes.splice(index, 1);
      isNowLiked = false;
    } else {
      likes.push(songId);
      isNowLiked = true;
    }
    localStorage.setItem(STORAGE_LIKES_KEY, JSON.stringify(likes));
    return isNowLiked;
  }

  // Audio Blob Storage (for user-imported MP3/WAV files)
  public async saveAudioBlob(blobId: string, blob: Blob): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_AUDIO_BLOBS, 'readwrite');
      const store = transaction.objectStore(STORE_AUDIO_BLOBS);
      const request = store.put({ id: blobId, blob, size: blob.size, date: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async getAudioBlob(blobId: string): Promise<Blob | null> {
    const db = await this.initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_AUDIO_BLOBS, 'readonly');
      const store = transaction.objectStore(STORE_AUDIO_BLOBS);
      const request = store.get(blobId);
      request.onsuccess = () => resolve(request.result ? request.result.blob : null);
      request.onerror = () => resolve(null);
    });
  }

  // Download / Offline Track Caching
  public async cacheTrack(song: Song): Promise<void> {
    const db = await this.initDB();
    const updatedSong = { ...song, isDownloaded: true };
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_TRACKS, 'readwrite');
      const store = transaction.objectStore(STORE_TRACKS);
      const request = store.put(updatedSong);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async uncacheTrack(songId: string): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_TRACKS, 'readwrite');
      const store = transaction.objectStore(STORE_TRACKS);
      store.delete(songId);
      resolve();
    });
  }

  public async getCachedTracks(): Promise<Song[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(STORE_TRACKS, 'readonly');
        const store = transaction.objectStore(STORE_TRACKS);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });
    } catch (e) {
      return [];
    }
  }

  // Get total offline cache estimate
  public async getOfflineStats(): Promise<{ trackCount: number; approxSizeMB: number }> {
    try {
      const tracks = await this.getCachedTracks();
      const db = await this.initDB();
      const localBlobsSize: number = await new Promise((resolve) => {
        const transaction = db.transaction(STORE_AUDIO_BLOBS, 'readonly');
        const store = transaction.objectStore(STORE_AUDIO_BLOBS);
        const request = store.getAll();
        request.onsuccess = () => {
          const items = request.result || [];
          const totalBytes = items.reduce((sum: number, item: any) => sum + (item.size || 0), 0);
          resolve(totalBytes);
        };
        request.onerror = () => resolve(0);
      });

      // Approx 3.5MB per cached track representation + actual blobs
      const totalMB = ((tracks.length * 3.5 * 1024 * 1024 + localBlobsSize) / (1024 * 1024)).toFixed(1);
      return {
        trackCount: tracks.length,
        approxSizeMB: parseFloat(totalMB),
      };
    } catch (e) {
      return { trackCount: 0, approxSizeMB: 0 };
    }
  }
}

export const offlineStorage = new OfflineStorage();
