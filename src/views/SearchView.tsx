import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Youtube,
  Play,
  Heart,
  Plus,
  ShieldCheck,
  Music,
  Loader2,
  Users,
  Sparkles,
} from 'lucide-react';
import { Artist, Song } from '../types';
import { GENRE_CATEGORIES, ARTISTS_CATALOG } from '../data/musicCatalog';
import { youtubeManager } from '../services/youtube';

interface SearchViewProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  allSongs: Song[];
  currentTrack: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song, context?: Song[]) => void;
  onAddToPlaylist: (song: Song) => void;
  isLiked: (songId: string) => boolean;
  onToggleLike: (songId: string) => void;
  onOpenDirectYouTubeModal: () => void;
  onSelectArtist?: (artist: Artist) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  searchQuery,
  onSearchChange,
  allSongs,
  currentTrack,
  isPlaying,
  onPlaySong,
  onAddToPlaylist,
  isLiked,
  onToggleLike,
  onOpenDirectYouTubeModal,
  onSelectArtist,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [liveYouTubeSongs, setLiveYouTubeSongs] = useState<Song[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const searchDebounceRef = useRef<any>(null);

  // Local filter
  const localFilteredSongs = allSongs.filter((song) => {
    if (selectedGenre) {
      const matchGenre = song.genre.toLowerCase().includes(selectedGenre.toLowerCase());
      if (!matchGenre) return false;
    }
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    return (
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q) ||
      song.album.toLowerCase().includes(q) ||
      song.genre.toLowerCase().includes(q) ||
      song.youtubeId.toLowerCase() === q
    );
  });

  // Check if search query is a direct YouTube video ID or URL
  const possibleYtId = youtubeManager.extractYouTubeId(searchQuery);

  // Real-time live search to YouTube API endpoint
  useEffect(() => {
    const q = searchQuery.trim();
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (!q || possibleYtId) {
      setLiveYouTubeSongs([]);
      setIsSearchingLive(false);
      return;
    }

    setIsSearchingLive(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.songs)) {
            // Filter out duplicates that might already exist in local catalog
            const filtered = data.songs.filter(
              (ys: Song) => !localFilteredSongs.some((ls) => ls.youtubeId === ys.youtubeId)
            );
            setLiveYouTubeSongs(filtered);
          }
        }
      } catch (err) {
        console.warn('Live search fallback:', err);
      } finally {
        setIsSearchingLive(false);
      }
    }, 450);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery, possibleYtId]);

  // Combined song results: local matches first, followed by live YouTube search results
  const combinedResults: Song[] = [
    ...localFilteredSongs,
    ...liveYouTubeSongs,
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 xl:p-10 2xl:p-12 space-y-6 sm:space-y-8 max-w-[1880px] mx-auto w-full">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-extrabold text-white tracking-tight">
            Explora la Música de Todos los Artistas
          </h1>
          <p className="text-[11px] sm:text-xs md:text-sm text-neutral-400 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Conexión en vivo a la API oficial de YouTube sin cortes</span>
          </p>
        </div>

        <button
          onClick={onOpenDirectYouTubeModal}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 hover:border-neutral-400 transition-all self-start sm:self-auto shrink-0"
        >
          <Youtube className="w-4 h-4 text-red-500" />
          <span>Pegar link directo</span>
        </button>
      </div>

      {/* Direct YouTube Match Banner if user pasted an ID or URL */}
      {possibleYtId && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/60 to-neutral-900 border border-red-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
              <Youtube className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Video oficial detectado ({possibleYtId})
              </p>
              <p className="text-xs text-neutral-300">
                Transmisión legal en directo desde YouTube lista para reproducir.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const directSong: Song = {
                id: `yt-${possibleYtId}-${Date.now()}`,
                title: `YouTube Stream (${possibleYtId})`,
                artist: 'Artista Oficial',
                album: 'YouTube Music',
                duration: 210,
                youtubeId: possibleYtId,
                coverUrl: `https://img.youtube.com/vi/${possibleYtId}/hqdefault.jpg`,
                genre: 'YouTube Direct',
                musicalKey: 'Am',
                bpm: 120,
              };
              onPlaySong(directSong);
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:scale-105 transition-all shadow-[0_2px_12px_rgba(245,158,11,0.3)]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Reproducir Ahora</span>
          </button>
        </div>
      )}

      {/* Genre Filter Pills */}
      <div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              selectedGenre === null
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border border-white/5 hover:text-white hover:border-white/10'
            }`}
          >
            Todos los géneros
          </button>
          {GENRE_CATEGORIES.map((cat) => {
            const isSelected = selectedGenre === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedGenre(isSelected ? null : cat.name)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 border border-white/5 hover:text-white hover:border-white/10'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* All Artists Showcase Strip */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Explora por Artista</span>
          </h2>
          <span className="text-xs text-slate-400">
            {ARTISTS_CATALOG.length} artistas disponibles
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {ARTISTS_CATALOG.map((artist) => (
            <div
              key={artist.id}
              onClick={() => {
                if (onSelectArtist) {
                  onSelectArtist(artist);
                } else {
                  onSearchChange(artist.name);
                }
              }}
              className="bg-[#181818] hover:bg-[#252525] p-2.5 rounded-xl text-center cursor-pointer group transition-all border border-transparent hover:border-neutral-700 flex flex-col items-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-neutral-800 mb-2 shadow group-hover:scale-105 transition-transform duration-300">
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-xs font-bold text-white truncate w-full">
                {artist.name}
              </p>
              <p className="text-[10px] text-neutral-400 truncate w-full mt-0.5">
                {artist.genres[0]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Search Results */}
      {searchQuery.trim() || selectedGenre ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white tracking-wide">
                Canciones encontradas ({combinedResults.length})
              </h2>
              {isSearchingLive && (
                <span className="text-xs text-amber-400 flex items-center gap-1.5 font-medium animate-pulse font-mono">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Sincronizando pistas de YouTube...
                </span>
              )}
            </div>

            {selectedGenre && (
              <span className="text-xs text-slate-400">
                Género: <strong className="text-amber-400">{selectedGenre}</strong>
              </span>
            )}
          </div>

          {combinedResults.length === 0 && !isSearchingLive ? (
            <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
              <Search className="w-10 h-10 mx-auto opacity-30 text-amber-400/50" />
              <p className="text-base font-semibold text-slate-200">
                Buscando canciones de "{searchQuery}"...
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Puedes pegar cualquier enlace o ID de YouTube para reproducirlo inmediatamente en Claichy.
              </p>
              <button
                onClick={onOpenDirectYouTubeModal}
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:scale-105 transition-all shadow-[0_2px_12px_rgba(245,158,11,0.3)]"
              >
                <Youtube className="w-4 h-4 fill-current" />
                <span>Pegar enlace directo de YouTube</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/60 rounded-2xl border border-white/5 p-2 divide-y divide-white/5 shadow-inner">
              {combinedResults.map((song, index) => {
                const isCurrent = currentTrack?.id === song.id;
                const liked = isLiked(song.id);

                return (
                  <div
                    key={`${song.id}-${index}`}
                    onClick={() => onPlaySong(song, combinedResults)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer group transition-all ${
                      isCurrent
                        ? 'bg-amber-500/10 border border-amber-500/20'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className="relative w-12 h-12 shrink-0">
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-full h-full rounded-lg object-cover shadow bg-slate-950 border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                          <Play className="w-5 h-5 text-amber-400 fill-current" />
                        </div>
                      </div>

                      <div className="truncate flex-1">
                        <p className={`text-sm font-semibold truncate ${
                          isCurrent ? 'text-amber-400 font-bold' : 'text-white group-hover:text-amber-300'
                        }`}>
                          {song.title}
                        </p>
                        <p className="text-xs text-slate-400 truncate flex items-center gap-2 mt-0.5">
                          <span className="text-slate-300 font-medium">{song.artist}</span>
                          <span className="opacity-40">·</span>
                          <span className="opacity-70 truncate">{song.album}</span>
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
                          liked ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                        }`}
                        title={liked ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
                      >
                        <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                      </button>

                      <span className="text-xs font-mono text-slate-400 w-10 text-right tabular-nums">
                        {Math.floor(song.duration / 60)}:
                        {(song.duration % 60).toString().padStart(2, '0')}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToPlaylist(song);
                        }}
                        className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-700/60 transition-colors text-xs"
                        title="Añadir a lista personalizada"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        /* Explora Todo Genre Cards Grid */
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            Explorar por Géneros Musicales
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {GENRE_CATEGORIES.map((genre) => (
              <div
                key={genre.name}
                onClick={() => {
                  setSelectedGenre(genre.name);
                }}
                className={`h-36 p-4 rounded-xl bg-gradient-to-br ${genre.color} cursor-pointer relative overflow-hidden transition-all hover:scale-[1.02] shadow-lg group`}
              >
                <h3 className="text-lg font-extrabold text-white leading-tight">
                  {genre.name}
                </h3>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-black/20 rounded-full flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform">
                  <Music className="w-10 h-10 text-white/50" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
