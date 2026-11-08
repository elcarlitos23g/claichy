export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  youtubeId: string;
  coverUrl: string;
  genre: string;
  lyrics?: TimedLyric[];
  rawLyrics?: string;
  isLocalAudio?: boolean;
  audioBlobId?: string; // id in IndexedDB for local MP3/audio files
  isDownloaded?: boolean;
  musicalKey?: string;
  bpm?: number;
  addedAt?: string;
}

export interface TimedLyric {
  time: number; // in seconds
  text: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  color?: string; // gradient color accent
  tracks: Song[];
  createdAt: string;
  isOfflineAvailable: boolean;
  isCustom?: boolean;
  isLikedSongs?: boolean;
  author?: string;
}

export type ViewType = 
  | 'home'
  | 'search'
  | 'library'
  | 'playlist'
  | 'artist'
  | 'lyrics'
  | 'queue';

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  currentTrack: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 100
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Song[];
  queueIndex: number;
  isBuffering: boolean;
  isOfflineMode: boolean;
  showMiniVideo: boolean;
  showLyrics: boolean;
  showQueue: boolean;
  audioSource: 'youtube' | 'local_file' | 'synth_offline';
}

export interface Artist {
  id: string;
  name: string;
  monthlyListeners: string;
  avatarUrl: string;
  bio: string;
  genres: string[];
  topTracks: Song[];
}
