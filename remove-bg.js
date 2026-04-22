/**
 * remove-bg.js
 * Creates LOGO-transparent.png from LOGO.png by:
 *  1. Removing white/near-white pixels (outer canvas)
 *  2. BFS flood-fill from the newly-transparent edges into any
 *     connected dark background pixels (the dark backdrop outside
 *     the circular gear shape)
 *  The circular gear ring acts as a natural barrier, so the dark
 *  interior design elements (center, banner) are preserved.
 */

const fs   = require('fs');
const PNG  = require('pngjs').PNG;

const INPUT  = 'public/LOGO.png';
const OUTPUT = 'public/LOGO-transparent.png';

const src = fs.readFileSync(INPUT);
const png = PNG.sync.read(src);
const { width, height } = png;
const D = png.data;

function idx(x, y) { return (width * y + x) * 4; }

/* ── Pass 1: remove white / near-white ──────────────────── */
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = idx(x, y);
    if (D[i] > 215 && D[i+1] > 215 && D[i+2] > 215) {
      D[i+3] = 0;
    }
  }
}

/* ── Pass 2: BFS from transparent edges → remove connected
   dark-background pixels (threshold: all channels < 65) ── */
const DARK  = 45;   // upper bound for "background dark"
const visited = new Uint8Array(width * height);
const queue  = [];

// Seed: every transparent pixel on the border
for (let x = 0; x < width; x++) {
  for (const y of [0, height - 1]) {
    if (D[idx(x,y)+3] === 0 && !visited[y*width+x]) {
      visited[y*width+x] = 1;
      queue.push(x, y);
    }
  }
}
for (let y = 1; y < height - 1; y++) {
  for (const x of [0, width - 1]) {
    if (D[idx(x,y)+3] === 0 && !visited[y*width+x]) {
      visited[y*width+x] = 1;
      queue.push(x, y);
    }
  }
}

const DX = [-1, 1, 0, 0];
const DY = [ 0, 0,-1, 1];

let head = 0;
while (head < queue.length) {
  const x = queue[head++];
  const y = queue[head++];

  for (let d = 0; d < 4; d++) {
    const nx = x + DX[d];
    const ny = y + DY[d];
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
    const vi = ny * width + nx;
    if (visited[vi]) continue;
    visited[vi] = 1;

    const i = idx(nx, ny);
    const a = D[i+3];

    if (a === 0) {
      // already transparent — keep spreading
      queue.push(nx, ny);
    } else if (D[i] < DARK && D[i+1] < DARK && D[i+2] < DARK) {
      // dark background pixel — make transparent and keep spreading
      D[i+3] = 0;
      queue.push(nx, ny);
    }
    // otherwise: non-dark opaque pixel = part of the logo → stop here
  }
}

const out = PNG.sync.write(png, { colorType: 6 }); // RGBA
fs.writeFileSync(OUTPUT, out);
console.log(`✓ Saved ${OUTPUT}  (${width}×${height})`);
