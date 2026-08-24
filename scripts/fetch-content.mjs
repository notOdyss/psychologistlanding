// Runs before every build. Pulls the saved content out of Vercel Blob and
// writes it into the bundle, so the deployed HTML ships with the current text
// instead of the defaults. Never fails the build: if the store is empty or
// unreachable we emit {} and the app falls back to src/content/defaults.js.
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadContent } from '../api/_lib.js';

const OUT = path.join(process.cwd(), 'src', 'content', 'generated.json');

let content = {};
try {
  content = (await loadContent()) || {};
  const keys = Object.keys(content).length;
  console.log(keys ? `[content] baked ${keys} sections from Blob` : '[content] store empty, using defaults');
} catch (err) {
  console.warn(`[content] could not load saved content (${err.message}); using defaults`);
}

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, JSON.stringify(content), 'utf8');
