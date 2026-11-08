import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  Mic2,
  ListMusic,
  Tv,
  Loader2,
  Disc3,
  Activity,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { PlayerState, Song } from '../types';

interface PlayerBarProps {
  playerState: PlayerState;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLyrics: () => void;
  onToggleQueue: () => void;
  onToggleMiniVideo: () => void;
  isLiked: boolean;
  onToggleLike: (songId: string) => void;
  onSelectArtist?: (artistName: string) => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  playerState,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLyrics,
  onToggleQueue,
  onToggleMiniVideo,
  isLiked,
  onToggleLike,
  onSelectArtist,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isBuffering,
    isOfflineMode,
    showLyrics,
    showQueue,
    showMiniVideo,
  } = playerState;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* ======================================================== */}
      {/* 1. MOBILE MINI PLAYER (Rendered on mobile screens < md)  */}
      {/* ======================================================== */}
      {currentTrack && (
        <div className="md:hidden fixed bottom-14 left-2 right-2 z-40 bg-[#0e121a]/95 backdrop-blur-2xl border border-amber-500/20 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Top Progress Micro Line */}
          <div className="w-full h-1 bg-white/10 relative">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="p-2 flex items-center justify-between gap-3">
            {/* Tappable Track Area: Opens Fullscreen Mobile Sheet */}
            <div
              onClick={() => setIsMobileExpanded(true)}
              className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer select-none"
            >
              <div className="relative shrink-0 w-11 h-11 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shadow">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Disc3 className="w-5 h-5 text-amber-400 animate-spin-slow" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 truncate">
                <p className="text-xs font-bold text-white truncate">
                  {currentTrack.title}
                </p>
                <p className="text-[11px] text-amber-400/90 truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(currentTrack.id);
                }}
                className={`p-2 transition-transform active:scale-125 ${
                  isLiked ? 'text-amber-400' : 'text-slate-400'
                }`}
                title="Favorito"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayPause();
                }}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30 active:scale-95 transition-all"
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isBuffering ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                title="Siguiente"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. FULLSCREEN MOBILE PLAYER SHEET (When user taps player) */}
      {/* ======================================================== */}
      {isMobileExpanded && currentTrack && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#07090e] text-white flex flex-col justify-between p-6 overflow-y-auto animate-in fade-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-2">
            <button
              onClick={() => setIsMobileExpanded(false)}
              className="p-2 -ml-2 rounded-full text-slate-400 hover:text-white transition-colors"
              title="Minimizar reproductor"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            <div className="text-center">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block">
                REPRODUCIENDO EN CLAICHY
              </span>
              <span className="text-xs font-semibold text-slate-300 truncate max-w-[200px] block">
                {currentTrack.album || 'Estudio Oficial'}
              </span>
            </div>
            <button
              onClick={onToggleLyrics}
              className={`p-2 rounded-xl transition-all ${
                showLyrics ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:text-white'
              }`}
              title="Letras sincronizadas"
            >
              <Mic2 className="w-5 h-5" />
            </button>
          </div>

          {/* Center Stage: Huge Spinning Vinyl Record */}
          <div className="flex-1 flex flex-col items-center justify-center my-4">
            <div
              className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-neutral-950 border-4 border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex items-center justify-center relative overflow-hidden ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}
            >
              {/* Vinyl grooves */}
              <div className="absolute inset-4 rounded-full border border-neutral-800/80" />
              <div className="absolute inset-8 rounded-full border border-neutral-800/60" />
              <div className="absolute inset-12 rounded-full border border-neutral-800/40" />
              <div className="absolute inset-16 rounded-full border border-neutral-800/30" />

              {/* Center vinyl label with album art */}
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-amber-400/80 relative z-10 shadow-2xl">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Spindle hole */}
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-neutral-700 absolute z-20" />
            </div>

            {isOfflineMode && (
              <span className="mt-4 text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                ● Reproducción sin conexión
              </span>
            )}
          </div>

          {/* Track Info & Like */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 pr-3">
                <h2 className="text-xl font-black text-white truncate">
                  {currentTrack.title}
                </h2>
                <p
                  onClick={() => {
                    setIsMobileExpanded(false);
                    onSelectArtist && onSelectArtist(currentTrack.artist);
                  }}
                  className="text-sm font-semibold text-amber-400/90 truncate cursor-pointer mt-0.5"
                >
                  {currentTrack.artist}
                </p>
              </div>

              <button
                onClick={() => onToggleLike(currentTrack.id)}
                className={`p-2 transition-transform active:scale-125 shrink-0 ${
                  isLiked ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
                title={isLiked ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Scrub Bar */}
            <div className="space-y-1">
              <div className="relative flex items-center group py-2">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="1"
                  value={currentTime}
                  disabled={!currentTrack}
                  onChange={(e) => onSeek(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 tabular-nums">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Playback Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onToggleShuffle}
                className={`p-2 transition-colors ${
                  isShuffle ? 'text-amber-400' : 'text-slate-400'
                }`}
                title="Aleatorio"
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={onPrevious}
                className="p-2 text-white hover:text-amber-300 transition-colors"
                title="Anterior"
              >
                <SkipBack className="w-6 h-6 fill-current" />
              </button>

              <button
                onClick={onPlayPause}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 active:scale-95 transition-all"
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isBuffering ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current translate-x-0.5" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-2 text-white hover:text-amber-300 transition-colors"
                title="Siguiente"
              >
                <SkipForward className="w-6 h-6 fill-current" />
              </button>

              <button
                onClick={onToggleRepeat}
                className={`p-2 transition-colors ${
                  repeatMode !== 'off' ? 'text-amber-400' : 'text-slate-400'
                }`}
                title={`Repetir: ${repeatMode}`}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-5 h-5" />
                ) : (
                  <Repeat className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Bottom Sheet Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-slate-400">
              <button
                onClick={() => {
                  setIsMobileExpanded(false);
                  onToggleQueue();
                }}
                className="flex items-center gap-1.5 hover:text-white"
              >
                <ListMusic className="w-4 h-4 text-amber-400" />
                <span>Cola de reproducción</span>
              </button>

              <div className="flex items-center gap-2">
                <button onClick={onToggleMute} className="text-slate-400">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-amber-400" />
                  )}
                </button>
                <div className="w-20 relative flex items-center">
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${isMuted ? 0 : volume}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. DESKTOP SONIC CONSOLE (Rendered on tablet/desktop md+) */}
      {/* ======================================================== */}
      <footer className="hidden md:flex h-20 2xl:h-22 bg-[#0a0d14]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl mx-3 xl:mx-4 mb-2.5 px-4 xl:px-6 items-center justify-between text-white select-none z-40 shadow-[0_12px_45px_rgba(0,0,0,0.85)] relative">
        {/* Left: Track Information with Rotating Vinyl Disc */}
        <div className="flex items-center gap-3.5 w-[30%] min-w-[200px]">
          {currentTrack ? (
            <>
              <div
                className="relative group/cover shrink-0 cursor-pointer"
                onClick={onToggleMiniVideo}
              >
                {/* Vinyl sleeve behind album art */}
                <div
                  className={`absolute -right-2 top-0.5 w-13 h-13 rounded-full bg-neutral-900 border border-neutral-700/80 flex items-center justify-center transition-transform ${
                    isPlaying ? 'animate-spin-slow translate-x-1.5' : 'translate-x-0'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </div>
                </div>

                {/* Cover Art */}
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-14 h-14 rounded-xl object-cover shadow-lg bg-neutral-900 border border-white/10 relative z-10 group-hover/cover:brightness-90 transition-all"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col min-w-0 pr-2 z-10 pl-1">
                <span className="font-bold text-sm text-white truncate hover:text-amber-300 transition-colors cursor-pointer">
                  {currentTrack.title}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 truncate">
                  <span
                    onClick={() => onSelectArtist && onSelectArtist(currentTrack.artist)}
                    className="hover:underline hover:text-amber-200 cursor-pointer truncate"
                  >
                    {currentTrack.artist}
                  </span>
                  {isOfflineMode && (
                    <span className="text-[9px] text-amber-400 bg-amber-400/10 px-1 rounded font-medium shrink-0">
                      Offline
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onToggleLike(currentTrack.id)}
                className={`p-1.5 rounded-full transition-transform active:scale-125 z-10 ${
                  isLiked ? 'text-amber-400' : 'text-neutral-500 hover:text-white'
                }`}
                title={isLiked ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 text-neutral-500 text-xs">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-neutral-600">
                <Disc3 className="w-6 h-6" />
              </div>
              <span>Elige un tema o busca en Claichy</span>
            </div>
          )}
        </div>

        {/* Center: Playback Console */}
        <div className="flex flex-col items-center gap-2 w-[40%] max-w-xl">
          <div className="flex items-center gap-5">
            {/* Shuffle */}
            <button
              onClick={onToggleShuffle}
              disabled={!currentTrack}
              className={`p-1 rounded-full transition-colors relative ${
                isShuffle ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
              } disabled:opacity-30 disabled:cursor-not-allowed`}
              title="Modo aleatorio"
            >
              <Shuffle className="w-4 h-4" />
              {isShuffle && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
              )}
            </button>

            {/* Previous */}
            <button
              onClick={onPrevious}
              disabled={!currentTrack}
              className="p-1 rounded-full text-neutral-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Anterior"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            {/* Glowing Play/Pause Center Ring */}
            <button
              onClick={onPlayPause}
              disabled={!currentTrack}
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isBuffering ? (
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={onNext}
              disabled={!currentTrack}
              className="p-1 rounded-full text-neutral-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Siguiente"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            {/* Repeat */}
            <button
              onClick={onToggleRepeat}
              disabled={!currentTrack}
              className={`p-1 rounded-full transition-colors relative ${
                repeatMode !== 'off' ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
              } disabled:opacity-30 disabled:cursor-not-allowed`}
              title={`Repetición: ${repeatMode}`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
              {repeatMode !== 'off' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
              )}
            </button>
          </div>

          {/* Scrub Bar with Amber Gradient Fill */}
          <div className="w-full flex items-center gap-2.5 text-[11px] font-mono text-neutral-400 tabular-nums">
            <span className="w-9 text-right text-neutral-300">{formatTime(currentTime)}</span>
            <div className="relative flex-1 flex items-center group">
              <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="1"
                value={currentTime}
                disabled={!currentTrack}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
            <span className="w-9 text-left text-neutral-400">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Audio Deck Auxiliaries (Visualizer, YouTube PiP, Lyrics, Queue, Volume) */}
        <div className="flex items-center justify-end gap-3 w-[30%] min-w-[200px]">
          {/* Equalizer Wave Indicator */}
          {isPlaying && (
            <div className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[10px] font-mono tracking-wider">LIVE</span>
            </div>
          )}

          {/* YouTube Video Toggle */}
          <button
            onClick={onToggleMiniVideo}
            className={`p-2 rounded-xl transition-all ${
              showMiniVideo
                ? 'text-amber-400 bg-amber-500/20 border border-amber-500/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
            title="Ver video oficial de YouTube"
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Lyrics */}
          <button
            onClick={onToggleLyrics}
            className={`p-2 rounded-xl transition-all ${
              showLyrics
                ? 'text-amber-400 bg-amber-500/20 border border-amber-500/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
            title="Letras del tema"
          >
            <Mic2 className="w-4 h-4" />
          </button>

          {/* Queue */}
          <button
            onClick={onToggleQueue}
            className={`p-2 rounded-xl transition-all ${
              showQueue
                ? 'text-amber-400 bg-amber-500/20 border border-amber-500/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
            title="Cola de reproducción"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2 w-28 group pl-1">
            <button
              onClick={onToggleMute}
              className="text-neutral-400 hover:text-white transition-colors"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : volume < 50 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <div className="relative flex-1 flex items-center">
              <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${isMuted ? 0 : volume}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
