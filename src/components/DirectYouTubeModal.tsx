import React, { useState } from 'react';
import { X, Youtube, Play, ShieldCheck, Radio } from 'lucide-react';
import { Song } from '../types';
import { youtubeManager } from '../services/youtube';

interface DirectYouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaySong: (song: Song) => void;
  onAddToPlaylistPrompt: (song: Song) => void;
}

export const DirectYouTubeModal: React.FC<DirectYouTubeModalProps> = ({
  isOpen,
  onClose,
  onPlaySong,
}) => {
  const [urlOrId, setUrlOrId] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customArtist, setCustomArtist] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleResolveAndPlay = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const videoId = youtubeManager.extractYouTubeId(urlOrId);
    if (!videoId) {
      setError('Enlace o ID de YouTube no válido. Asegúrate de ingresar un enlace o ID oficial.');
      return;
    }

    const song: Song = {
      id: `yt-${videoId}-${Date.now()}`,
      title: customTitle.trim() || `YouTube Stream (${videoId})`,
      artist: customArtist.trim() || 'Artista Oficial YouTube',
      album: 'Claichy Direct Feed',
      duration: 210,
      youtubeId: videoId,
      coverUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      genre: 'YouTube Direct',
      musicalKey: 'Am',
      bpm: 120,
    };

    onPlaySong(song);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e121a]/95 w-full max-w-lg rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-amber-500/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-red-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)]">
              <Youtube className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                Conectar Stream Directo
                <span title="100% Legal vía YouTube API">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </span>
              </h2>
              <p className="text-[10px] text-amber-400/80 font-mono uppercase tracking-wider">
                Reproducción de cualquier artista universal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleResolveAndPlay} className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider mb-1.5">
              Enlace o ID de YouTube
            </label>
            <input
              type="text"
              required
              placeholder="https://www.youtube.com/watch?v=... o video ID"
              value={urlOrId}
              onChange={(e) => {
                setUrlOrId(e.target.value);
                setError(null);
              }}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-900/90 text-white text-xs border border-white/10 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 outline-none transition-all placeholder-slate-500 font-mono"
              autoFocus
            />
            {error && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{error}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Título opcional
              </label>
              <input
                type="text"
                placeholder="Nombre del tema"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-900/90 text-white text-xs border border-white/10 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 outline-none transition-all placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Artista opcional
              </label>
              <input
                type="text"
                placeholder="Nombre del artista"
                value={customArtist}
                onChange={(e) => setCustomArtist(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-900/90 text-white text-xs border border-white/10 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 outline-none transition-all placeholder-slate-500"
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-white/5 text-xs text-slate-300 flex items-start gap-2.5">
            <Radio className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Totalmente compatible con los Términos de Servicio oficiales de YouTube IFrame API. Los derechos de autor y visualizaciones se acreditan legalmente a los creadores originales.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!urlOrId.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.35)] hover:scale-102 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Sintonizar Ahora</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
