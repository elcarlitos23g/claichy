import React from 'react';
import { X, Plus, Check, Disc3 } from 'lucide-react';
import { Playlist, Song } from '../types';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
  playlists: Playlist[];
  onToggleTrackInPlaylist: (playlistId: string, song: Song) => void;
  onOpenCreatePlaylist: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  song,
  playlists,
  onToggleTrackInPlaylist,
  onOpenCreatePlaylist,
}) => {
  if (!isOpen || !song) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e121a]/95 w-full max-w-md rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-amber-500/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-11 h-11 rounded-lg object-cover border border-white/10 shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Disc3 className="w-2.5 h-2.5 animate-spin-slow" />
              </div>
            </div>
            <div className="truncate">
              <h3 className="font-bold text-white text-sm tracking-wide">Añadir a Colección</h3>
              <p className="text-xs text-amber-400/90 truncate font-medium">
                {song.title} <span className="text-slate-400 font-normal">· {song.artist}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Playlists List */}
        <div className="p-4 max-h-80 overflow-y-auto space-y-2">
          {/* Create new playlist button */}
          <button
            onClick={() => {
              onClose();
              onOpenCreatePlaylist();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 text-slate-300 hover:text-white transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Crear nueva lista en Claichy...</span>
          </button>

          {playlists.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-6">
              Aún no tienes listas personalizadas creadas.
            </p>
          ) : (
            playlists.map((playlist) => {
              const isInPlaylist = playlist.tracks.some((t) => t.id === song.id);

              return (
                <div
                  key={playlist.id}
                  onClick={() => onToggleTrackInPlaylist(playlist.id, song)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer group transition-colors border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-amber-400 transition-colors">
                        {playlist.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {playlist.tracks.length} canciones
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                      isInPlaylist
                        ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                        : 'border-slate-600 group-hover:border-slate-300'
                    }`}
                  >
                    {isInPlaylist && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950/60 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-[0_2px_10px_rgba(245,158,11,0.3)] hover:scale-102 active:scale-98 transition-all"
          >
            Completar
          </button>
        </div>
      </div>
    </div>
  );
};
