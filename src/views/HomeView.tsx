import React from 'react';
import { Play, Pause, Heart, Disc3, Sparkles, Radio, Users, Volume2, ArrowRight } from 'lucide-react';
import { Artist, Playlist, Song } from '../types';

interface HomeViewProps {
  playlists: Playlist[];
  artists: Artist[];
  topSongs: Song[];
  currentTrack: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song, contextPlaylist?: Song[]) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onSelectArtist: (artist: Artist) => void;
  onAddToPlaylist: (song: Song) => void;
  isLiked: (songId: string) => boolean;
  onToggleLike: (songId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  playlists,
  artists,
  topSongs,
  currentTrack,
  isPlaying,
  onPlaySong,
  onSelectPlaylist,
  onSelectArtist,
  onAddToPlaylist,
  isLiked,
  onToggleLike,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const heroSong = currentTrack || topSongs[0];

  return (
    <div className="p-4 sm:p-6 md:p-8 xl:p-10 2xl:p-12 space-y-6 md:space-y-10 xl:space-y-12 max-w-[1880px] mx-auto w-full">
      {/* Hero Audiophile Soundstage Banner (Responsive Mobile & Desktop) */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden p-5 sm:p-6 md:p-8 xl:p-10 border border-white/[0.08] bg-gradient-to-r from-[#141824] via-[#10131d] to-[#0a0d14] shadow-2xl">
        {/* Ambient Warm Backlights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 xl:gap-12">
          <div className="space-y-3 md:space-y-4 max-w-xl xl:max-w-2xl 2xl:max-w-3xl text-center md:text-left flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] sm:text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getGreeting()} · Claichy Audio</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl xl:text-6xl font-black text-white tracking-tight leading-tight">
              Música Ilimitada de Todos los Artistas
            </h1>

            <p className="text-xs sm:text-sm xl:text-base text-neutral-300 leading-relaxed max-w-xl">
              Disfruta de sonido legal impulsado por YouTube API y reproduce tus listas en cualquier lugar con el modo sin conexión.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  if (heroSong) {
                    onPlaySong(heroSong, topSongs);
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-xs md:text-sm shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Escuchar Éxito Destacado</span>
              </button>

              {heroSong && (
                <div className="text-xs text-neutral-400 truncate max-w-full sm:max-w-[280px] bg-white/[0.04] border border-white/[0.08] px-3.5 py-2 rounded-xl text-center sm:text-left">
                  <span className="text-white font-semibold truncate block">
                    {heroSong.title}
                  </span>
                  <span className="text-amber-400/90 truncate block text-[11px]">
                    {heroSong.artist}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Spinning Vinyl Stage Display */}
          <div className="relative flex items-center justify-center shrink-0 my-2 md:my-0">
            {/* Vinyl record disc */}
            <div
              className={`w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 xl:w-64 xl:h-64 rounded-full bg-neutral-950 border-4 border-neutral-800 shadow-[0_0_35px_rgba(0,0,0,0.9)] flex items-center justify-center relative overflow-hidden ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}
            >
              {/* Vinyl grooves */}
              <div className="absolute inset-3 sm:inset-4 rounded-full border border-neutral-800/80" />
              <div className="absolute inset-6 sm:inset-8 rounded-full border border-neutral-800/60" />
              <div className="absolute inset-9 sm:inset-12 rounded-full border border-neutral-800/40" />

              {/* Center vinyl label with album art */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-28 xl:h-28 rounded-full overflow-hidden border-2 border-amber-400/60 relative z-10 shadow-inner">
                {heroSong ? (
                  <img
                    src={heroSong.coverUrl}
                    alt={heroSong.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-amber-500/20 flex items-center justify-center">
                    <Disc3 className="w-8 h-8 text-amber-400" />
                  </div>
                )}
              </div>

              {/* Spindle hole */}
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-black border border-neutral-700 absolute z-20" />
            </div>

            {/* Glowing needle indicator */}
            <div className="absolute -inset-2 rounded-full border border-amber-500/20 pointer-events-none animate-pulse" />
          </div>
        </div>
      </div>

      {/* Featured Vinyl Curations (Colecciones Exclusivas) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Disc3 className="w-5 h-5 text-amber-400" />
              <span>Colecciones Claichy</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Listas masterizadas para streaming oficial y escucha sin conexión
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4 xl:gap-5">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => onSelectPlaylist(playlist)}
              className="group bg-white/[0.02] hover:bg-white/[0.06] p-4 rounded-2xl border border-white/[0.06] hover:border-amber-400/30 transition-all duration-300 cursor-pointer flex flex-col shadow-lg"
            >
              <div className="relative aspect-square mb-3.5 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shadow-md">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Play Overlay Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (playlist.tracks.length > 0) {
                      onPlaySong(playlist.tracks[0], playlist.tracks);
                    }
                  }}
                  className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  title="Reproducir colección"
                >
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                </button>

                {playlist.isOfflineAvailable && (
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-bold border border-amber-400/30">
                    Offline
                  </div>
                )}
              </div>

              <h3 className="font-bold text-sm text-white truncate mb-1 group-hover:text-amber-300 transition-colors">
                {playlist.title}
              </h3>
              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                {playlist.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* World Artists Lounge Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Salón de Artistas Mundiales</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Toca a cualquier artista para reproducir sus éxitos al instante
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 2xl:grid-cols-7 gap-3.5 xl:gap-4.5">
          {artists.map((artist) => (
            <div
              key={artist.id}
              onClick={() => onSelectArtist(artist)}
              className="bg-white/[0.02] hover:bg-white/[0.07] p-3.5 rounded-2xl transition-all cursor-pointer group flex flex-col items-center text-center border border-white/[0.05] hover:border-amber-400/40 shadow"
            >
              <div className="relative aspect-square w-full mb-3 rounded-full overflow-hidden bg-neutral-900 border-2 border-white/10 group-hover:border-amber-400/60 shadow-md transition-all">
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="font-bold text-xs md:text-sm text-white truncate w-full mb-0.5 group-hover:text-amber-300 transition-colors">
                {artist.name}
              </h3>
              <p className="text-[11px] text-neutral-400 truncate w-full">
                {artist.genres[0]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Waveform Hits (2-column layout on 1080p widescreen laptops) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Canciones en Tendencia Global
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Selección en alta fidelidad sincronizada legalmente desde YouTube
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5">
          {topSongs.slice(0, 10).map((song, index) => {
            const isCurrent = currentTrack?.id === song.id;
            const liked = isLiked(song.id);

            return (
              <div
                key={song.id}
                onClick={() => onPlaySong(song, topSongs)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all ${
                  isCurrent
                    ? 'bg-amber-500/10 border border-amber-500/20'
                    : 'bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span
                    className={`w-6 text-center text-xs font-mono tabular-nums ${
                      isCurrent ? 'text-amber-400 font-bold' : 'text-neutral-500'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-12 h-12 rounded-xl object-cover shadow border border-white/10 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="truncate flex-1">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isCurrent
                          ? 'text-amber-300 font-bold'
                          : 'text-white group-hover:text-amber-200'
                      }`}
                    >
                      {song.title}
                    </p>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      {song.artist} <span className="opacity-40">·</span> {song.album}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(song.id);
                    }}
                    className={`p-1.5 transition-colors ${
                      liked ? 'text-rose-500' : 'text-neutral-500 hover:text-white'
                    }`}
                    title={liked ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  </button>

                  <span className="text-xs font-mono text-neutral-400 w-11 text-right tabular-nums">
                    {Math.floor(song.duration / 60)}:
                    {(song.duration % 60).toString().padStart(2, '0')}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToPlaylist(song);
                    }}
                    className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-amber-500/20 text-neutral-400 hover:text-amber-400 flex items-center justify-center transition-colors text-xs"
                    title="Añadir a lista personalizada"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
