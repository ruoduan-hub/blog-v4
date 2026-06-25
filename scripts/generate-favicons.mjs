import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync } from 'fs';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const LOGO = join(ROOT, 'data', 'logo.svg');
const OUT_DIR = join(ROOT, 'public', 'static', 'favicons');

const logoBuffer = readFileSync(LOGO);

// ── PNG favicons ──────────────────────────────────────────────────────────
const pngSizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'android-chrome-96x96.png', size: 96 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'mstile-150x150.png', size: 150 },
];

await Promise.all(
  pngSizes.map(async ({ name, size }) => {
    await sharp(logoBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(join(OUT_DIR, name));
    console.log(`  ✓ ${name} (${size}×${size})`);
  })
);

// ── favicon.ico (multi-size) ──────────────────────────────────────────────
await sharp(logoBuffer)
  .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toFile(join(OUT_DIR, 'favicon.ico'));
console.log('  ✓ favicon.ico (32×32)');

// ── safari-pinned-tab.svg ─────────────────────────────────────────────────
// Safari pinned tabs use a monochrome SVG mask — no metadata, black fill
const pinnedTabSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<path fill="#000000" d="M259 551 c-24 -25 -29 -37 -29 -80 0 -44 4 -53 30 -72 47 -35 24 -42
-26 -9 -36 26 -44 36 -44 62 0 19 9 41 22 55 27 28 6 31 -23 2 -14 -14 -19
-30 -17 -57 2 -30 11 -42 52 -73 47 -36 51 -37 77 -23 33 17 39 17 39 4 0 -15
-55 -40 -88 -40 -31 0 -62 26 -62 53 0 9 -4 19 -10 22 -21 13 -9 -47 15 -70
30 -31 61 -31 120 -3 42 20 45 25 45 61 0 23 4 36 10 32 14 -8 13 -68 -2 -99
-13 -31 -37 -40 -81 -31 -30 6 -31 5 -13 -10 29 -22 63 -19 91 10 21 20 25 34
25 82 0 56 -2 60 -32 78 -26 15 -29 20 -15 23 23 5 83 -41 92 -69 5 -14 0 -31
-15 -51 -23 -31 -21 -49 4 -29 21 17 34 63 26 86 -4 11 -5 35 -2 53 4 25 -1
39 -18 57 -28 30 -60 31 -117 5 -40 -18 -43 -22 -43 -60 0 -22 -4 -40 -10 -40
-5 0 -10 25 -10 55 0 47 3 57 24 70 17 11 36 14 63 10 37 -6 38 -6 13 9 -37
23 -58 19 -91 -13z m159 -44 c6 -6 14 -25 18 -42 7 -29 7 -29 -17 -14 -69 45
-66 44 -103 26 -28 -13 -36 -14 -36 -4 0 33 116 61 138 34z m-80 -86 c4 -29
-15 -43 -40 -30 -18 10 -24 39 -11 53 15 15 48 1 51 -23z"/>
<path fill="#000000" d="M68 189 c-22 -12 -24 -62 -4 -79 17 -13 62 -10 58 5 -2 6 -14 9 -28
7 -23 -3 -25 0 -22 25 3 24 7 28 31 26 29 -2 37 11 11 21 -21 8 -26 7 -46 -5z"/>
<path fill="#000000" d="M140 150 c0 -27 5 -50 10 -50 6 0 10 11 10 25 0 14 5 25 10 25 6 0
10 -11 10 -25 0 -14 5 -25 10 -25 6 0 10 14 10 31 0 22 -5 32 -20 36 -11 3
-20 12 -20 19 0 8 -4 14 -10 14 -5 0 -10 -22 -10 -50z"/>
<path fill="#000000" d="M330 186 c0 -8 -10 -16 -22 -18 -18 -2 -23 -10 -23 -33 0 -27 4 -30
33 -33 l32 -3 0 50 c0 28 -4 51 -10 51 -5 0 -10 -6 -10 -14z m-2 -53 c-4 -22
-22 -20 -26 1 -2 10 3 16 13 16 10 0 15 -7 13 -17z"/>
<path fill="#000000" d="M390 151 l0 -50 61 0 60 1 -3 31 c-2 24 -8 33 -25 35 -13 2 -23 -2
-23 -8 0 -7 7 -10 15 -6 26 10 16 -9 -12 -21 -43 -20 -53 -16 -53 21 0 19 -4
38 -10 41 -6 4 -10 -13 -10 -44z m100 -31 c0 -5 -4 -10 -10 -10 -5 0 -10 5
-10 10 0 6 5 10 10 10 6 0 10 -4 10 -10z"/>
<path fill="#000000" d="M526 188 c-4 -9 -6 -31 -4 -50 3 -29 6 -33 33 -33 27 0 30 3 30 30 0
23 -5 31 -22 33 -12 2 -24 11 -26 20 -4 16 -4 16 -11 0z m42 -55 c-4 -22 -22
-20 -26 1 -2 10 3 16 13 16 10 0 15 -7 13 -17z"/>
<path fill="#000000" d="M220 161 c0 -6 8 -11 18 -12 12 0 11 -3 -6 -10 -30 -12 -23 -33 12
-37 26 -3 27 -1 24 30 -2 25 -8 34 -25 36 -13 2 -23 -1 -23 -7z m30 -41 c0 -5
-4 -10 -10 -10 -5 0 -10 5 -10 10 0 6 5 10 10 10 6 0 10 -4 10 -10z"/>
</svg>`;

writeFileSync(join(OUT_DIR, 'safari-pinned-tab.svg'), pinnedTabSvg);
console.log('  ✓ safari-pinned-tab.svg');

// ── site.webmanifest ──────────────────────────────────────────────────────
const manifest = {
  name: 'R D',
  short_name: 'R D',
  icons: [
    { src: '/static/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/static/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    {
      src: '/static/favicons/android-chrome-96x96.png',
      sizes: '96x96',
      type: 'image/png',
      purpose: 'any maskable',
    },
  ],
  theme_color: '#000000',
  background_color: '#000000',
  display: 'standalone',
};

writeFileSync(join(OUT_DIR, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');
console.log('  ✓ site.webmanifest');

console.log('\nDone — all favicons regenerated.');
