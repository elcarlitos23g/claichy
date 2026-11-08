import React, { useState } from 'react';
import { X, ExternalLink, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { Song } from '../types';

interface YouTubePlayerModalProps {
  currentTrack: Song | null;
  isOpen: boolean;
  onClose: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const YouTubePlayerModal: React.FC<YouTubePlayerModalProps> = ({
  currentTrack,
  isOpen,
  onClose,
}) => {
  const [isMinimizedTile, setIsMinimizedTile] = useState(false);

  // When isOpen is false, the container is placed completely out of sight
  // (underneath the app's solid background with opacity-0 and pointer-events-none)
  // while keeping healthy dimensions (240px x 180px) so the browser's autoplay
  // and power-saving policies never throttle or suspend background audio.
  return (
    <div
      className={`fixed transition-all duration-200 overflow-hidden ${
        isOpen
          ? `z-50 shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-2xl border border-amber-500/20 bg-[#0e121a]/95 backdrop-blur-xl opacity-100 pointer-events-auto ${
              isMinimizedTile
                ? 'bottom-24 right-6 w-64 h-auto'
                : 'bottom-24 right-6 w-80 md:w-96 h-auto'
            }`
          : 'bottom-0 left-0 w-[240px] h-[180px] pointer-events-none -z-50 opacity-[0.001] rounded-none border-0 shadow-none bg-transparent'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Top Header - ONLY rendered when user voluntarily opens the video window */}
      {isOpen && (
        <div className="bg-slate-950/90 px-3.5 py-2.5 flex items-center justify-between border-b border-white/5 select-none">
          <div className="flex items-center gap-2 truncate flex-1 min-w-0">
            <div className="w-4 h-4 rounded bg-amber-500 flex items-center justify-center text-slate-950 text-[9px] font-black shrink-0">
              ▶
            </div>
            <div className="truncate flex-1">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                Video Oficial
                <span title="Reproducción legal vía YouTube API">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                </span>
              </span>
              <p className="text-[10px] text-slate-400 truncate">
                {currentTrack?.title || 'Reproduciendo'} - {currentTrack?.artist || 'YouTube'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400 shrink-0 ml-2">
            {currentTrack?.youtubeId && (
              <a
                href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:text-white transition-colors"
                title="Abrir en YouTube oficial"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => setIsMinimizedTile(!isMinimizedTile)}
              className="p-1 hover:text-white transition-colors"
              title={isMinimizedTile ? 'Ampliar visor' : 'Modo mini'}
            >
              {isMinimizedTile ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded hover:text-white hover:bg-white/10 transition-colors"
              title="Cerrar ventana de video"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Real YouTube IFrame container - Stays continuously mounted in the DOM to avoid playback interruptions */}
      <div
        className={`relative w-full bg-black ${
          isOpen ? (isMinimizedTile ? 'h-36' : 'aspect-video') : 'w-full h-full'
        }`}
      >
        <div id="youtube-player-host" className="w-full h-full" />
      </div>

      {/* Footer bar - ONLY rendered when user voluntarily opens the video window */}
      {isOpen && (
        <div className="bg-slate-950/90 px-3.5 py-1.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5">
          <span className="text-amber-400 font-mono text-[9px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Claichy Video Sync
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-amber-300 transition-colors text-[10px]"
          >
            Ocultar visor
          </button>
        </div>
      )}
    </div>
  );
};
