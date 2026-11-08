import React, { useEffect, useRef } from 'react';
import { X, Mic2, Disc3, Sparkles } from 'lucide-react';
import { Song, TimedLyric } from '../types';

interface LyricsViewProps {
  currentTrack: Song | null;
  currentTime: number;
  onSeek: (seconds: number) => void;
  onClose: () => void;
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  currentTrack,
  currentTime,
  onSeek,
  onClose,
}) => {
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const lyrics = currentTrack?.lyrics || [];

  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  return (
    <div className="fixed inset-0 top-14 md:top-16 bottom-24 md:bottom-24 z-30 bg-gradient-to-b from-[#18130a]/98 via-[#0e111a]/98 to-[#07090e]/99 backdrop-blur-3xl p-4 sm:p-8 flex flex-col items-center justify-between overflow-hidden">
      {/* Top Header */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xl border border-white/10 shrink-0">
            <img
              src={currentTrack?.coverUrl}
              alt={currentTrack?.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-xl font-black text-white leading-tight">
              {currentTrack?.title || 'Letras'}
            </h2>
            <p className="text-sm text-amber-400/90 font-medium">
              {currentTrack?.artist || 'Selecciona una canción'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300 font-semibold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KARAOKE CLAICHY</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white transition-colors"
            title="Cerrar letras"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lyrics Content */}
      <div
        ref={containerRef}
        className="w-full max-w-3xl flex-1 overflow-y-auto py-12 px-4 space-y-8 text-center scroll-smooth"
      >
        {lyrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-3">
            <Mic2 className="w-12 h-12 opacity-30 text-amber-400" />
            <p className="text-lg font-bold text-white">No hay letras sincronizadas disponibles para este tema.</p>
            <p className="text-sm opacity-60">Disfruta de la reproducción oficial de YouTube en Claichy Studio.</p>
          </div>
        ) : (
          lyrics.map((line: TimedLyric, index: number) => {
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;

            return (
              <div
                key={index}
                ref={isActive ? activeLineRef : null}
                onClick={() => onSeek(line.time)}
                className={`cursor-pointer transition-all duration-300 text-2xl md:text-4xl font-extrabold tracking-tight select-none py-1.5 rounded-xl hover:text-white ${
                  isActive
                    ? 'text-amber-300 scale-105 drop-shadow-[0_0_25px_rgba(245,158,11,0.5)] opacity-100'
                    : isPast
                    ? 'text-white/40 hover:text-white/70'
                    : 'text-white/20 hover:text-white/50'
                }`}
              >
                {line.text}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Hint */}
      <div className="text-xs text-neutral-400 pb-1 flex items-center gap-2 font-mono">
        <Disc3 className="w-3.5 h-3.5 text-amber-400" />
        <span>Haz clic en cualquier frase para saltar directamente en la pista</span>
      </div>
    </div>
  );
};
