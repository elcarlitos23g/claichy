import React from 'react';
import { X, Play, Trash2, ListMusic, Disc3 } from 'lucide-react';
import { Song } from '../types';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Song | null;
  queue: Song[];
  queueIndex: number;
  onSelectQueueIndex: (index: number) => void;
  onRemoveFromQueue: (index: number) => void;
  onClearQueue: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  currentTrack,
  queue,
  queueIndex,
  onSelectQueueIndex,
  onRemoveFromQueue,
  onClearQueue,
}) => {
  if (!isOpen) return null;

  const nextTracks = queue.slice(queueIndex + 1);

  return (
    <div className="fixed top-14 md:top-16 right-0 bottom-20 md:bottom-24 w-full sm:w-84 md:w-96 bg-[#0a0d14]/98 backdrop-blur-2xl border-l border-white/[0.08] z-40 p-4 sm:p-5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <ListMusic className="w-5 h-5 text-amber-400" />
          <h3 className="font-black text-white text-base">Cola de Reproducción</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-4">
        {/* Now Playing */}
        <div>
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-2">
            SONANDO AHORA
          </span>
          {currentTrack ? (
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-12 h-12 rounded-lg object-cover shadow border border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="truncate flex-1">
                <p className="font-bold text-sm text-amber-300 truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-neutral-400 truncate mt-0.5">
                  {currentTrack.artist}
                </p>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            </div>
          ) : (
            <p className="text-xs text-neutral-500 italic">No hay tema activo</p>
          )}
        </div>

        {/* Next in Queue */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
            SIGUIENTES PISTAS ({nextTracks.length})
          </span>
          {nextTracks.length > 0 && (
            <button
              onClick={onClearQueue}
              className="text-xs text-neutral-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              title="Vaciar cola de reproducción"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        {nextTracks.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-xs bg-white/[0.01] rounded-2xl border border-white/[0.04]">
            <Disc3 className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-400" />
            <p className="font-semibold text-neutral-400">La cola de reproducción está vacía.</p>
            <p className="opacity-70 mt-1">
              Las pistas de la lista actual continuarán automáticamente.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {nextTracks.map((track, i) => {
              const actualQueueIndex = queueIndex + 1 + i;
              return (
                <div
                  key={`${track.id}-${actualQueueIndex}`}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] group transition-colors"
                >
                  <div
                    onClick={() => onSelectQueueIndex(actualQueueIndex)}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="relative w-10 h-10 shrink-0">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full rounded-lg object-cover border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                        <Play className="w-4 h-4 text-amber-400 fill-current" />
                      </div>
                    </div>
                    <div className="truncate flex-1">
                      <p className="text-xs font-semibold text-neutral-200 group-hover:text-amber-300 truncate">
                        {track.title}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromQueue(actualQueueIndex)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-white/[0.06]"
                    title="Quitar de la cola"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
