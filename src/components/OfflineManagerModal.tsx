import React, { useState, useRef } from 'react';
import {
  X,
  HardDriveDownload,
  WifiOff,
  Wifi,
  Upload,
  FileAudio,
  CheckCircle2,
  FolderDown,
  Disc3,
} from 'lucide-react';
import { Playlist, Song } from '../types';
import { offlineStorage } from '../services/offlineStorage';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  playlists: Playlist[];
  onImportLocalTracks: (newTracks: Song[]) => void;
  onRefreshStats: () => void;
  cachedCount: number;
  cachedMB: number;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOpen,
  onClose,
  isOfflineMode,
  onToggleOfflineMode,
  playlists,
  onImportLocalTracks,
  onRefreshStats,
  cachedCount,
  cachedMB,
}) => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const offlinePlaylists = playlists.filter((p) => p.isOfflineAvailable);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setUploadStatus(`Procesando ${files.length} archivo(s)...`);

    const importedSongs: Song[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const blobId = `local-blob-${Date.now()}-${i}`;

      // Save blob into IndexedDB
      await offlineStorage.saveAudioBlob(blobId, file);

      // Clean file title
      const fileNameClean = file.name.replace(/\.[^/.]+$/, '');
      const parts = fileNameClean.split(' - ');
      const artist = parts.length > 1 ? parts[0].trim() : 'Archivo Local';
      const title = parts.length > 1 ? parts[1].trim() : fileNameClean;

      const newSong: Song = {
        id: `local-song-${Date.now()}-${i}`,
        title,
        artist,
        album: 'Bóveda Local Claichy',
        duration: 180,
        youtubeId: '',
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
        genre: 'Audio Local',
        isLocalAudio: true,
        audioBlobId: blobId,
        isDownloaded: true,
      };

      await offlineStorage.cacheTrack(newSong);
      importedSongs.push(newSong);
    }

    onImportLocalTracks(importedSongs);
    onRefreshStats();
    setIsProcessing(false);
    setUploadStatus(`¡${importedSongs.length} pista(s) guardada(s) para reproducción 100% offline!`);
    setTimeout(() => setUploadStatus(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e121a]/95 w-full max-w-xl rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-amber-500/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <HardDriveDownload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Bóveda Sin Conexión & Almacenamiento
              </h2>
              <p className="text-[10px] text-amber-400/80 font-mono uppercase tracking-wider">
                Claichy Offline Audio Engine
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

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Main Switch Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/15 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {isOfflineMode ? (
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <WifiOff className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Wifi className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="font-bold text-sm text-white">
                  {isOfflineMode ? 'Modo Sin Conexión Activado' : 'Modo En Línea Universal'}
                </p>
                <p className="text-xs text-slate-400">
                  {isOfflineMode
                    ? 'Reproduciendo únicamente archivos locales y síntesis offline.'
                    : 'Transmisión legal en tiempo real desde YouTube y catálogo global.'}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleOfflineMode}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 ${
                isOfflineMode
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:scale-102 shadow-[0_2px_12px_rgba(245,158,11,0.3)]'
              }`}
            >
              {isOfflineMode ? 'Desactivar' : 'Activar Offline'}
            </button>
          </div>

          {/* Storage Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-xs text-slate-400 block mb-1">Canciones en caché local</span>
              <span className="text-2xl font-bold text-white font-mono">{cachedCount}</span>
              <span className="text-[11px] text-amber-400 block mt-1">Disponibles sin red</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-xs text-slate-400 block mb-1">Almacenamiento IndexedDB</span>
              <span className="text-2xl font-bold text-white font-mono">{cachedMB} MB</span>
              <span className="text-[11px] text-slate-400 block mt-1">En tu navegador seguro</span>
            </div>
          </div>

          {/* Local Audio File Uploader */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-amber-500/15 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Importar Archivos de Audio (MP3 / WAV)
                </h4>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">BÓVEDA LOCAL</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sube tus archivos de música locales para guardarlos permanentemente en la base de datos IndexedDB del navegador. Podrás reproducirlos incluso sin conexión a internet.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*,.mp3,.wav,.ogg,.m4a"
              multiple
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-dashed border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/10 text-white text-xs font-bold transition-all disabled:opacity-50 group"
            >
              <Upload className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{isProcessing ? 'Guardando archivos...' : 'Seleccionar pistas de tu equipo'}</span>
            </button>

            {uploadStatus && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-xs text-amber-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>

          {/* Offline Playlists List */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <FolderDown className="w-4 h-4 text-amber-400" />
              Listas configuradas para Modo Sin Conexión ({offlinePlaylists.length})
            </h4>

            {offlinePlaylists.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-center text-xs text-slate-400">
                <p>No hay listas marcadas para descarga sin conexión todavía.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Abre cualquier lista y activa el interruptor "Modo Sin Conexión" para prepararla.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {offlinePlaylists.map((pl) => (
                  <div
                    key={pl.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={pl.coverUrl}
                        alt={pl.title}
                        className="w-9 h-9 rounded-lg object-cover border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-xs font-semibold text-white">{pl.title}</p>
                        <p className="text-[11px] text-slate-400">
                          {pl.tracks.length} canciones almacenadas
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-amber-400 font-medium flex items-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      SINCRONIZADO
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-all"
          >
            Cerrar Bóveda
          </button>
        </div>
      </div>
    </div>
  );
};
