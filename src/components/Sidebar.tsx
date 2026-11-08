import React from 'react';
import {
  Compass,
  Search,
  Disc3,
  Plus,
  Heart,
  HardDriveDownload,
  FileAudio,
  Sparkles,
  Wifi,
  WifiOff,
  Layers,
  Share2,
} from 'lucide-react';
import { Playlist, ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType, data?: any) => void;
  customPlaylists: Playlist[];
  likedSongsCount: number;
  activePlaylistId: string | null;
  onOpenCreatePlaylist: () => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  onOpenOfflineManager: () => void;
  onOpenUploadLocal: () => void;
  onOpenShareModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  customPlaylists,
  likedSongsCount,
  activePlaylistId,
  onOpenCreatePlaylist,
  isOfflineMode,
  onToggleOfflineMode,
  onOpenOfflineManager,
  onOpenUploadLocal,
  onOpenShareModal,
}) => {
  return (
    <aside className="hidden md:flex w-68 xl:w-72 2xl:w-80 bg-[#090b10] flex-col h-full select-none shrink-0 border-r border-white/[0.06] p-3 xl:p-4 gap-3 text-sm relative z-20">
      {/* Brand Header */}
      <div className="p-3 pb-2 flex items-center justify-between">
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
            <div className="w-full h-full bg-[#090b10] rounded-[10px] flex items-center justify-center text-amber-400 group-hover:scale-95 transition-transform">
              <Disc3 className="w-5 h-5 animate-spin-slow" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-base tracking-widest text-white uppercase block leading-tight font-mono">
              CLAICHY
            </span>
            <span className="text-[10px] text-amber-400/80 font-medium tracking-wider uppercase block">
              Audio Studio
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1 px-1">
        <button
          onClick={() => onNavigate('home')}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all text-left ${
            currentView === 'home'
              ? 'bg-gradient-to-r from-amber-500/15 to-transparent text-amber-300 border-l-2 border-amber-400 shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Explorar Sonidos</span>
        </button>

        <button
          onClick={() => onNavigate('search')}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all text-left ${
            currentView === 'search'
              ? 'bg-gradient-to-r from-amber-500/15 to-transparent text-amber-300 border-l-2 border-amber-400 shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Búsqueda Universal</span>
        </button>

        <button
          onClick={() => onNavigate('library')}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all text-left ${
            currentView === 'library'
              ? 'bg-gradient-to-r from-amber-500/15 to-transparent text-amber-300 border-l-2 border-amber-400 shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tu Colección</span>
        </button>
      </nav>

      {/* Quick Collections & Offline Box */}
      <div className="flex-1 flex flex-col min-h-0 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3 overflow-hidden">
        {/* Liked songs & Upload Action */}
        <div className="flex flex-col gap-1 pb-3 border-b border-white/[0.06]">
          <button
            onClick={() => onNavigate('playlist', { id: 'liked-songs' })}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left group ${
              activePlaylistId === 'liked-songs'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'text-neutral-300 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold truncate">Favoritos Guardados</p>
              <p className="text-[10px] text-neutral-400">{likedSongsCount} temas</p>
            </div>
          </button>

          <button
            onClick={onOpenUploadLocal}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-neutral-300 shrink-0">
              <FileAudio className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-medium truncate">Subir Audio Local</p>
              <p className="text-[10px] text-neutral-500">MP3 / WAV sin conexión</p>
            </div>
          </button>
        </div>

        {/* Offline Mode Indicator Tile */}
        <div className="my-3 p-2.5 rounded-xl bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {isOfflineMode ? (
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <div className="truncate">
              <p className="text-[11px] font-semibold text-white leading-tight">
                {isOfflineMode ? 'Modo Offline' : 'En Línea'}
              </p>
              <button
                onClick={onOpenOfflineManager}
                className="text-[10px] text-amber-400/90 hover:underline"
              >
                Caché local
              </button>
            </div>
          </div>

          <button
            onClick={onToggleOfflineMode}
            className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
              isOfflineMode ? 'bg-amber-500' : 'bg-neutral-700'
            }`}
            title="Activar/desactivar modo sin conexión"
          >
            <span
              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                isOfflineMode ? 'left-4.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Custom Playlists Header */}
        <div className="flex items-center justify-between px-1 py-1 mb-1">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
            Tus Listas ({customPlaylists.length})
          </span>
          <button
            onClick={onOpenCreatePlaylist}
            className="w-6 h-6 rounded-md bg-white/[0.06] hover:bg-amber-500/20 text-neutral-400 hover:text-amber-400 flex items-center justify-center transition-colors"
            title="Crear nueva lista"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Playlists scroll area */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {customPlaylists.length === 0 ? (
            <div className="p-4 text-center text-neutral-500 text-xs">
              <p>Sin listas creadas.</p>
              <button
                onClick={onOpenCreatePlaylist}
                className="mt-1 text-amber-400 hover:underline text-[11px]"
              >
                + Crear primera lista
              </button>
            </div>
          ) : (
            customPlaylists.map((pl) => {
              const isActive = activePlaylistId === pl.id;
              return (
                <button
                  key={pl.id}
                  onClick={() => onNavigate('playlist', { id: pl.id })}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-white border border-amber-500/30 shadow-sm'
                      : 'text-neutral-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <img
                    src={pl.coverUrl}
                    alt={pl.title}
                    className="w-8 h-8 rounded-lg object-cover bg-neutral-800 shrink-0 border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate flex-1">
                    <p className="text-xs font-semibold truncate text-neutral-200">
                      {pl.title}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate">
                      {pl.tracks.length} temas
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Share app with friends button */}
        {onOpenShareModal && (
          <button
            onClick={onOpenShareModal}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-transparent hover:from-amber-500/20 hover:via-yellow-500/20 text-amber-300 hover:text-amber-200 text-xs font-semibold border border-amber-500/20 transition-all group shrink-0"
          >
            <Share2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-amber-400" />
            <span>Compartir con amigos</span>
          </button>
        )}
      </div>
    </aside>
  );
};
