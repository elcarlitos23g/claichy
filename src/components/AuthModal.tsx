import React, { useState } from 'react';
import {
  X,
  Cloud,
  LogIn,
  LogOut,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  isSyncing: boolean;
  playlistsCount: number;
  likedCount: number;
  onSignInGoogle: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  isSyncing,
  playlistsCount,
  likedCount,
  onSignInGoogle,
  onSignOut,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await onSignInGoogle();
      onClose();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setErrorMsg('Cerraste la ventana antes de completar el inicio de sesión.');
      } else if (code === 'auth/popup-blocked') {
        setErrorMsg(
          'Tu navegador bloqueó la ventana emergente de Google. Permite las ventanas emergentes para este sitio e inténtalo de nuevo.'
        );
      } else if (code === 'auth/unauthorized-domain') {
        setErrorMsg(
          `El dominio "${window.location.hostname}" aún no está autorizado en Firebase Authentication (Configuración -> Dominios autorizados).`
        );
      } else {
        setErrorMsg('No se pudo iniciar sesión con Google. Revisa tu conexión e inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await onSignOut();
      onClose();
    } catch {
      setErrorMsg('Error al cerrar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0e121a] w-full max-w-md max-h-[90dvh] flex flex-col rounded-2xl border border-amber-500/25 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-amber-500/15 via-transparent to-transparent shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {user ? 'Tu Cuenta en la Nube' : 'Iniciar Sesión en Claichy'}
              </h2>
              <p className="text-[10px] text-amber-400/80 font-mono uppercase">
                Respaldo Automático de Listas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Usuario'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/60 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center shrink-0">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate">
                    {user.displayName || 'Usuario Claichy'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <div className="mt-1 inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Sincronizando cambios...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Listas respaldadas en la nube</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                  <p className="text-lg font-black text-amber-400">{playlistsCount}</p>
                  <p className="text-[11px] text-slate-400">Listas en la nube</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                  <p className="text-lg font-black text-rose-400">{likedCount}</p>
                  <p className="text-[11px] text-slate-400">Favoritos guardados</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Si cambias de computadora, formateas tu disco o entras desde tu celular, solo inicia sesión con esta misma cuenta de Google y recuperarás todas tus listas y favoritos al instante.
              </p>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs transition-all cursor-pointer disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                <span>Cerrar sesión</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 space-y-2">
                <p className="text-white font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>No pierdas nunca tus listas ni tus favoritos</span>
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Al iniciar sesión con tu cuenta de Google, todas las listas que crees y tus canciones en{' '}
                  <strong>Tus Me Gusta</strong> se guardan automáticamente en la nube. Si formateas o cambias de PC o celular, tu música vuelve contigo al iniciar sesión.
                </p>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-xs hover:brightness-105 transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                )}
                <span>{loading ? 'Conectando con Google...' : 'Continuar con Google'}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 font-semibold text-xs transition-all cursor-pointer"
              >
                Seguir sin cuenta (solo local)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
