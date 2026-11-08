import React, { useState } from 'react';
import {
  Play,
  Pause,
  Heart,
  Clock,
  DownloadCloud,
  MoreHorizontal,
  Edit2,
  Trash2,
  Plus,
  Music,
  Disc3,
  HardDrive,
} from 'lucide-react';
import { Playlist, Song } from '../types';

interface PlaylistDetailViewProps {
  playlist: Playlist;
  currentTrack: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song, context?: Song[]) => void;
  onPlayAll: (playlist: Playlist) => void;
  onToggleLike: (songId: string) => void;
  isLiked: (songId: string) => boolean;
  onToggleOfflineDownload: (playlistId: string) => void;
  onRemoveTrack: (playlistId: string, songId: string) => void;
  onEditPlaylist: (playlist: Playlist) => void;
  onDeletePlaylist: (playlistId: string) => void;
  onAddToQueue: (song: Song) => void;
  onOpenAddToPlaylist: (song: Song) => void;
  onOpenSearchToAdd: () => void;
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlist,
  currentTrack,
  isPlaying,
  onPlaySong,
  onPlayAll,
  onToggleLike,
  isLiked,
  onToggleOfflineDownload,
  onRemoveTrack,
  onEditPlaylist,
  onDeletePlaylist,
  onAddToQueue,
  onOpenAddToPlaylist,
  onOpenSearchToAdd,
}) => {
  const [activeMenuSongId, setActiveMenuSongId] = useState<string | null>(null);

  const totalDurationSecs = playlist.tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalMinutes = Math.floor(totalDurationSecs / 60);

  const isCurrentPlaylistPlaying =
    isPlaying && currentTrack && playlist.tracks.some((t) => t.id === currentTrack.id);

  const headerBgColor = playlist.color || '#E0A96D';

  return (
    <div className="pb-20 min-h-full">
      {/* Dynamic Ambient Header Banner */}
      <div
        className="p-4 sm:p-6 md:p-10 xl:p-12 pt-6 sm:pt-12 flex flex-col md:flex-row items-center text-center md:items-end md:text-left gap-6 sm:gap-8 xl:gap-10 relative overflow-hidden transition-colors duration-700 max-w-[1880px] mx-auto w-full"
        style={{
          background: `linear-gradient(180deg, ${headerBgColor}22 0%, #090b10 100%)`,
        }}
      >
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: headerBgColor }}
        />

        {/* Vinyl Cover Art Sleeve with peeking disc */}
        <div className="relative group shrink-0 my-2 md:my-0">
          <div
            className={`absolute -right-2 sm:-right-3 top-1 sm:top-2 w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-neutral-950 border border-neutral-800 shadow-2xl transition-transform duration-500 ${
              isCurrentPlaylistPlaying
                ? 'animate-spin-slow translate-x-4 sm:translate-x-6'
                : 'group-hover:translate-x-3 sm:group-hover:translate-x-4'
            }`}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400" />
              </div>
            </div>
          </div>

          <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 border border-white/10 z-10">
            {playlist.isLikedSongs ? (
              <div className="w-full h-full bg-gradient-to-br from-rose-600 via-amber-600 to-amber-700 flex items-center justify-center text-white">
                <Heart className="w-16 h-16 sm:w-20 sm:h-20 fill-current drop-shadow-md" />
              </div>
            ) : (
              <img
                src={playlist.coverUrl}
                alt={playlist.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0 flex-1 relative z-10 items-center md:items-start">
          <span className="text-[10px] sm:text-[11px] uppercase font-mono font-bold tracking-widest text-amber-400">
            {playlist.isLikedSongs ? 'COLECCIÓN ESPECIAL' : 'DISCOGRAFÍA / LISTA PERSONALIZADA'}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
            {playlist.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
            {playlist.description}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-neutral-400 mt-2 font-medium">
            <span className="text-white font-bold">{playlist.author || 'Tú'}</span>
            <span>·</span>
            <span>{playlist.tracks.length} canciones</span>
            <span>·</span>
            <span>{totalMinutes} min</span>
            {playlist.isOfflineAvailable && (
              <>
                <span>·</span>
                <span className="text-amber-400 flex items-center gap-1 font-semibold text-[11px] sm:text-xs">
                  <DownloadCloud className="w-3.5 h-3.5" />
                  Disponible sin conexión
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="px-4 sm:px-6 md:px-10 xl:px-12 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-[#090b10]/80 backdrop-blur-md max-w-[1880px] mx-auto w-full">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Glowing Play All Button */}
          <button
            onClick={() => onPlayAll(playlist)}
            disabled={playlist.tracks.length === 0}
            className="flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title={isCurrentPlaylistPlaying ? 'Pausar' : 'Reproducir lista'}
          >
            {isCurrentPlaylistPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
            <span>{isCurrentPlaylistPlaying ? 'Pausar' : 'Reproducir'}</span>
          </button>

          {/* Download for Offline Switch */}
          <button
            onClick={() => onToggleOfflineDownload(playlist.id)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all border ${
              playlist.isOfflineAvailable
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-white/[0.04] text-neutral-300 border-white/[0.08] hover:border-white/20'
            }`}
            title="Activar/desactivar descarga sin conexión"
          >
            <DownloadCloud className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">{playlist.isOfflineAvailable ? 'Descargada (Offline)' : 'Descargar para Offline'}</span>
            <span className="sm:hidden">{playlist.isOfflineAvailable ? 'Offline' : 'Descargar'}</span>
          </button>

          {/* Add Songs */}
          <button
            onClick={onOpenSearchToAdd}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 hover:text-white border border-white/[0.08] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir temas</span>
          </button>
        </div>

        {/* Custom Playlist Options */}
        {playlist.isCustom && !playlist.isLikedSongs && (
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            <button
              onClick={() => onEditPlaylist(playlist)}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors"
              title="Editar lista"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeletePlaylist(playlist.id)}
              className="p-2 text-neutral-400 hover:text-rose-400 rounded-xl hover:bg-white/[0.06] transition-colors"
              title="Eliminar lista"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tracks Table */}
      <div className="px-3 sm:px-6 md:px-10 xl:px-12 mt-4 sm:mt-5 max-w-[1880px] mx-auto w-full">
        {playlist.tracks.length === 0 ? (
          <div className="py-16 sm:py-20 text-center text-neutral-400 space-y-3 bg-white/[0.01] rounded-2xl sm:rounded-3xl border border-white/[0.04] p-4">
            <Disc3 className="w-10 h-10 sm:w-12 sm:h-12 mx-auto opacity-30 text-amber-400" />
            <p className="text-sm sm:text-base font-bold text-white">Esta colección no tiene canciones aún</p>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Utiliza el buscador universal para encontrar temas de cualquier artista y agrégalos a tu lista.
            </p>
            <button
              onClick={onOpenSearchToAdd}
              className="mt-2 inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:scale-105 transition-all shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Explorar Artistas</span>
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 sm:gap-4 px-2 sm:px-4 py-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 border-b border-white/[0.06]">
              <span className="col-span-1 text-center">#</span>
              <span className="col-span-8 sm:col-span-7 md:col-span-5">Pista / Artista</span>
              <span className="hidden md:block md:col-span-3">Álbum</span>
              <span className="hidden lg:block lg:col-span-2">Agregada</span>
              <span className="col-span-3 sm:col-span-4 md:col-span-3 lg:col-span-1 flex justify-end pr-1 sm:pr-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
            </div>

            {/* Song Rows */}
            {playlist.tracks.map((song, index) => {
              const isCurrent = currentTrack?.id === song.id;
              const isRowPlaying = isCurrent && isPlaying;
              const liked = isLiked(song.id);

              return (
                <div
                  key={`${song.id}-${index}`}
                  onClick={() => onPlaySong(song, playlist.tracks)}
                  className={`grid grid-cols-12 gap-2 sm:gap-4 items-center px-2 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl cursor-pointer group transition-all ${
                    isCurrent
                      ? 'bg-amber-500/10 border border-amber-500/20'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  {/* # Index / Hover Play Button */}
                  <div className="col-span-1 flex items-center justify-center">
                    <span
                      className={`text-[11px] sm:text-xs font-mono group-hover:hidden tabular-nums ${
                        isCurrent ? 'text-amber-400 font-bold' : 'text-neutral-500'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <button
                      className="hidden group-hover:block text-amber-400"
                      title="Reproducir"
                    >
                      {isRowPlaying ? (
                        <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                      )}
                    </button>
                  </div>

                  {/* Title & Artist */}
                  <div className="col-span-8 sm:col-span-7 md:col-span-5 flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-cover shadow border border-white/10 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate flex-1 min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isCurrent
                            ? 'text-amber-300 font-bold'
                            : 'text-white group-hover:text-amber-200'
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-[11px] sm:text-xs text-neutral-400 truncate mt-0.5">
                        {song.artist}
                        {song.isLocalAudio && (
                          <span className="ml-1 text-[9px] sm:text-[10px] text-amber-400 bg-amber-400/10 px-1 rounded">
                            Local MP3
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Album */}
                  <div className="hidden md:block md:col-span-3 text-xs text-neutral-400 truncate">
                    {song.album}
                  </div>

                  {/* Added date */}
                  <div className="hidden lg:block lg:col-span-2 text-xs text-neutral-500 truncate">
                    {song.addedAt || 'Reciente'}
                  </div>

                  {/* Actions & Duration */}
                  <div className="col-span-3 sm:col-span-4 md:col-span-3 lg:col-span-1 flex items-center justify-end gap-1.5 sm:gap-3 text-xs font-mono text-neutral-400">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(song.id);
                      }}
                      className={`p-1 transition-colors ${
                        liked ? 'text-rose-500' : 'text-neutral-500 hover:text-white sm:opacity-0 sm:group-hover:opacity-100'
                      }`}
                      title={liked ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                    >
                      <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${liked ? 'fill-current opacity-100' : ''}`} />
                    </button>

                    <span className="hidden sm:inline-block w-10 text-right tabular-nums">
                      {Math.floor(song.duration / 60)}:
                      {(song.duration % 60).toString().padStart(2, '0')}
                    </span>

                    {/* Options Menu Toggle */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuSongId(
                            activeMenuSongId === song.id ? null : song.id
                          );
                        }}
                        className="p-1 rounded text-neutral-400 hover:text-white sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                        title="Más opciones"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>

                      {activeMenuSongId === song.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-8 z-50 w-48 bg-[#141824] border border-white/10 rounded-xl shadow-2xl py-1.5 text-xs text-neutral-200"
                        >
                          <button
                            onClick={() => {
                              onAddToQueue(song);
                              setActiveMenuSongId(null);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-white/[0.08] hover:text-white transition-colors"
                          >
                            Añadir a la cola
                          </button>
                          <button
                            onClick={() => {
                              onOpenAddToPlaylist(song);
                              setActiveMenuSongId(null);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-white/[0.08] hover:text-white transition-colors"
                          >
                            Añadir a otra lista
                          </button>
                          {playlist.isCustom && (
                            <button
                              onClick={() => {
                                onRemoveTrack(playlist.id, song.id);
                                setActiveMenuSongId(null);
                              }}
                              className="w-full text-left px-3.5 py-2 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            >
                              Quitar de esta colección
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
