import fs from 'node:fs/promises';
import path from 'node:path';
import { loadContent } from './_lib.js';

// Serves index.html with the saved content already embedded, so the page paints
// correct text on the first frame instead of fetching it a moment later.
//
// If anything here fails we redirect to the static /index.html, which is excluded
// from the rewrite. The site then behaves exactly as it did before: it renders
// the content baked in at build time and re-fetches at runtime. A broken store
// must never take the site down.

let cachedTemplate = null;

async function getTemplate() {
  if (!cachedTemplate) {
    cachedTemplate = await fs.readFile(path.join(process.cwd(), 'dist', 'index.html'), 'utf8');
  }
  return cachedTemplate;
}

// Characters that must not appear raw inside a <script> tag:
//   "<"      — a "</script>" typed into any content field would close the tag
//              early and everything after it would be parsed as markup.
//   U+2028   — valid inside a JSON string, but a line terminator in JavaScript
//   U+2029     source, so leaving it raw is a syntax error.
//
// The pattern is built with fromCharCode rather than written literally, because
// a raw U+2028 inside a regex literal would itself break this file.
const UNSAFE_IN_SCRIPT = new RegExp('[<' + String.fromCharCode(0x2028, 0x2029) + ']', 'g');

// Replaces them with JSON's own \uXXXX escapes, which keeps the payload valid
// JSON so the browser parses it natively.
function escapeForScriptTag(json) {
  return json.replace(
    UNSAFE_IN_SCRIPT,
    (ch) => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'),
  );
}

export default async function handler(req, res) {
  let template;
  try {
    template = await getTemplate();
  } catch {
    res.writeHead(302, { Location: '/index.html' });
    res.end();
    return;
  }

  let content = {};
  try {
    content = (await loadContent()) || {};
  } catch {
    /* store unreachable: fall through with {} and let the bundle's defaults win */
  }

  const payload = escapeForScriptTag(JSON.stringify(content));
  const html = template.replace(
    '</head>',
    `<script>window.__CONTENT__=${payload}</script></head>`,
  );

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // The HTML is ~0.5 KB and must reflect edits immediately; hashed assets
  // referenced by it are still cached by the CDN as normal.
  res.setHeader('Cache-Control', 'no-store');
  res.end(html);
}
