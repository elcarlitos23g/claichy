import React, { useState } from 'react';
import { X, Copy, Check, Share2, QrCode, MessageCircle, ExternalLink, Sparkles, Download, FolderArchive } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  // Use current window location or shared origin
  const shareUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const shareTitle = 'Claichy Audio Studio';
  const shareMessage = `¡Escucha música de todos los artistas en Claichy, con listas personalizadas y modo sin conexión! 🎶🔥`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      onShowToast('¡Enlace de Claichy copiado al portapapeles!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onShowToast('Copia manual: selecciona y copia el enlace abajo');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url: shareUrl,
        });
        onShowToast('¡Gracias por compartir Claichy!');
      } catch (err) {
        // User cancelled or aborted
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareMessage}\n${shareUrl}`
  )}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareMessage)}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}&bgcolor=0e121a&color=f59e0b`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e121a]/95 w-full max-w-md rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-amber-500/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Compartir Claichy con Amigos
              </h2>
              <p className="text-[10px] text-amber-400/80 font-mono uppercase tracking-wider">
                Música Universal & Sin Conexión
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-300 leading-relaxed">
            Tus amigos pueden abrir este enlace directamente desde cualquier teléfono o computadora sin instalar nada, para escuchar a todos sus artistas y crear sus propias listas.
          </p>

          {/* Copy Link Input Box */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider">
              Enlace directo de la aplicación
            </label>
            <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-slate-900/90 border border-white/10 focus-within:border-amber-400/60 transition-all">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-xs text-slate-200 font-mono flex-1 outline-none truncate select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  copied
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:scale-102 shadow-[0_2px_10px_rgba(245,158,11,0.3)]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-all group"
            >
              <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>WhatsApp</span>
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 hover:text-sky-300 text-xs font-semibold transition-all group"
            >
              <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Telegram</span>
            </a>
          </div>

          {/* Toggle QR Code View */}
          <div className="pt-1">
            <button
              onClick={() => setShowQr(!showQr)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-xs font-medium transition-all"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>{showQr ? 'Ocultar código QR' : 'Escanear con cámara del celular (QR)'}</span>
            </button>

            {showQr && (
              <div className="mt-3 p-4 rounded-xl bg-slate-900/90 border border-amber-500/20 flex flex-col items-center gap-2 animate-in fade-in duration-200">
                <img
                  src={qrCodeUrl}
                  alt="QR Code Claichy"
                  className="w-44 h-44 rounded-lg bg-slate-950 p-2 border border-white/10 shadow-lg"
                />
                <p className="text-[11px] text-slate-400 text-center">
                  Abre la cámara de cualquier teléfono para entrar de inmediato a Claichy.
                </p>
              </div>
            )}
          </div>

          {/* Download Complete Source Code for GitHub */}
          <div className="pt-1 border-t border-white/5">
            <a
              href="/api/download-zip"
              download="claichy-music-player.zip"
              onClick={() => onShowToast('Descargando código completo para GitHub...')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all group"
            >
              <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Descargar Código Completo (.ZIP para GitHub)</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/60 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Acceso público universal
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
