import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Download,
  Smartphone,
  X,
  Share,
  PlusSquare,
  CheckCircle2,
  FolderArchive,
  Laptop,
  Loader2,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { downloadAsset } from '../utils/downloadAsset';

interface PWAInstallButtonProps {
  variant?: 'topbar' | 'sidebar' | 'hero';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'topbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  // Hide automatically when already running as an installed standalone app
  if (isInstalled) {
    return null;
  }

  // Hide when opened directly via file:// portable HTML
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    return null;
  }

  const isInsideIframe =
    typeof window !== 'undefined' && window.self !== window.top;

  const currentPublicUrl =
    typeof window !== 'undefined'
      ? window.location.href.includes('ais-dev-')
        ? window.location.href.replace('ais-dev-', 'ais-pre-')
        : window.location.href
      : 'https://claichy-1.onrender.com';

  const handleClick = async () => {
    setDownloadStatus(null);
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  const handleDownload = async (
    key: string,
    primaryUrl: string,
    fallbackUrl: string,
    filename: string
  ) => {
    setDownloadingKey(key);
    setDownloadStatus(null);
    const result = await downloadAsset(primaryUrl, fallbackUrl, filename);
    setDownloadingKey(null);
    if (result.ok) {
      setDownloadStatus({
        type: 'ok',
        text: `¡Descargado "${filename}"! Revisa tu carpeta de Descargas.`,
      });
    } else {
      setDownloadStatus({
        type: 'err',
        text: result.error || 'No se pudo descargar el archivo.',
      });
    }
  };

  const modalContent =
    showGuideModal && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
            onClick={() => setShowGuideModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0e121a] w-full max-w-md max-h-[90dvh] flex flex-col rounded-2xl border border-amber-500/25 shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-amber-500/15 via-transparent to-transparent shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">
                      Instalar Setup y Descargar
                    </h3>
                    <p className="text-[10px] text-amber-400/80 font-mono uppercase truncate">
                      Todo Pre-cargado & Listo Offline
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-5 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1">
                {downloadStatus && (
                  <div
                    className={`p-3 rounded-xl border flex items-start gap-2 text-xs font-medium ${
                      downloadStatus.type === 'ok'
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {downloadStatus.type === 'ok' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <span>{downloadStatus.text}</span>
                  </div>
                )}

                {/* Native Setup Install Section */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 shrink-0" />
                    <span>1. Instalar Setup como App (Acceso Directo)</span>
                  </p>

                  {isInstallable ? (
                    <button
                      onClick={() => install()}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-xs hover:brightness-105 transition-all shadow-md cursor-pointer"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Iniciar Setup de Instalación Ahora</span>
                    </button>
                  ) : isIOS ? (
                    <div className="space-y-2 bg-white/[0.04] p-3 rounded-xl border border-white/[0.07]">
                      <p className="flex items-center gap-2">
                        <Share className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          1. Toca <strong>Compartir</strong> abajo en Safari.
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <PlusSquare className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          2. Selecciona <strong>Agregar a inicio</strong>.
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 bg-white/[0.04] p-3 rounded-xl border border-white/[0.07]">
                      {isInsideIframe && (
                        <a
                          href={currentPublicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 font-bold text-[11px] transition-all mb-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span>Abrir en pestaña normal para lanzar Setup</span>
                        </a>
                      )}
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>En PC (Chrome / Edge / Opera):</strong> Haz clic en el icono de{' '}
                          <strong>Instalar</strong> arriba a la derecha en la barra de dirección (o en{' '}
                          <strong>Menú ⋮ ➔ Instalar Claichy</strong>) para instalar el Setup directo en tu escritorio.
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>En Android:</strong> Toca el menú <strong>⋮</strong> y elige{' '}
                          <strong>Instalar aplicación</strong>.
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Direct File Downloads */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <p className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>2. Descargar Archivos (Funciona sin internet)</span>
                  </p>

                  <button
                    type="button"
                    disabled={downloadingKey !== null}
                    onClick={() =>
                      handleDownload(
                        'portable',
                        '/api/download-portable',
                        '/Claichy-Portable.html',
                        'Claichy-Abrir-Aqui.html'
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-xs hover:brightness-105 transition-all shadow-md text-center cursor-pointer disabled:opacity-60"
                  >
                    {downloadingKey === 'portable' ? (
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    ) : (
                      <Download className="w-4 h-4 stroke-[2.5] shrink-0" />
                    )}
                    <span>
                      {downloadingKey === 'portable'
                        ? 'Descargando App Portable...'
                        : 'Descargar App Portable (1 Archivo HTML)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={downloadingKey !== null}
                    onClick={() =>
                      handleDownload(
                        'zip',
                        '/api/download-zip',
                        '/claichy-source.zip',
                        'claichy-app.zip'
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 font-semibold text-[11px] transition-all text-center cursor-pointer disabled:opacity-60"
                  >
                    {downloadingKey === 'zip' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
                    ) : (
                      <FolderArchive className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    <span>
                      {downloadingKey === 'zip'
                        ? 'Preparando claichy-app.zip...'
                        : 'Descargar Código Completo (.ZIP para GitHub)'}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => setShowGuideModal(false)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {variant === 'sidebar' ? (
        <button
          onClick={handleClick}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:from-amber-500/30 hover:to-yellow-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 transition-all text-left group cursor-pointer"
          title="Descargar e instalar Claichy como aplicación en tu dispositivo"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold truncate">Descargar App</p>
            <p className="text-[10px] text-amber-400/80 truncate">Instalar Setup offline</p>
          </div>
        </button>
      ) : variant === 'hero' ? (
        <button
          onClick={handleClick}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-amber-400/40 text-amber-300 hover:text-amber-200 font-bold text-xs md:text-sm transition-all cursor-pointer"
          title="Descargar o instalar Claichy en tu celular o PC"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Descargar App</span>
        </button>
      ) : (
        <button
          onClick={handleClick}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-105 transition-all shadow-[0_2px_12px_rgba(245,158,11,0.3)] cursor-pointer shrink-0"
          title="Descargar o instalar Claichy en tu celular o computadora"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Descargar</span>
        </button>
      )}

      {modalContent}
    </>
  );
};
