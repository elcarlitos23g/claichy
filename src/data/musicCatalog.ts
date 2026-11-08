import { Artist, Playlist, Song } from '../types';

export const CATALOG_SONGS: Song[] = [
  // --- Bad Bunny ---
  {
    id: 's-bad-bunny-monaco',
    title: 'MONACO',
    artist: 'Bad Bunny',
    album: 'Nadie Sabe Lo Que Va a Pasar Mañana',
    duration: 267,
    youtubeId: 'kJQP7kiw5Fk',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    genre: 'Urbano Latino',
    musicalKey: 'Am',
    bpm: 140,
    lyrics: [
      { time: 10, text: 'Dime si te gusta como suena el bajo' },
      { time: 16, text: 'Bebiendo champagne en Mónaco' },
      { time: 23, text: 'Nadie sabe lo que va a pasar mañana' },
      { time: 29, text: 'Créeme que a mí me sobra la lana' },
      { time: 35, text: 'Primero que Al Pacino, después con Checo Pérez' },
      { time: 42, text: 'Andamos por la pista como tú no puedes' },
    ],
  },
  {
    id: 's-bad-bunny-titi',
    title: 'Tití Me Preguntó',
    artist: 'Bad Bunny',
    album: 'Un Verano Sin Ti',
    duration: 243,
    youtubeId: 'crz4i1J_Vn0',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    genre: 'Urbano Latino',
    musicalKey: 'Fm',
    bpm: 110,
    lyrics: [
      { time: 15, text: 'Tití me preguntó si tengo muchas novias' },
      { time: 21, text: 'Muchas novias, hoy tengo a una, mañana otra' },
      { time: 27, text: 'Me las voy a llevar a to\'as pa\' un VIP' },
    ],
  },

  // --- Shakira ---
  {
    id: 's-shakira-hips-dont-lie',
    title: "Hips Don't Lie",
    artist: 'Shakira ft. Wyclef Jean',
    album: 'Oral Fixation Vol. 2',
    duration: 219,
    youtubeId: 'DUT5rEU6pqM',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    genre: 'Pop Latino',
    musicalKey: 'Bbm',
    bpm: 100,
    lyrics: [
      { time: 12, text: 'Ladies up in here tonight' },
      { time: 17, text: 'No fighting, no fighting' },
      { time: 22, text: 'Shakira, Shakira' },
      { time: 28, text: 'I never really knew that she could dance like this' },
      { time: 35, text: 'She makes a man wanna speak Spanish' },
    ],
  },
  {
    id: 's-shakira-waka-waka',
    title: 'Waka Waka (Esto es África)',
    artist: 'Shakira',
    album: 'Sale el Sol',
    duration: 211,
    youtubeId: 'pRpeEdMmmQ0',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    genre: 'Pop Global',
    musicalKey: 'D',
    bpm: 127,
    lyrics: [
      { time: 10, text: 'Llegó el momento, caen las murallas' },
      { time: 15, text: 'Va a comenzar la única batalla' },
      { time: 22, text: 'Por que esto es África, ¡Samina mina zangalewa!' },
      { time: 29, text: 'Porque esto es África' },
    ],
  },
  {
    id: 's-shakira-bzrp-53',
    title: 'BZRP Music Sessions #53',
    artist: 'Bizarrap & Shakira',
    album: 'BZRP Music Sessions',
    duration: 217,
    youtubeId: 'CocEMWEl7qc',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    genre: 'Electro Pop Latino',
    musicalKey: 'Em',
    bpm: 122,
    lyrics: [
      { time: 14, text: 'Perdón, ya cogí otro avión' },
      { time: 18, text: 'Aquí no vuelvo, no quiero otra decepción' },
      { time: 24, text: 'Una loba como yo no está pa\' tipos como tú' },
      { time: 32, text: 'Las mujeres ya no lloran, las mujeres facturan' },
    ],
  },

  // --- The Weeknd ---
  {
    id: 's-the-weeknd-blinding-lights',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    youtubeId: '4NRXx6U8ABQ',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
    genre: 'Synth Pop',
    musicalKey: 'Dm',
    bpm: 171,
    lyrics: [
      { time: 12, text: "Yeah, I've been tryna call" },
      { time: 17, text: "I've been on my own for long enough" },
      { time: 52, text: 'I said, ooh, I\'m blinded by the lights' },
      { time: 64, text: 'No, I can\'t sleep until I feel your touch' },
    ],
  },
  {
    id: 's-the-weeknd-starboy',
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    album: 'Starboy',
    duration: 230,
    youtubeId: 'dqt8Z1k0oKQ',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
    genre: 'R&B / Electronic',
    musicalKey: 'G',
    bpm: 93,
    lyrics: [
      { time: 10, text: "I'm tryna put you in the worst mood, ah" },
      { time: 24, text: "Look what you've done, I'm a motherfuckin' starboy" },
    ],
  },

  // --- Drake ---
  {
    id: 's-drake-gods-plan',
    title: "God's Plan",
    artist: 'Drake',
    album: 'Scorpion',
    duration: 198,
    youtubeId: 'xpVfcZ0ZcFM',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    genre: 'Hip-Hop',
    musicalKey: 'Am',
    bpm: 77,
    lyrics: [
      { time: 8, text: 'Yeah, they wishin\' and wishin\' and wishin\' on me' },
      { time: 20, text: 'God\'s plan, God\'s plan' },
      { time: 25, text: 'I hold back, sometimes I won\'t, yeah' },
    ],
  },

  // --- Eminem ---
  {
    id: 's-eminem-lose-yourself',
    title: 'Lose Yourself',
    artist: 'Eminem',
    album: '8 Mile Soundtrack',
    duration: 326,
    youtubeId: '_Yhyp-_hX2s',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    genre: 'Hip-Hop',
    musicalKey: 'Dm',
    bpm: 86,
    lyrics: [
      { time: 10, text: 'Look, if you had one shot or one opportunity' },
      { time: 20, text: 'To seize everything you ever wanted in one moment' },
      { time: 30, text: 'You better lose yourself in the music, the moment' },
    ],
  },

  // --- Taylor Swift ---
  {
    id: 's-taylor-swift-cruel-summer',
    title: 'Cruel Summer',
    artist: 'Taylor Swift',
    album: 'Lover',
    duration: 178,
    youtubeId: 'ic8j13piAhQ',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80',
    genre: 'Pop',
    musicalKey: 'C',
    bpm: 170,
    lyrics: [
      { time: 12, text: 'Fever dream high in the quiet of the night' },
      { time: 51, text: "And it's new, the shape of your body" },
      { time: 58, text: "And it's ooh, whoa oh, it's a cruel summer" },
    ],
  },

  // --- Rosalía ---
  {
    id: 's-rosalia-despecha',
    title: 'DESPECHÁ',
    artist: 'Rosalía',
    album: 'MOTOMAMI+',
    duration: 157,
    youtubeId: 'o3f886TL-t8',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    genre: 'Mambo Pop',
    musicalKey: 'F',
    bpm: 130,
    lyrics: [
      { time: 14, text: 'Baby, no me llames, que yo estoy ocupá\' olvidando tus males' },
      { time: 35, text: 'Y ando despechá\', oah, alocá\'' },
    ],
  },

  // --- Karol G ---
  {
    id: 's-karol-g-shakira-tqg',
    title: 'TQG',
    artist: 'Karol G & Shakira',
    album: 'MAÑANA SERÁ BONITO',
    duration: 197,
    youtubeId: 'jZGpkLElSu8',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    genre: 'Reggaeton',
    musicalKey: 'Em',
    bpm: 90,
    lyrics: [
      { time: 25, text: 'Te fuiste diciendo que me superaste' },
      { time: 46, text: 'Bebé, ¿qué fue? ¿No pues que muy traga\'o?' },
    ],
  },

  // --- Billie Eilish ---
  {
    id: 's-billie-eilish-birds',
    title: 'BIRDS OF A FEATHER',
    artist: 'Billie Eilish',
    album: 'HIT ME HARD AND SOFT',
    duration: 196,
    youtubeId: 'd5gf9dXbPi0',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80',
    genre: 'Indie Pop',
    musicalKey: 'G',
    bpm: 105,
    lyrics: [
      { time: 10, text: 'I want you to stay' },
      { time: 53, text: 'Birds of a feather, we should stick together' },
    ],
  },

  // --- Kendrick Lamar ---
  {
    id: 's-kendrick-not-like-us',
    title: 'Not Like Us',
    artist: 'Kendrick Lamar',
    album: 'Not Like Us',
    duration: 274,
    youtubeId: 'H58vbez_m4E',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    genre: 'Hip-Hop',
    musicalKey: 'Am',
    bpm: 101,
    lyrics: [
      { time: 8, text: 'Psst, I see dead people' },
      { time: 42, text: 'They not like us, they not like us, they not like us' },
    ],
  },

  // --- Feid ---
  {
    id: 's-feid-luna',
    title: 'LUNA',
    artist: 'Feid & ATL Jacob',
    album: 'FERXXOCALIPSIS',
    duration: 196,
    youtubeId: 'P_h6Zq8B084',
    coverUrl: '/src/assets/images/playlist_urban_latino_1794094173265.jpg',
    genre: 'Urbano Latino',
    musicalKey: 'Am',
    bpm: 130,
    lyrics: [
      { time: 12, text: 'Si tú me quisiste de verdad' },
      { time: 42, text: 'Luna, dile que me acuerdo de ella todavía' },
    ],
  },

  // --- Peso Pluma ---
  {
    id: 's-peso-pluma-ella-baila-sola',
    title: 'Ella Baila Sola',
    artist: 'Eslabón Armado & Peso Pluma',
    album: 'DESVELADO',
    duration: 165,
    youtubeId: 'lZia_T95c-k',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    genre: 'Corridos Tumbados',
    musicalKey: 'Fm',
    bpm: 148,
    lyrics: [
      { time: 12, text: 'Compa, ¿qué le parece esa morra?' },
      { time: 18, text: 'La que anda bailando sola me gusta pa\' mí' },
    ],
  },

  // --- Bruno Mars ---
  {
    id: 's-bruno-mars-locked-out',
    title: 'Locked Out of Heaven',
    artist: 'Bruno Mars',
    album: 'Unorthodox Jukebox',
    duration: 233,
    youtubeId: 'e-fA-gBCkj0',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80',
    genre: 'Pop / Funk',
    musicalKey: 'Dm',
    bpm: 144,
    lyrics: [
      { time: 10, text: 'One, two, one, two, three' },
      { time: 24, text: "'Cause your sex takes me to paradise" },
    ],
  },

  // --- Queen ---
  {
    id: 's-queen-bohemian-rhapsody',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: 359,
    youtubeId: 'fJ9rUzIMcZQ',
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80',
    genre: 'Classic Rock',
    musicalKey: 'F',
    bpm: 72,
    lyrics: [
      { time: 5, text: 'Is this the real life? Is this just fantasy?' },
      { time: 75, text: 'Mama, just killed a man' },
    ],
  },

  // --- Coldplay ---
  {
    id: 's-coldplay-viva-la-vida',
    title: 'Viva La Vida',
    artist: 'Coldplay',
    album: 'Viva la Vida or Death and All His Friends',
    duration: 242,
    youtubeId: 'dvgZkm1xWPE',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    genre: 'Alternative Rock',
    musicalKey: 'Ab',
    bpm: 138,
    lyrics: [
      { time: 14, text: 'I used to rule the world' },
      { time: 62, text: '"Now the old king is dead, long live the king"' },
    ],
  },

  // --- Imagine Dragons ---
  {
    id: 's-imagine-dragons-believer',
    title: 'Believer',
    artist: 'Imagine Dragons',
    album: 'Evolve',
    duration: 204,
    youtubeId: '7wtfhZwyrcc',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80',
    genre: 'Alternative Pop / Rock',
    musicalKey: 'Bbm',
    bpm: 125,
    lyrics: [
      { time: 8, text: 'First things first, I\'ma say all the words inside my head' },
      { time: 35, text: 'Pain! You made me a, you made me a believer' },
    ],
  },

  // --- Daft Punk ---
  {
    id: 's-daft-punk-get-lucky',
    title: 'Get Lucky',
    artist: 'Daft Punk ft. Pharrell Williams',
    album: 'Random Access Memories',
    duration: 248,
    youtubeId: '5NV6Rdv1a3I',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    genre: 'Funk / Electronic',
    musicalKey: 'F#m',
    bpm: 116,
    lyrics: [
      { time: 15, text: 'Like the legend of the phoenix' },
      { time: 54, text: 'She\'s up all night \'til the sun' },
      { time: 63, text: 'I\'m up all night to get lucky' },
    ],
  },

  // --- Nirvana ---
  {
    id: 's-nirvana-teen-spirit',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    album: 'Nevermind',
    duration: 301,
    youtubeId: 'hTWKbfoikeg',
    coverUrl: '/src/assets/images/playlist_rock_classics_1794094172992.jpg',
    genre: 'Grunge / Rock',
    musicalKey: 'Fm',
    bpm: 117,
    lyrics: [
      { time: 25, text: 'Load up on guns, bring your friends' },
      { time: 64, text: 'Here we are now, entertain us' },
    ],
  },

  // --- Lofi Girl ---
  {
    id: 's-lofi-rainy-study',
    title: 'Rainy Night Study Beats',
    artist: 'Lofi Girl',
    album: 'Chill Study Sessions Vol. 1',
    duration: 215,
    youtubeId: '5yx6BWlEVcY',
    coverUrl: '/src/assets/images/playlist_lofi_chill_1794094174055.jpg',
    genre: 'Lo-Fi Chill',
    musicalKey: 'C',
    bpm: 80,
    lyrics: [
      { time: 10, text: '[Sonido relajante de lluvia sobre la ventana]' },
      { time: 60, text: '[Ritmo suave de vinilo y caja cálida]' },
    ],
  },
];

export const ARTISTS_CATALOG: Artist[] = [
  {
    id: 'art-shakira',
    name: 'Shakira',
    monthlyListeners: '82,410,000 oyentes mensuales',
    avatarUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    bio: 'Reina del pop latino y superestrella mundial, conocida por Hips Don\'t Lie, Waka Waka, Antología y su récord en las sesiones globales.',
    genres: ['Pop Latino', 'Pop', 'Dance'],
    topTracks: CATALOG_SONGS.filter((s) => s.artist.includes('Shakira')),
  },
  {
    id: 'art-bad-bunny',
    name: 'Bad Bunny',
    monthlyListeners: '74,210,850 oyentes mensuales',
    avatarUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    bio: 'Benito Antonio Martínez Ocasio, ícono mundial del trap, reggaetón y ritmos experimentales puertorriqueños.',
    genres: ['Urbano', 'Reggaeton', 'Trap'],
    topTracks: CATALOG_SONGS.filter((s) => s.artist.includes('Bad Bunny')),
  },
  {
    id: 'art-the-weeknd',
    name: 'The Weeknd',
    monthlyListeners: '108,540,120 oyentes mensuales',
    avatarUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
    bio: 'Abel Tesfaye, The Weeknd, es una de las mayores estrellas globales del R&B alternativo y synth pop contemporáneo.',
    genres: ['Synth Pop', 'R&B', 'Pop'],
    topTracks: CATALOG_SONGS.filter((s) => s.artist.includes('The Weeknd')),
  },
  {
    id: 'art-taylor-swift',
    name: 'Taylor Swift',
    monthlyListeners: '102,100,500 oyentes mensuales',
    avatarUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80',
    bio: 'Una de las cantautoras más influyentes de la historia moderna, creadora de éxitos como Cruel Summer, Blank Space y Anti-Hero.',
    genres: ['Pop', 'Folk', 'Country'],
    topTracks: CATALOG_SONGS.filter((s) => s.artist.includes('Taylor Swift')),
  },
  {
    id: 'art-drake',
    name: 'Drake',
    monthlyListeners: '78,920,000 oyentes mensuales',
    avatarUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    bio: 'Rapero canadiense y fenómeno comercial global, con decenas de himnos #1 como God\'s Plan y One Dance.',
    genres: ['Hip-Hop', 'Trap', 'R&B'],
    topTracks: CATALOG_SONGS.filter((s) => s.artist.includes('Drake')),
  },
  {
    id: 'art-eminem',
    name: 'Eminem',
    monthlyListeners: '69,300,000 oyentes mensuales',
    avatarUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    bio: 'Marshall Mathers, leyenda del hip-hop con velocidad lírica legendaria e himnos como Lose Yourself y Without Me.',
    genres: ['Hip-Hop', 'Rap'],
    topTracks: CATALOG_SONGS.filter((s) => s.artist.includes('Eminem')),
  },
  {
    id: 'art-billie-eilish',
    name: 'Billie Eilish',
    monthlyListeners: '98,420,000 oyentes mensuales',
    avatarUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80',
    bio: 'Múltiple ganadora del premio Grammy y Oscar, conocida por sus paisajes sonoros íntimos, letras profundas y voz etérea.',
    genres: ['Indie Pop', 'Alternative', 'Electronic'],
    topTracks: CATALOG_SONGS.filter((s) => s.artist.includes('Billie Eilish')),
  },
  {
    id: 'art-karol-g',
    name: 'Karol G',
    monthlyListeners: '58,230,100 oyentes mensuales',
    avatarUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    bio: 'La "Bichota" colombiana, líder de la música latina internacional y ganadora de múltiples Latin Grammy con su álbum histórico MAÑANA SERÁ BONITO.',
    genres: ['Reggaeton', 'Latino', 'Pop'],
    topTracks: CATALOG_SONGS.filter((s) => s.artist.includes('Karol G')),
  },
  {
    id: 'art-rosalia',
    name: 'Rosalía',
    monthlyListeners: '35,890,400 oyentes mensuales',
    avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    bio: 'Cantante, compositora y productora española aclamada por su fusión de flamenco tradicional con sonidos vanguardistas electrónicos y urbanos.',
    genres: ['Flamenco Pop', 'Reggaeton', 'Experimental'],
    topTracks: CATALOG_SONGS.filter((s) => s.artist.includes('Rosalía')),
  },
  {
    id: 'art-feid',
    name: 'Feid (Ferxxo)',
    monthlyListeners: '48,150,000 oyentes mensuales',
    avatarUrl: '/src/assets/images/playlist_urban_latino_1794094173265.jpg',
    bio: 'Salomón Villada, cantante y compositor colombiano, el creador del fenómeno del Ferxxo con éxitos como LUNA, Feliz Cumpleaños Ferxxo y Yandel 150.',
    genres: ['Urbano', 'Reggaeton'],
    topTracks: CATALOG_SONGS.filter((s) => s.artist.includes('Feid')),
  },
  {
    id: 'art-bruno-mars',
    name: 'Bruno Mars',
    monthlyListeners: '91,200,000 oyentes mensuales',
    avatarUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80',
    bio: 'Uno de los vocalistas y showmans más talentosos del planeta, maestro del funk, soul, pop y R&B.',
    genres: ['Pop', 'Funk', 'R&B'],
    topTracks: CATALOG_SONGS.filter((s) => s.artist.includes('Bruno Mars')),
  },
  {
    id: 'art-coldplay',
    name: 'Coldplay',
    monthlyListeners: '84,300,000 oyentes mensuales',
    avatarUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    bio: 'Banda británica liderada por Chris Martin, creadores de himnos generacionales como Viva La Vida, Yellow, Fix You y A Sky Full of Stars.',
    genres: ['Alternative Rock', 'Pop Rock'],
    topTracks: CATALOG_SONGS.filter((s) => s.artist.includes('Coldplay')),
  },
  {
    id: 'art-queen',
    name: 'Queen',
    monthlyListeners: '52,100,000 oyentes mensuales',
    avatarUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80',
    bio: 'Freddie Mercury, Brian May, Roger Taylor y John Deacon. Una de las bandas de rock más legendarias de todos los tiempos.',
    genres: ['Classic Rock', 'Rock Opera'],
    topTracks: CATALOG_SONGS.filter((s) => s.artist.includes('Queen')),
  },
  {
    id: 'art-imagine-dragons',
    name: 'Imagine Dragons',
    monthlyListeners: '63,800,000 oyentes mensuales',
    avatarUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80',
    bio: 'Banda de rock alternativo de Las Vegas famosa por Believer, Radioactive, Demons y Thunder.',
    genres: ['Alternative Rock', 'Pop Rock'],
    topTracks: CATALOG_SONGS.filter((s) => s.artist.includes('Imagine Dragons')),
  },
];

export const INITIAL_CURATED_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-top-global',
    title: 'Éxitos Globales Top 50',
    description: 'Los temas más reproducidos en todo el mundo. Actualizada cada semana con lo más caliente del momento.',
    coverUrl: '/src/assets/images/playlist_top_global_1794094172053.jpg',
    color: '#059669', // Emerald
    tracks: [
      CATALOG_SONGS[0], // Monaco
      CATALOG_SONGS[2], // Shakira Hips
      CATALOG_SONGS[5], // Blinding Lights
      CATALOG_SONGS[9], // Cruel Summer
      CATALOG_SONGS[12], // Birds of a feather
      CATALOG_SONGS[13], // Not Like Us
      CATALOG_SONGS[16], // Bruno Mars Locked Out
    ],
    createdAt: '2024-01-01',
    isOfflineAvailable: true,
    author: 'Claichy Editorial',
  },
  {
    id: 'pl-urbano-latino',
    title: 'Fuego Urbano & Reggaetón',
    description: 'El mejor perreo y trap latino para prender la fiesta con Bad Bunny, Shakira, Karol G, Feid y Rosalía.',
    coverUrl: '/src/assets/images/playlist_urban_latino_1794094173265.jpg',
    color: '#E11D48', // Rose
    tracks: [
      CATALOG_SONGS[0], // Monaco
      CATALOG_SONGS[1], // Titi
      CATALOG_SONGS[4], // BZRP 53
      CATALOG_SONGS[10], // Despechá
      CATALOG_SONGS[11], // TQG
      CATALOG_SONGS[14], // Luna
      CATALOG_SONGS[15], // Ella Baila Sola
    ],
    createdAt: '2024-02-15',
    isOfflineAvailable: true,
    author: 'Claichy Latino',
  },
  {
    id: 'pl-lofi-chill',
    title: 'Lo-Fi Chill & Concentración',
    description: 'Ritmos tranquilos para estudiar, programar y relajarse con sonidos de lluvia y Rhodes.',
    coverUrl: '/src/assets/images/playlist_lofi_chill_1794094174055.jpg',
    color: '#4F46E5', // Indigo
    tracks: [
      CATALOG_SONGS[21], // Rainy study
      CATALOG_SONGS[12], // Birds of a feather
      CATALOG_SONGS[19], // Daft punk
    ],
    createdAt: '2024-03-10',
    isOfflineAvailable: true,
    author: 'Claichy Chill',
  },
  {
    id: 'pl-rock-legends',
    title: 'Rock Classics & Guitarras',
    description: 'Himnos eternos del rock: Queen, Nirvana, Coldplay, Imagine Dragons y más leyendas.',
    coverUrl: '/src/assets/images/playlist_rock_classics_1794094172992.jpg',
    color: '#D97706', // Amber
    tracks: [
      CATALOG_SONGS[17], // Queen
      CATALOG_SONGS[18], // Coldplay
      CATALOG_SONGS[19], // Believer
      CATALOG_SONGS[20], // Nirvana
    ],
    createdAt: '2024-04-01',
    isOfflineAvailable: true,
    author: 'Claichy Rock',
  },
];

export const GENRE_CATEGORIES = [
  { name: 'Urbano & Reggaeton', color: 'from-orange-600 to-amber-700', query: 'reggaeton' },
  { name: 'Pop Global', color: 'from-pink-600 to-rose-700', query: 'pop' },
  { name: 'Hip-Hop & Rap', color: 'from-blue-700 to-indigo-900', query: 'hip hop' },
  { name: 'Rock & Alternativo', color: 'from-red-700 to-zinc-900', query: 'rock' },
  { name: 'Lo-Fi & Chill', color: 'from-teal-600 to-emerald-800', query: 'lofi' },
  { name: 'Electrónica & Dance', color: 'from-purple-600 to-violet-900', query: 'electronic' },
  { name: 'Latino & Tropical', color: 'from-amber-600 to-red-800', query: 'latino' },
  { name: 'R&B / Soul', color: 'from-rose-600 to-purple-800', query: 'r&b' },
];
