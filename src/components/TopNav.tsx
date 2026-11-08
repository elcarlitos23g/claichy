import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Wifi,
  WifiOff,
  Youtube,
  HardDrive,
  User,
  Radio,
  Share2,
} from 'lucide-react';
import { ViewType } from '../types';

interface TopNavProps {
  currentView: ViewType;
  onNavigate: (view: ViewType, data?: any) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  onOpenOfflineManager: () => void;
  onOpenDirectYouTubeModal: () => void;
  cachedCount: number;
  onOpenShareModal?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onNavigate,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  searchQuery,
  onSearchChange,
  isOfflineMode,
  onToggleOfflineMode,
  onOpenOfflineManager,
  onOpenDirectYouTubeModal,
  cachedCount,
  onOpenShareModal,
}) => {
  return (
    <header className="h-14 md:h-16 bg-[#090b10]/90 backdrop-blur-xl sticky top-0 z-30 px-3 sm:px-6 xl:px-8 flex items-center justify-between gap-2.5 sm:gap-4 border-b border-white/[0.06]">
      {/* Navigation Arrows & Search Input */}
      <div className="flex items-center gap-2 sm:gap-3.5 flex-1 max-w-xl xl:max-w-2xl 2xl:max-w-3xl min-w-0">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center transition-all ${
              canGoBack
                ? 'text-white hover:bg-white/[0.08] hover:border-amber-400/40 cursor-pointer'
                : 'text-neutral-600 opacity-30 cursor-not-allowed'
            }`}
            title="Atrás"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className={`hidden sm:flex w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] items-center justify-center transition-all ${
              canGoForward
                ? 'text-white hover:bg-white/[0.08] hover:border-amber-400/40 cursor-pointer'
                : 'text-neutral-600 opacity-30 cursor-not-allowed'
            }`}
            title="Adelante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar artista, canción o link..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (currentView !== 'search') {
                onNavigate('search');
              }
            }}
            onFocus={() => {
              if (currentView !== 'search') {
                onNavigate('search');
              }
            }}
            className="w-full h-8.5 sm:h-9.5 pl-8 sm:pl-10 pr-3 sm:pr-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] text-xs text-white placeholder-neutral-400 border border-white/[0.08] focus:border-amber-400/60 outline-none transition-all shadow-inner truncate"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Direct YouTube Link/ID button */}
        <button
          onClick={onOpenDirectYouTubeModal}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-red-600/10 to-amber-500/10 hover:from-red-600/20 hover:to-amber-500/20 text-neutral-200 hover:text-white transition-all border border-red-500/30 hover:border-red-500/50"
          title="Pegar enlace de YouTube"
        >
          <Youtube className="w-3.5 h-3.5 text-red-400" />
          <span>Pegar link</span>
        </button>

        {/* Share App Button */}
        {onOpenShareModal && (
          <button
            onClick={onOpenShareModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 transition-all shadow-sm"
            title="Compartir aplicación con amigos"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Compartir</span>
          </button>
        )}

        {/* Offline Mode Switch */}
        <button
          onClick={onToggleOfflineMode}
          className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            isOfflineMode
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
              : 'bg-white/[0.04] text-neutral-300 border-white/[0.08] hover:border-white/20'
          }`}
          title={isOfflineMode ? 'Modo sin conexión activo' : 'Modo en línea'}
        >
          {isOfflineMode ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Offline</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">En línea</span>
            </>
          )}
        </button>

        {/* Storage stats */}
        <button
          onClick={onOpenOfflineManager}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300 hover:text-white transition-all"
          title="Ver almacenamiento sin conexión"
        >
          <HardDrive className="w-3.5 h-3.5 text-amber-400" />
          <span>{cachedCount}</span>
        </button>

        {/* Profile Avatar */}
        <div
          onClick={onOpenOfflineManager}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 cursor-pointer hover:scale-105 transition-all shadow-sm"
          title="Bóveda offline y configuración"
        >
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
      </div>
    </header>
  );
};
