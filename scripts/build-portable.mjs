import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('1. Running vite build for CSS compilation...');
execSync('npx vite build', { cwd: rootDir, stdio: 'inherit' });

const distAssetsDir = path.join(rootDir, 'dist', 'assets');
const assetFiles = fs.readdirSync(distAssetsDir);
const cssFile = assetFiles.find((f) => f.endsWith('.css'));
if (!cssFile) {
  throw new Error('Could not find compiled CSS file in dist/assets');
}
const compiledCss = fs.readFileSync(path.join(distAssetsDir, cssFile), 'utf-8');

console.log('2. Bundling React application with esbuild (IIFE standalone)...');
const tempJsPath = path.join(rootDir, 'dist', 'claichy-bundle.iife.js');
execSync(
  `npx esbuild src/main.tsx --bundle --format=iife --minify --platform=browser --loader:.css=empty --alias:virtual:pwa-register=./scripts/pwa-stub.ts --define:process.env.NODE_ENV=\\"production\\" --outfile=${tempJsPath}`,
  { cwd: rootDir, stdio: 'inherit' }
);

let compiledJs = fs.readFileSync(tempJsPath, 'utf-8');

// Deduplicate embedded images into window.__CLAICHY_IMG__ so file size stays compact (~5.5 MB)
const imagesDir = path.join(rootDir, 'src', 'assets', 'images');
const imageMap = {};
if (fs.existsSync(imagesDir)) {
  const imageFiles = fs.readdirSync(imagesDir);
  for (const img of imageFiles) {
    const imgPath = path.join(imagesDir, img);
    const base64 = fs.readFileSync(imgPath).toString('base64');
    const ext = path.extname(img).toLowerCase().replace('.', '') || 'jpeg';
    const mime = ext === 'jpg' ? 'jpeg' : ext;
    imageMap[img] = `data:image/${mime};base64,${base64}`;
    const doubleQuoted = `"/assets/images/${img}"`;
    const singleQuoted = `'/assets/images/${img}'`;
    const legacyDoubleQuoted = `"/src/assets/images/${img}"`;
    const legacySingleQuoted = `'/src/assets/images/${img}'`;
    compiledJs = compiledJs.split(doubleQuoted).join(`window.__CLAICHY_IMG__["${img}"]`);
    compiledJs = compiledJs.split(singleQuoted).join(`window.__CLAICHY_IMG__["${img}"]`);
    compiledJs = compiledJs.split(legacyDoubleQuoted).join(`window.__CLAICHY_IMG__["${img}"]`);
    compiledJs = compiledJs.split(legacySingleQuoted).join(`window.__CLAICHY_IMG__["${img}"]`);
    console.log(`   Mapped image once: ${img}`);
  }
}

// Safely escape </script> inside inline script
compiledJs = compiledJs.replace(/<\/script>/gi, '<\\/script>');
const imageScript = `window.__CLAICHY_IMG__=${JSON.stringify(imageMap)};`;

const portableHtml = `<!doctype html>
<html lang="es" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Claichy Audio Studio - Versión Portable</title>
    <meta name="description" content="Claichy: Reproductor musical audiophile con transmisión legal vía YouTube API para todos los artistas, listas de reproducción personalizadas y reproducción sin conexión." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <style>${compiledCss}</style>
  </head>
  <body class="bg-[#07090e] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 antialiased overflow-hidden">
    <div id="root"></div>
    <script>${imageScript}${compiledJs}</script>
  </body>
</html>
`;

const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

const portableHtmlPath = path.join(publicDir, 'Claichy-Portable.html');
fs.writeFileSync(portableHtmlPath, portableHtml, 'utf-8');
console.log(`3. Generated standalone portable HTML: ${portableHtmlPath} (${(Buffer.byteLength(portableHtml) / (1024 * 1024)).toFixed(2)} MB)`);
