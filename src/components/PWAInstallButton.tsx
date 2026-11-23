import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  X,
  Share,
  PlusSquare,
  CheckCircle2,
  FolderArchive,
  Laptop,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'topbar' | 'sidebar' | 'hero';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'topbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Hide automatically when already running as an installed standalone app
  if (isInstalled) {
    return null;
  }

  // Hide when opened directly via file:// portable HTML
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

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
            <p className="text-[10px] text-amber-400/80 truncate">Preinstalada & offline</p>
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

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0e121a] w-full max-w-md rounded-2xl border border-amber-500/25 shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-amber-500/15 via-transparent to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Descargar e Instalar Claichy</h3>
                  <p className="text-[10px] text-amber-400/80 font-mono uppercase">
                    Todo Pre-cargado & Listo Offline
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-300 leading-relaxed">
              {/* Direct File Downloads */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5" />
                  Descarga Directa (1 clic)
                </p>

                <a
                  href="/api/download-portable"
                  download="Claichy-Abrir-Aqui.html"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-xs hover:brightness-105 transition-all shadow-md"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Descargar App Portable (1 Archivo HTML)</span>
                </a>

                <a
                  href="/api/download-zip"
                  download="claichy-app.zip"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 font-semibold text-[11px] transition-all"
                >
                  <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
                  <span>Descargar Código Completo (.ZIP para GitHub / Render)</span>
                </a>
              </div>

              {/* Native App / PWA Install Instructions */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <p className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  Instalar como App sin navegador (PWA)
                </p>

                {isIOS ? (
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
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>En PC (Chrome / Edge / Opera):</strong> Haz clic en el icono de{' '}
                        <strong>Instalar</strong> arriba a la derecha en la barra de dirección (o menú{' '}
                        <strong>⋮ ➔ Guardar y compartir ➔ Instalar</strong>).
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

              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
