import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CATALOG_SONGS,
  INITIAL_CURATED_PLAYLISTS,
  ARTISTS_CATALOG,
} from './data/musicCatalog';
import { Artist, Playlist, PlayerState, Song, ViewType } from './types';
import { youtubeManager } from './services/youtube';
import { offlineAudioEngine } from './services/synthAudio';
import { offlineStorage } from './services/offlineStorage';

// Components
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { PlayerBar } from './components/PlayerBar';
import { YouTubePlayerModal } from './components/YouTubePlayerModal';
import { LyricsView } from './components/LyricsView';
import { QueueDrawer } from './components/QueueDrawer';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';
import { DirectYouTubeModal } from './components/DirectYouTubeModal';
import { OfflineManagerModal } from './components/OfflineManagerModal';
import { ShareModal } from './components/ShareModal';
import { BottomNav } from './components/BottomNav';

// Views
import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { LibraryView } from './views/LibraryView';
import { PlaylistDetailView } from './views/PlaylistDetailView';
import { ArtistDetailView } from './views/ArtistDetailView';

export default function App() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [viewHistory, setViewHistory] = useState<Array<{ view: ViewType; data?: any }>>([
    { view: 'home' },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Storage and Playlists
  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>([]);
  const [likedSongIds, setLikedSongIds] = useState<string[]>([]);
  const [cachedStats, setCachedStats] = useState({ trackCount: 0, approxSizeMB: 0 });
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [songToAddToPlaylist, setSongToAddToPlaylist] = useState<Song | null>(null);
  const [isDirectYouTubeOpen, setIsDirectYouTubeOpen] = useState(false);
  const [isOfflineManagerOpen, setIsOfflineManagerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Playback state
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 80,
    isMuted: false,
    isShuffle: false,
    repeatMode: 'off',
    queue: [],
    queueIndex: 0,
    isBuffering: false,
    isOfflineMode: false,
    showMiniVideo: false,
    showLyrics: false,
    showQueue: false,
    audioSource: 'youtube',
  });

  // All known songs combined (catalog + custom playlist tracks)
  const allKnownSongs = useMemo(() => {
    const map = new Map<string, Song>();
    CATALOG_SONGS.forEach((s) => map.set(s.id, s));
    customPlaylists.forEach((pl) => {
      pl.tracks.forEach((s) => map.set(s.id, s));
    });
    return Array.from(map.values());
  }, [customPlaylists]);

  // Liked songs virtual playlist
  const likedSongsPlaylist: Playlist = useMemo(() => {
    const tracks = allKnownSongs.filter((s) => likedSongIds.includes(s.id));
    return {
      id: 'liked-songs',
      title: 'Tus Me Gusta',
      description: 'Todas las canciones que has marcado como favoritas.',
      coverUrl: '',
      color: '#4F46E5', // Indigo
      tracks,
      createdAt: '2024-01-01',
      isOfflineAvailable: true,
      isLikedSongs: true,
      author: 'Tú',
    };
  }, [allKnownSongs, likedSongIds]);

  // Combine curated and custom playlists
  const allPlaylists = useMemo(() => {
    return [...INITIAL_CURATED_PLAYLISTS, ...customPlaylists];
  }, [customPlaylists]);

  // Show toast notification
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  // Refresh storage statistics
  const refreshStorageStats = useCallback(async () => {
    const stats = await offlineStorage.getOfflineStats();
    setCachedStats({ trackCount: stats.trackCount, approxSizeMB: stats.approxSizeMB });
  }, []);

  // Load custom playlists & likes on mount
  useEffect(() => {
    async function loadData() {
      const savedPlaylists = await offlineStorage.getCustomPlaylists();
      setCustomPlaylists(savedPlaylists);

      const likes = offlineStorage.getLikedSongIds();
      setLikedSongIds(likes);

      await refreshStorageStats();
    }
    loadData();

    // Listen to network changes
    const handleOnline = () => {
      showToast('Conexión a internet restablecida');
    };
    const handleOffline = () => {
      setIsOfflineMode(true);
      showToast('Sin conexión: activado modo offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshStorageStats, showToast]);

  // Initialize YouTube IFrame Player
  useEffect(() => {
    youtubeManager.init('youtube-player-host', {
      onReady: () => {
        youtubeManager.setVolume(playerState.volume);
      },
      onStateChange: (state: number) => {
        // YT.PlayerState: UNSTARTED = -1, ENDED = 0, PLAYING = 1, PAUSED = 2, BUFFERING = 3, CUED = 5
        if (state === 1) {
          setPlayerState((prev) => ({ ...prev, isPlaying: true, isBuffering: false }));
        } else if (state === 2) {
          setPlayerState((prev) => ({ ...prev, isPlaying: false, isBuffering: false }));
        } else if (state === 3) {
          setPlayerState((prev) => ({ ...prev, isBuffering: true }));
        } else if (state === 5) {
          // Video is cued and ready, command play immediately
          youtubeManager.play();
        } else if (state === 0) {
          handleTrackEnded();
        }
      },
      onTimeUpdate: (currentTime, duration) => {
        setPlayerState((prev) => ({
          ...prev,
          currentTime,
          duration: duration || prev.duration,
          // If time is actively progressing, ensure isBuffering is false
          isBuffering: prev.isBuffering && currentTime > 0 ? false : prev.isBuffering,
        }));
      },
      onError: (errorCode: number) => {
        console.warn('YouTube Player error code:', errorCode);
        setPlayerState((prev) => ({
          ...prev,
          isBuffering: false,
          isPlaying: true,
          audioSource: 'synth_offline',
        }));
        showToast('Aviso: Restricción de inserción de YouTube. Reproduciendo respaldo de audio.');
        if (playerState.currentTrack) {
          offlineAudioEngine.playOfflineSynth(playerState.currentTrack);
        }
      },
    });

    // Offline audio engine callbacks
    offlineAudioEngine.setCallbacks(
      (currentTime, duration) => {
        setPlayerState((prev) => ({ ...prev, currentTime, duration }));
      },
      () => {
        handleTrackEnded();
      }
    );

    return () => {
      youtubeManager.destroy();
      offlineAudioEngine.stop();
    };
  }, []);

  // Synchronize isOfflineMode to playerState
  useEffect(() => {
    setPlayerState((prev) => ({ ...prev, isOfflineMode }));
  }, [isOfflineMode]);

  // Play a song
  const handlePlaySong = useCallback(
    async (song: Song, contextPlaylist?: Song[]) => {
      const queueList = contextPlaylist && contextPlaylist.length > 0 ? contextPlaylist : [song];
      const index = queueList.findIndex((s) => s.id === song.id);

      setPlayerState((prev) => ({
        ...prev,
        currentTrack: song,
        isPlaying: true,
        currentTime: 0,
        duration: song.duration,
        queue: queueList,
        queueIndex: index >= 0 ? index : 0,
        isBuffering: true,
      }));

      // Check audio playback route:
      // Case 1: Local MP3 audio file
      if (song.isLocalAudio && song.audioBlobId) {
        youtubeManager.pause();
        const blob = await offlineStorage.getAudioBlob(song.audioBlobId);
        if (blob) {
          offlineAudioEngine.playLocalBlob(blob, song.duration);
          setPlayerState((prev) => ({
            ...prev,
            audioSource: 'local_file',
            isBuffering: false,
          }));
          return;
        }
      }

      // Case 2: Offline mode active
      if (isOfflineMode) {
        youtubeManager.pause();
        offlineAudioEngine.playOfflineSynth(song);
        setPlayerState((prev) => ({
          ...prev,
          audioSource: 'synth_offline',
          isBuffering: false,
        }));
        showToast(`Reproduciendo síntesis de audio sin conexión: ${song.title}`);
        return;
      }

      // Case 3: Legal YouTube IFrame streaming
      if (song.youtubeId) {
        offlineAudioEngine.stop();
        youtubeManager.loadVideo(song.youtubeId, true);
        setPlayerState((prev) => ({
          ...prev,
          audioSource: 'youtube',
        }));

        // Watchdog: If YouTube is still buffering or pending after 4s, clear spinner and retry play
        setTimeout(() => {
          setPlayerState((curr) => {
            if (curr.currentTrack?.id === song.id && curr.isBuffering) {
              console.log('[App Watchdog] Re-triggering play command');
              youtubeManager.play();
              return { ...curr, isBuffering: false };
            }
            return curr;
          });
        }, 3800);
      }
    },
    [isOfflineMode, showToast]
  );

  // Next / Previous song
  const handleNext = useCallback(() => {
    if (playerState.queue.length === 0) return;

    let nextIndex = playerState.queueIndex + 1;
    if (playerState.isShuffle) {
      nextIndex = Math.floor(Math.random() * playerState.queue.length);
    } else if (nextIndex >= playerState.queue.length) {
      if (playerState.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return; // reached end of queue
      }
    }

    const nextTrack = playerState.queue[nextIndex];
    if (nextTrack) {
      handlePlaySong(nextTrack, playerState.queue);
    }
  }, [handlePlaySong, playerState]);

  const handlePrevious = useCallback(() => {
    if (playerState.currentTime > 3) {
      // If played more than 3 seconds, rewind to start
      if (playerState.audioSource === 'youtube') {
        youtubeManager.seekTo(0);
      } else {
        offlineAudioEngine.seekTo(0);
      }
      return;
    }

    let prevIndex = playerState.queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = playerState.queue.length - 1;
    }

    const prevTrack = playerState.queue[prevIndex];
    if (prevTrack) {
      handlePlaySong(prevTrack, playerState.queue);
    }
  }, [handlePlaySong, playerState]);

  const handleTrackEnded = useCallback(() => {
    if (playerState.repeatMode === 'one' && playerState.currentTrack) {
      if (playerState.audioSource === 'youtube') {
        youtubeManager.seekTo(0);
        youtubeManager.play();
      } else {
        offlineAudioEngine.seekTo(0);
      }
    } else {
      handleNext();
    }
  }, [handleNext, playerState.audioSource, playerState.currentTrack, playerState.repeatMode]);

  // Play / Pause toggle
  const handlePlayPause = useCallback(() => {
    if (!playerState.currentTrack) {
      if (CATALOG_SONGS.length > 0) {
        handlePlaySong(CATALOG_SONGS[0], CATALOG_SONGS);
      }
      return;
    }

    if (playerState.isPlaying) {
      if (playerState.audioSource === 'youtube') {
        youtubeManager.pause();
      } else {
        offlineAudioEngine.pause();
      }
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
    } else {
      if (playerState.audioSource === 'youtube') {
        youtubeManager.play();
      } else {
        offlineAudioEngine.resume();
      }
      setPlayerState((prev) => ({ ...prev, isPlaying: true }));
    }
  }, [handlePlaySong, playerState]);

  // Seek
  const handleSeek = useCallback(
    (seconds: number) => {
      setPlayerState((prev) => ({ ...prev, currentTime: seconds }));
      if (playerState.audioSource === 'youtube') {
        youtubeManager.seekTo(seconds);
      } else {
        offlineAudioEngine.seekTo(seconds);
      }
    },
    [playerState.audioSource]
  );

  // Volume & Mute
  const handleVolumeChange = useCallback((vol: number) => {
    setPlayerState((prev) => ({ ...prev, volume: vol, isMuted: vol === 0 }));
    youtubeManager.setVolume(vol);
    offlineAudioEngine.setVolume(vol);
  }, []);

  const handleToggleMute = useCallback(() => {
    setPlayerState((prev) => {
      const nextMuted = !prev.isMuted;
      if (nextMuted) {
        youtubeManager.mute();
        offlineAudioEngine.setVolume(0);
      } else {
        youtubeManager.unMute();
        offlineAudioEngine.setVolume(prev.volume);
      }
      return { ...prev, isMuted: nextMuted };
    });
  }, []);

  // Shuffle & Repeat
  const handleToggleShuffle = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isShuffle: !prev.isShuffle }));
    showToast(playerState.isShuffle ? 'Modo aleatorio desactivado' : 'Modo aleatorio activado');
  }, [playerState.isShuffle, showToast]);

  const handleToggleRepeat = useCallback(() => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const nextIndex = (modes.indexOf(playerState.repeatMode) + 1) % modes.length;
    const nextMode = modes[nextIndex];
    setPlayerState((prev) => ({ ...prev, repeatMode: nextMode }));
    showToast(
      nextMode === 'off'
        ? 'Repetición desactivada'
        : nextMode === 'all'
        ? 'Repetir toda la lista'
        : 'Repetir canción actual'
    );
  }, [playerState.repeatMode, showToast]);

  // Like Song
  const handleToggleLike = useCallback(
    (songId: string) => {
      const isNowLiked = offlineStorage.toggleLikeSong(songId);
      setLikedSongIds(offlineStorage.getLikedSongIds());
      showToast(isNowLiked ? 'Guardada en Tus Me Gusta' : 'Eliminada de Tus Me Gusta');
    },
    [showToast]
  );

  const isLiked = useCallback(
    (songId: string) => likedSongIds.includes(songId),
    [likedSongIds]
  );

  // Navigation handlers
  const navigateTo = useCallback(
    (view: ViewType, data?: any) => {
      if (view === 'playlist' && data?.id) {
        if (data.id === 'liked-songs') {
          setSelectedPlaylist(likedSongsPlaylist);
        } else {
          const found = allPlaylists.find((p) => p.id === data.id);
          if (found) setSelectedPlaylist(found);
        }
      } else if (view === 'artist' && data?.artist) {
        setSelectedArtist(data.artist);
      }

      setCurrentView(view);
      const newHistory = viewHistory.slice(0, historyIndex + 1);
      newHistory.push({ view, data });
      setViewHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [allPlaylists, historyIndex, likedSongsPlaylist, viewHistory]
  );

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const prev = viewHistory[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentView(prev.view);
      if (prev.view === 'playlist' && prev.data?.id) {
        if (prev.data.id === 'liked-songs') {
          setSelectedPlaylist(likedSongsPlaylist);
        } else {
          const found = allPlaylists.find((p) => p.id === prev.data.id);
          if (found) setSelectedPlaylist(found);
        }
      } else if (prev.view === 'artist' && prev.data?.artist) {
        setSelectedArtist(prev.data.artist);
      }
    }
  };

  const handleGoForward = () => {
    if (historyIndex < viewHistory.length - 1) {
      const next = viewHistory[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentView(next.view);
      if (next.view === 'playlist' && next.data?.id) {
        if (next.data.id === 'liked-songs') {
          setSelectedPlaylist(likedSongsPlaylist);
        } else {
          const found = allPlaylists.find((p) => p.id === next.data.id);
          if (found) setSelectedPlaylist(found);
        }
      } else if (next.view === 'artist' && next.data?.artist) {
        setSelectedArtist(next.data.artist);
      }
    }
  };

  // Custom Playlists Operations
  const handleSavePlaylist = async (data: Partial<Playlist>) => {
    if (editingPlaylist) {
      const updated: Playlist = {
        ...editingPlaylist,
        ...data,
      };
      await offlineStorage.savePlaylist(updated);
      setCustomPlaylists((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      if (selectedPlaylist?.id === updated.id) {
        setSelectedPlaylist(updated);
      }
      showToast('Lista actualizada');
    } else {
      const newPlaylist: Playlist = {
        id: `pl-user-${Date.now()}`,
        title: data.title || 'Nueva Lista',
        description: data.description || 'Lista de reproducción personalizada',
        coverUrl:
          data.coverUrl ||
          '/src/assets/images/playlist_top_global_1794094172053.jpg',
        color: data.color || '#10B981',
        tracks: [],
        createdAt: new Date().toISOString().split('T')[0],
        isOfflineAvailable: data.isOfflineAvailable || false,
        isCustom: true,
        author: 'Tú',
      };
      await offlineStorage.savePlaylist(newPlaylist);
      setCustomPlaylists((prev) => [...prev, newPlaylist]);
      setSelectedPlaylist(newPlaylist);
      navigateTo('playlist', { id: newPlaylist.id });
      showToast('¡Lista de reproducción creada!');
    }
    setEditingPlaylist(null);
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    await offlineStorage.deletePlaylist(playlistId);
    setCustomPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    navigateTo('library');
    showToast('Lista eliminada');
  };

  const handleToggleOfflineDownload = async (playlistId: string) => {
    const target = allPlaylists.find((p) => p.id === playlistId);
    if (!target) return;

    const nextState = !target.isOfflineAvailable;
    const updated = { ...target, isOfflineAvailable: nextState };

    if (target.isCustom) {
      await offlineStorage.savePlaylist(updated);
      setCustomPlaylists((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }

    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(updated);
    }

    // Cache or uncache tracks
    if (nextState) {
      for (const track of target.tracks) {
        await offlineStorage.cacheTrack(track);
      }
      showToast('Lista descargada para Modo Sin Conexión');
    } else {
      showToast('Descarga sin conexión eliminada');
    }

    await refreshStorageStats();
  };

  const handleToggleTrackInPlaylist = async (playlistId: string, song: Song) => {
    const pl = customPlaylists.find((p) => p.id === playlistId);
    if (!pl) return;

    const exists = pl.tracks.some((t) => t.id === song.id);
    let updatedTracks: Song[];

    if (exists) {
      updatedTracks = pl.tracks.filter((t) => t.id !== song.id);
      showToast(`"${song.title}" eliminada de ${pl.title}`);
    } else {
      const trackWithDate: Song = {
        ...song,
        addedAt: new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      };
      updatedTracks = [...pl.tracks, trackWithDate];
      showToast(`"${song.title}" añadida a ${pl.title}`);
    }

    const updatedPlaylist = { ...pl, tracks: updatedTracks };
    await offlineStorage.savePlaylist(updatedPlaylist);
    setCustomPlaylists((prev) => prev.map((p) => (p.id === pl.id ? updatedPlaylist : p)));
    if (selectedPlaylist?.id === pl.id) {
      setSelectedPlaylist(updatedPlaylist);
    }
  };

  const handleRemoveTrackFromPlaylist = async (playlistId: string, songId: string) => {
    const pl = customPlaylists.find((p) => p.id === playlistId);
    if (!pl) return;

    const updatedTracks = pl.tracks.filter((t) => t.id !== songId);
    const updated = { ...pl, tracks: updatedTracks };
    await offlineStorage.savePlaylist(updated);
    setCustomPlaylists((prev) => prev.map((p) => (p.id === pl.id ? updated : p)));
    if (selectedPlaylist?.id === pl.id) {
      setSelectedPlaylist(updated);
    }
    showToast('Canción eliminada de la lista');
  };

  // Import local audio files
  const handleImportLocalTracks = async (newTracks: Song[]) => {
    // Add to a dedicated "Audios Locales" playlist or create it
    let localPlaylist = customPlaylists.find((p) => p.id === 'pl-local-audios');
    if (!localPlaylist) {
      localPlaylist = {
        id: 'pl-local-audios',
        title: 'Archivos Locales Offline',
        description: 'Tus canciones en MP3/WAV guardadas en la memoria local.',
        coverUrl:
          '/src/assets/images/playlist_rock_classics_1794094172992.jpg',
        color: '#D97706',
        tracks: newTracks,
        createdAt: new Date().toISOString().split('T')[0],
        isOfflineAvailable: true,
        isCustom: true,
        author: 'Tú',
      };
    } else {
      localPlaylist = {
        ...localPlaylist,
        tracks: [...localPlaylist.tracks, ...newTracks],
        isOfflineAvailable: true,
      };
    }
    await offlineStorage.savePlaylist(localPlaylist);
    setCustomPlaylists((prev) => {
      const exists = prev.some((p) => p.id === localPlaylist!.id);
      return exists
        ? prev.map((p) => (p.id === localPlaylist!.id ? localPlaylist! : p))
        : [...prev, localPlaylist!];
    });
    setSelectedPlaylist(localPlaylist);
    navigateTo('playlist', { id: localPlaylist.id });
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'KeyM') {
        handleToggleMute();
      } else if (e.code === 'KeyL') {
        setPlayerState((prev) => ({ ...prev, showLyrics: !prev.showLyrics }));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSeek(Math.min(playerState.duration, playerState.currentTime + 5));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSeek(Math.max(0, playerState.currentTime - 5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, handleSeek, handleToggleMute, playerState.currentTime, playerState.duration]);

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-[#07090e] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Claichy Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-bold px-6 py-2.5 rounded-full shadow-[0_10px_30px_rgba(245,158,11,0.4)] text-xs md:text-sm animate-in fade-in slide-in-from-top-4 duration-200 border border-amber-300/40 tracking-wide flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Left Sidebar (Desktop Only) */}
      <Sidebar
        currentView={currentView}
        onNavigate={navigateTo}
        customPlaylists={customPlaylists}
        likedSongsCount={likedSongIds.length}
        activePlaylistId={selectedPlaylist?.id || null}
        onOpenCreatePlaylist={() => {
          setEditingPlaylist(null);
          setIsCreatePlaylistOpen(true);
        }}
        isOfflineMode={isOfflineMode}
        onToggleOfflineMode={() => {
          setIsOfflineMode(!isOfflineMode);
          showToast(!isOfflineMode ? 'Modo sin conexión activado' : 'Modo en línea activado');
        }}
        onOpenOfflineManager={() => setIsOfflineManagerOpen(true)}
        onOpenUploadLocal={() => setIsOfflineManagerOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#090b10] rounded-none md:rounded-2xl m-0 md:m-2 md:ml-0 border-0 md:border border-white/[0.06] shadow-2xl">
        {/* Top Navigation Bar */}
        <TopNav
          currentView={currentView}
          onNavigate={navigateTo}
          canGoBack={historyIndex > 0}
          canGoForward={historyIndex < viewHistory.length - 1}
          onGoBack={handleGoBack}
          onGoForward={handleGoForward}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isOfflineMode={isOfflineMode}
          onToggleOfflineMode={() => {
            setIsOfflineMode(!isOfflineMode);
            showToast(!isOfflineMode ? 'Modo sin conexión activado' : 'Modo en línea activado');
          }}
          onOpenOfflineManager={() => setIsOfflineManagerOpen(true)}
          onOpenDirectYouTubeModal={() => setIsDirectYouTubeOpen(true)}
          cachedCount={cachedStats.trackCount}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />

        {/* View Switcher Container */}
        <main className="flex-1 overflow-y-auto scroll-smooth pb-36 md:pb-2">
          {currentView === 'home' && (
            <HomeView
              playlists={allPlaylists}
              artists={ARTISTS_CATALOG}
              topSongs={allKnownSongs}
              currentTrack={playerState.currentTrack}
              isPlaying={playerState.isPlaying}
              onPlaySong={handlePlaySong}
              onSelectPlaylist={(pl) => {
                setSelectedPlaylist(pl);
                navigateTo('playlist', { id: pl.id });
              }}
              onSelectArtist={(art) => {
                setSelectedArtist(art);
                navigateTo('artist', { artist: art });
              }}
              onAddToPlaylist={(song) => {
                setSongToAddToPlaylist(song);
                setIsAddToPlaylistOpen(true);
              }}
              isLiked={isLiked}
              onToggleLike={handleToggleLike}
            />
          )}

          {currentView === 'search' && (
            <SearchView
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              allSongs={allKnownSongs}
              currentTrack={playerState.currentTrack}
              isPlaying={playerState.isPlaying}
              onPlaySong={handlePlaySong}
              onAddToPlaylist={(song) => {
                setSongToAddToPlaylist(song);
                setIsAddToPlaylistOpen(true);
              }}
              isLiked={isLiked}
              onToggleLike={handleToggleLike}
              onOpenDirectYouTubeModal={() => setIsDirectYouTubeOpen(true)}
              onSelectArtist={(art) => {
                setSelectedArtist(art);
                navigateTo('artist', { artist: art });
              }}
            />
          )}

          {currentView === 'library' && (
            <LibraryView
              playlists={allPlaylists}
              likedSongsCount={likedSongIds.length}
              onSelectPlaylist={(pl) => {
                setSelectedPlaylist(pl);
                navigateTo('playlist', { id: pl.id });
              }}
              onOpenCreatePlaylist={() => {
                setEditingPlaylist(null);
                setIsCreatePlaylistOpen(true);
              }}
              onOpenUploadLocal={() => setIsOfflineManagerOpen(true)}
              onPlaySong={handlePlaySong}
            />
          )}

          {currentView === 'playlist' && selectedPlaylist && (
            <PlaylistDetailView
              playlist={selectedPlaylist}
              currentTrack={playerState.currentTrack}
              isPlaying={playerState.isPlaying}
              onPlaySong={handlePlaySong}
              onPlayAll={(pl) => {
                if (pl.tracks.length > 0) {
                  handlePlaySong(pl.tracks[0], pl.tracks);
                }
              }}
              onToggleLike={handleToggleLike}
              isLiked={isLiked}
              onToggleOfflineDownload={handleToggleOfflineDownload}
              onRemoveTrack={handleRemoveTrackFromPlaylist}
              onEditPlaylist={(pl) => {
                setEditingPlaylist(pl);
                setIsCreatePlaylistOpen(true);
              }}
              onDeletePlaylist={handleDeletePlaylist}
              onAddToQueue={(song) => {
                setPlayerState((prev) => ({
                  ...prev,
                  queue: [...prev.queue, song],
                }));
                showToast(`"${song.title}" añadida a la cola`);
              }}
              onOpenAddToPlaylist={(song) => {
                setSongToAddToPlaylist(song);
                setIsAddToPlaylistOpen(true);
              }}
              onOpenSearchToAdd={() => {
                setCurrentView('search');
              }}
            />
          )}

          {currentView === 'artist' && selectedArtist && (
            <ArtistDetailView
              artist={selectedArtist}
              currentTrack={playerState.currentTrack}
              isPlaying={playerState.isPlaying}
              onPlaySong={handlePlaySong}
              onToggleLike={handleToggleLike}
              isLiked={isLiked}
              onAddToPlaylist={(song) => {
                setSongToAddToPlaylist(song);
                setIsAddToPlaylistOpen(true);
              }}
              onSearchArtistOnYouTube={(artistName) => {
                setSearchQuery(artistName);
                setCurrentView('search');
              }}
            />
          )}
        </main>
      </div>

      {/* Bottom Sticky Player Bar & Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="pointer-events-auto">
          <PlayerBar
            playerState={playerState}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onToggleMute={handleToggleMute}
            onToggleShuffle={handleToggleShuffle}
            onToggleRepeat={handleToggleRepeat}
            onToggleLyrics={() =>
              setPlayerState((prev) => ({ ...prev, showLyrics: !prev.showLyrics }))
            }
            onToggleQueue={() =>
              setPlayerState((prev) => ({ ...prev, showQueue: !prev.showQueue }))
            }
            onToggleMiniVideo={() =>
              setPlayerState((prev) => ({ ...prev, showMiniVideo: !prev.showMiniVideo }))
            }
            isLiked={playerState.currentTrack ? isLiked(playerState.currentTrack.id) : false}
            onToggleLike={(id) => handleToggleLike(id)}
            onSelectArtist={(artistName) => {
              const found = ARTISTS_CATALOG.find((a) => a.name.toLowerCase() === artistName.toLowerCase());
              if (found) {
                setSelectedArtist(found);
                navigateTo('artist', { artist: found });
              } else {
                setSearchQuery(artistName);
                navigateTo('search');
              }
            }}
          />
        </div>
        <div className="pointer-events-auto">
          <BottomNav
            currentView={currentView}
            onNavigate={navigateTo}
            isOfflineMode={isOfflineMode}
            onOpenOfflineManager={() => setIsOfflineManagerOpen(true)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        </div>
      </div>

      {/* Synchronized Lyrics Overlay */}
      {playerState.showLyrics && (
        <LyricsView
          currentTrack={playerState.currentTrack}
          currentTime={playerState.currentTime}
          onSeek={handleSeek}
          onClose={() => setPlayerState((prev) => ({ ...prev, showLyrics: false }))}
        />
      )}

      {/* Queue Drawer */}
      <QueueDrawer
        isOpen={playerState.showQueue}
        onClose={() => setPlayerState((prev) => ({ ...prev, showQueue: false }))}
        currentTrack={playerState.currentTrack}
        queue={playerState.queue}
        queueIndex={playerState.queueIndex}
        onSelectQueueIndex={(index) => {
          const song = playerState.queue[index];
          if (song) {
            handlePlaySong(song, playerState.queue);
          }
        }}
        onRemoveFromQueue={(index) => {
          setPlayerState((prev) => {
            const updated = [...prev.queue];
            updated.splice(index, 1);
            return { ...prev, queue: updated };
          });
        }}
        onClearQueue={() => {
          setPlayerState((prev) => ({
            ...prev,
            queue: prev.currentTrack ? [prev.currentTrack] : [],
            queueIndex: 0,
          }));
        }}
      />

      {/* YouTube Player Container & Mini-Video Modal */}
      <YouTubePlayerModal
        currentTrack={playerState.currentTrack}
        isOpen={playerState.showMiniVideo}
        onClose={() => setPlayerState((prev) => ({ ...prev, showMiniVideo: false }))}
      />

      {/* Create / Edit Custom Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => {
          setIsCreatePlaylistOpen(false);
          setEditingPlaylist(null);
        }}
        onCreate={handleSavePlaylist}
        editingPlaylist={editingPlaylist}
      />

      {/* Add Track to Playlist Modal */}
      <AddToPlaylistModal
        isOpen={isAddToPlaylistOpen}
        onClose={() => {
          setIsAddToPlaylistOpen(false);
          setSongToAddToPlaylist(null);
        }}
        song={songToAddToPlaylist}
        playlists={customPlaylists}
        onToggleTrackInPlaylist={handleToggleTrackInPlaylist}
        onOpenCreatePlaylist={() => {
          setEditingPlaylist(null);
          setIsCreatePlaylistOpen(true);
        }}
      />

      {/* Direct YouTube Video / Link Paste Modal */}
      <DirectYouTubeModal
        isOpen={isDirectYouTubeOpen}
        onClose={() => setIsDirectYouTubeOpen(false)}
        onPlaySong={(song) => handlePlaySong(song, [song])}
        onAddToPlaylistPrompt={(song) => {
          setSongToAddToPlaylist(song);
          setIsAddToPlaylistOpen(true);
        }}
      />

      {/* Offline Storage & MP3 Upload Modal */}
      <OfflineManagerModal
        isOpen={isOfflineManagerOpen}
        onClose={() => setIsOfflineManagerOpen(false)}
        isOfflineMode={isOfflineMode}
        onToggleOfflineMode={() => {
          setIsOfflineMode(!isOfflineMode);
          showToast(!isOfflineMode ? 'Modo sin conexión activado' : 'Modo en línea activado');
        }}
        playlists={allPlaylists}
        onImportLocalTracks={handleImportLocalTracks}
        onRefreshStats={refreshStorageStats}
        cachedCount={cachedStats.trackCount}
        cachedMB={cachedStats.approxSizeMB}
      />

      {/* Share With Friends Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShowToast={showToast}
      />
    </div>
  );
}
