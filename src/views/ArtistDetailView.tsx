import React from 'react';
import { Play, Pause, Heart, BadgeCheck, Youtube, Sparkles, Disc3 } from 'lucide-react';
import { Artist, Song } from '../types';

interface ArtistDetailViewProps {
  artist: Artist;
  currentTrack: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song, context?: Song[]) => void;
  onToggleLike: (songId: string) => void;
  isLiked: (songId: string) => boolean;
  onAddToPlaylist: (song: Song) => void;
  onSearchArtistOnYouTube: (artistName: string) => void;
}

export const ArtistDetailView: React.FC<ArtistDetailViewProps> = ({
  artist,
  currentTrack,
  isPlaying,
  onPlaySong,
  onToggleLike,
  isLiked,
  onAddToPlaylist,
  onSearchArtistOnYouTube,
}) => {
  const isThisArtistPlaying =
    isPlaying && currentTrack && artist.topTracks.some((t) => t.id === currentTrack.id);

  return (
    <div className="pb-24 min-h-full">
      {/* Hero Banner with Cinematic Glow */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden flex items-end p-4 sm:p-6 md:p-10">
        <img
          src={artist.avatarUrl}
          alt={artist.name}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/60 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] sm:text-xs font-semibold">
            <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-amber-400 shrink-0" />
            <span>Artista Verificado en Claichy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-xl">
            {artist.name}
          </h1>

          <p className="text-xs sm:text-sm font-medium text-neutral-300 font-mono">
            {artist.monthlyListeners}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-4 sm:px-6 md:px-10 py-3.5 sm:py-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-[#090b10]/80 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <button
            onClick={() => {
              if (artist.topTracks.length > 0) {
                onPlaySong(artist.topTracks[0], artist.topTracks);
              }
            }}
            disabled={artist.topTracks.length === 0}
            className="flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
            title="Reproducir éxitos"
          >
            {isThisArtistPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
            <span>{isThisArtistPlaying ? 'Pausar' : 'Reproducir'}</span>
          </button>

          <button
            onClick={() => onSearchArtistOnYouTube(artist.name)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] transition-all"
            title="Buscar más canciones en YouTube"
          >
            <Youtube className="w-4 h-4 text-red-400 shrink-0" />
            <span>Buscar en YouTube</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          {artist.genres.map((g) => (
            <span
              key={g}
              className="text-[11px] font-medium text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20"
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Popular Tracks & Bio */}
      <div className="p-4 sm:p-6 md:p-10 xl:p-12 max-w-[1880px] space-y-6 sm:space-y-8 w-full">
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Disc3 className="w-5 h-5 text-amber-400" />
            <span>Temas Populares</span>
          </h2>

          <div className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-2 divide-y divide-white/[0.04]">
            {artist.topTracks.map((song, index) => {
              const isCurrent = currentTrack?.id === song.id;
              const liked = isLiked(song.id);

              return (
                <div
                  key={song.id}
                  onClick={() => onPlaySong(song, artist.topTracks)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all ${
                    isCurrent
                      ? 'bg-amber-500/10 border border-amber-500/20'
                      : 'hover:bg-white/[0.04]'
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
                      className="w-12 h-12 rounded-xl object-cover shadow border border-white/10"
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
                        {song.album}
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
                      title="Añadir a lista"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bio */}
        <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <h3 className="text-sm font-bold text-amber-400 uppercase font-mono tracking-wider">
            Biografía Oficial
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed max-w-3xl">
            {artist.bio}
          </p>
        </section>
      </div>
    </div>
  );
};
