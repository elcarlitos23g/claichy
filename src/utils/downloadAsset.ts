export async function downloadAsset(
  primaryUrl: string,
  fallbackUrl: string,
  filename: string
): Promise<{ ok: boolean; error?: string }> {
  const urls = [primaryUrl, fallbackUrl].filter(Boolean);

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
      });

      if (!response.ok) {
        continue;
      }

      const contentType = response.headers.get('content-type') || '';
      // Avoid saving an SPA HTML fallback page when expecting a ZIP archive
      if (filename.endsWith('.zip') && contentType.includes('text/html')) {
        continue;
      }

      const blob = await response.blob();
      if (!blob || blob.size === 0) {
        continue;
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 15000);

      return { ok: true };
    } catch {
      // Try fallback URL
    }
  }

  return {
    ok: false,
    error: 'No se pudo descargar el archivo desde este servidor. Verifica que la carpeta public esté subida completa.',
  };
}
