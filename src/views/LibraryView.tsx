import React, { useState } from 'react';
import {
  Plus,
  Heart,
  DownloadCloud,
  FileAudio,
  Music,
  Play,
  HardDriveDownload,
  Upload,
  Disc3,
  Layers,
} from 'lucide-react';
import { Playlist, Song } from '../types';

interface LibraryViewProps {
  playlists: Playlist[];
  likedSongsCount: number;
  onSelectPlaylist: (playlist: Playlist) => void;
  onOpenCreatePlaylist: () => void;
  onOpenUploadLocal: () => void;
  onPlaySong: (song: Song, context?: Song[]) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  playlists,
  likedSongsCount,
  onSelectPlaylist,
  onOpenCreatePlaylist,
  onOpenUploadLocal,
  onPlaySong,
}) => {
  const [filter, setFilter] = useState<'all' | 'custom' | 'offline'>('all');

  const filteredPlaylists = playlists.filter((p) => {
    if (filter === 'custom') return p.isCustom;
    if (filter === 'offline') return p.isOfflineAvailable;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 xl:p-10 2xl:p-12 space-y-5 sm:space-y-8 max-w-[1880px] mx-auto w-full">
      {/* Header and Quick CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 shrink-0" />
            <span>Tu Colección & Listas</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Organiza tus listas de reproducción y gestiona tu música disponible sin conexión
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenUploadLocal}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 hover:text-white border border-white/[0.08] transition-all"
          >
            <FileAudio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span>Subir MP3</span>
          </button>

          <button
            onClick={onOpenCreatePlaylist}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
            <span>Nueva Lista</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
            filter === 'all'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
          }`}
        >
          Todas ({playlists.length})
        </button>

        <button
          onClick={() => setFilter('custom')}
          className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
            filter === 'custom'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
          }`}
        >
          Creadas por ti ({playlists.filter((p) => p.isCustom).length})
        </button>

        <button
          onClick={() => setFilter('offline')}
          className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
            filter === 'offline'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
          }`}
        >
          <HardDriveDownload className="w-3.5 h-3.5" />
          <span>Sin Conexión ({playlists.filter((p) => p.isOfflineAvailable).length})</span>
        </button>
      </div>

      {/* Grid of Playlists */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 xl:gap-5">
        {/* Liked Songs Special Vinyl Card */}
        {filter !== 'custom' && (
          <div
            onClick={() =>
              onSelectPlaylist({
                id: 'liked-songs',
                title: 'Tus Me Gusta',
                description: 'Canciones que te han gustado en Claichy',
                coverUrl: '',
                tracks: [],
                createdAt: '2024-01-01',
                isOfflineAvailable: true,
                isLikedSongs: true,
              })
            }
            className="h-full bg-gradient-to-br from-rose-600 via-amber-600 to-amber-700 p-5 rounded-2xl cursor-pointer group flex flex-col justify-between shadow-xl relative overflow-hidden min-h-[230px] border border-white/10 hover:scale-[1.02] transition-transform"
          >
            <div>
              <span className="text-[10px] text-white/80 font-mono font-bold uppercase tracking-wider block mb-2">
                COLECCIÓN ESPECIAL
              </span>
              <h3 className="text-2xl font-black text-white leading-tight">
                Favoritos Guardados
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/90">
                {likedSongsCount} temas guardados
              </span>
              <div className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <Heart className="w-5 h-5 fill-current text-white" />
              </div>
            </div>
          </div>
        )}

        {/* User and Curated Playlists */}
        {filteredPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => onSelectPlaylist(playlist)}
            className="bg-white/[0.02] hover:bg-white/[0.06] p-4 rounded-2xl transition-all cursor-pointer group flex flex-col border border-white/[0.05] hover:border-amber-400/30 shadow-md"
          >
            <div className="relative aspect-square mb-3.5 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shadow-md">
              <img
                src={playlist.coverUrl}
                alt={playlist.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (playlist.tracks.length > 0) {
                    onPlaySong(playlist.tracks[0], playlist.tracks);
                  }
                }}
                className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title="Reproducir"
              >
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
              </button>

              {playlist.isOfflineAvailable && (
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-bold border border-amber-400/30">
                  Offline
                </div>
              )}
            </div>

            <h3 className="font-bold text-sm text-white truncate mb-0.5 group-hover:text-amber-300 transition-colors">
              {playlist.title}
            </h3>
            <p className="text-xs text-neutral-400 truncate">
              {playlist.tracks.length} temas {playlist.isCustom ? '· Creada por ti' : '· Claichy'}
            </p>
          </div>
        ))}
      </div>

      {filteredPlaylists.length === 0 && (
        <div className="p-16 text-center text-neutral-400 bg-white/[0.02] rounded-3xl border border-white/[0.06] space-y-3">
          <Disc3 className="w-10 h-10 mx-auto opacity-30 text-amber-400" />
          <p className="text-base font-bold text-white">
            No se encontraron listas en este filtro
          </p>
          <button
            onClick={onOpenCreatePlaylist}
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:scale-105 transition-all shadow"
          >
            Crear Nueva Lista
          </button>
        </div>
      )}
    </div>
  );
};
