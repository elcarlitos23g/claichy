import React, { useState } from 'react';
import { X, FolderPlus, DownloadCloud, Disc3 } from 'lucide-react';
import { Playlist } from '../types';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (playlistData: Partial<Playlist>) => void;
  editingPlaylist?: Playlist | null;
}

const PRESET_COVERS = [
  '/src/assets/images/playlist_top_global_1794094172053.jpg',
  '/src/assets/images/playlist_urban_latino_1794094173265.jpg',
  '/src/assets/images/playlist_lofi_chill_1794094174055.jpg',
  '/src/assets/images/playlist_rock_classics_1794094172992.jpg',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
];

const PRESET_COLORS = [
  '#f59e0b', // Amber Claichy
  '#d97706', // Warm Ochre
  '#6366F1', // Indigo Neon
  '#10B981', // Emerald
  '#EC4899', // Crimson Rose
  '#8B5CF6', // Violet Space
];

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  editingPlaylist,
}) => {
  const [title, setTitle] = useState(editingPlaylist?.title || '');
  const [description, setDescription] = useState(editingPlaylist?.description || '');
  const [coverUrl, setCoverUrl] = useState(
    editingPlaylist?.coverUrl || PRESET_COVERS[0]
  );
  const [color, setColor] = useState(editingPlaylist?.color || PRESET_COLORS[0]);
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(
    editingPlaylist?.isOfflineAvailable || false
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      description: description.trim() || 'Lista curada en Claichy Audio Studio',
      coverUrl,
      color,
      isOfflineAvailable,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e121a]/95 w-full max-w-lg rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-amber-500/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {editingPlaylist ? 'Editar Colección' : 'Nueva Colección Claichy'}
              </h2>
              <p className="text-[10px] text-amber-400/70 font-mono uppercase tracking-wider">
                Sound Suite Playlist
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex gap-5">
            {/* Selected Cover Preview */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                <img
                  src={coverUrl}
                  alt="Portada"
                  className="w-32 h-32 rounded-xl object-cover shadow-2xl border border-white/10 bg-slate-900"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 rounded-xl bg-amber-500/10 pointer-events-none border border-amber-400/20" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">PORTADA VINILO</span>
            </div>

            {/* Inputs */}
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider mb-1">
                  Título de la lista *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Sesiones Nocturnas & Lofi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-900/90 text-white text-sm border border-white/10 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 outline-none transition-all placeholder-slate-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Nota o descripción
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe la atmósfera, artistas o estilo..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900/90 text-white text-xs border border-white/10 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 outline-none transition-all resize-none placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Cover Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Galería de portadas de estudio
            </label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COVERS.map((url, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setCoverUrl(url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    coverUrl === url
                      ? 'border-amber-400 scale-105 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Preset ${i}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Color Gradient Tone */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Aura cromática
            </label>
            <div className="flex gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white shadow-[0_0_12px_rgba(255,255,255,0.4)]' : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Offline Option */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/15">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <DownloadCloud className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Disponible en Modo Sin Conexión</p>
                <p className="text-[11px] text-slate-400">
                  Cachear metadatos y síntesis melódica en el dispositivo
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isOfflineAvailable}
              onChange={(e) => setIsOfflineAvailable(e.target.checked)}
              className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
            />
          </div>

          {/* Actions */}
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
              disabled={!title.trim()}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.35)] hover:scale-102 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingPlaylist ? 'Guardar Cambios' : 'Crear Colección'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
