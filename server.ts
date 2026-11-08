import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// API Route: Download complete project ZIP to upload to GitHub
app.get('/api/download-zip', (_req, res) => {
  const zipFile = path.resolve(__dirname, 'public', 'claichy-source.zip');
  res.download(zipFile, 'claichy-app.zip');
});

// API Route: Live real-time YouTube music search for ALL artists in the world
app.get('/api/search', async (req, res) => {
  const query = (req.query.q as string) || '';
  if (!query.trim()) {
    return res.json({ songs: [] });
  }

  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' music audio')}`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
    });

    const html = await response.text();
    const match =
      html.match(/var ytInitialData = ({.*?});<\/script>/s) ||
      html.match(/ytInitialData\s*=\s*({.+?});/);

    if (!match) {
      return res.json({ songs: [] });
    }

    const data = JSON.parse(match[1]);
    const sectionList =
      data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];

    const items: any[] = [];
    for (const section of sectionList) {
      const contents = section.itemSectionRenderer?.contents || [];
      for (const item of contents) {
        if (item.videoRenderer) {
          items.push(item.videoRenderer);
        }
      }
    }

    const parseDuration = (str?: string) => {
      if (!str) return 210;
      const parts = str.split(':').map(Number);
      if (parts.length === 2) return parts[0] * 60 + parts[1];
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
      return 210;
    };

    const songs = items.slice(0, 20).map((vr: any, idx: number) => {
      const videoId = vr.videoId;
      const rawTitle = vr.title?.runs?.map((r: any) => r.text).join('') || 'Canción de YouTube';
      const channel = vr.ownerText?.runs?.[0]?.text || 'Artista';
      const durationStr = vr.lengthText?.simpleText;
      const duration = parseDuration(durationStr);
      const thumbnail =
        vr.thumbnail?.thumbnails?.[vr.thumbnail.thumbnails.length - 1]?.url ||
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      // Clean up common YouTube video title clutter (e.g. [Official Music Video], (Official Video), etc.)
      const cleanTitle = rawTitle
        .replace(/\[official (music )?video\]/gi, '')
        .replace(/\(official (music )?video\)/gi, '')
        .replace(/\(video oficial\)/gi, '')
        .replace(/\[video oficial\]/gi, '')
        .replace(/\(audio oficial\)/gi, '')
        .replace(/\[audio oficial\]/gi, '')
        .replace(/\(visualizer\)/gi, '')
        .replace(/\[visualizer\]/gi, '')
        .replace(/\(lyric video\)/gi, '')
        .replace(/\[lyric video\]/gi, '')
        .trim();

      return {
        id: `yt-live-${videoId}-${idx}`,
        title: cleanTitle || rawTitle,
        artist: channel,
        album: 'YouTube Music Oficial',
        duration,
        youtubeId: videoId,
        coverUrl: thumbnail,
        genre: 'YouTube Direct',
        musicalKey: 'Am',
        bpm: 120,
      };
    });

    return res.json({ songs });
  } catch (error) {
    console.error('Error fetching YouTube search:', error);
    return res.status(500).json({ error: 'Search failed', songs: [] });
  }
});

// Vite middlewares in dev or static files in production
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Claichy server running on http://localhost:${PORT}`);
});
