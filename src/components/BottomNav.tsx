import React from 'react';
import { Compass, Search, Layers, WifiOff, Wifi, Share2 } from 'lucide-react';
import { ViewType } from '../types';

interface BottomNavProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  isOfflineMode: boolean;
  onOpenOfflineManager: () => void;
  onOpenShareModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  isOfflineMode,
  onOpenOfflineManager,
  onOpenShareModal,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090e]/95 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-1.5 flex items-center justify-around safe-bottom">
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          currentView === 'home'
            ? 'text-amber-400 font-bold scale-105'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Explorar</span>
      </button>

      <button
        onClick={() => onNavigate('search')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          currentView === 'search'
            ? 'text-amber-400 font-bold scale-105'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Buscar</span>
      </button>

      <button
        onClick={() => onNavigate('library')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          currentView === 'library' || currentView === 'playlist'
            ? 'text-amber-400 font-bold scale-105'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Colección</span>
      </button>

      <button
        onClick={onOpenOfflineManager}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          isOfflineMode
            ? 'text-amber-400 font-bold scale-105'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        {isOfflineMode ? (
          <WifiOff className="w-5 h-5 text-amber-400 animate-pulse" />
        ) : (
          <Wifi className="w-5 h-5 text-emerald-400" />
        )}
        <span className="text-[10px] tracking-tight">
          {isOfflineMode ? 'Offline' : 'Bóveda'}
        </span>
      </button>

      <button
        onClick={onOpenShareModal}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all text-neutral-400 hover:text-amber-300"
      >
        <Share2 className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Compartir</span>
      </button>
    </nav>
  );
};
