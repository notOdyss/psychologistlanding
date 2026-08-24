import { readJson, send, requireAuth, loadContent, saveContent } from './_lib.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const content = await loadContent();
      // 204 = nothing saved yet; the site falls back to its built-in defaults.
      if (!content) return send(res, 204, {});
      return send(res, 200, content);
    } catch {
      return send(res, 204, {});
    }
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    if (!requireAuth(req, res)) return;
    let body;
    try {
      body = await readJson(req);
    } catch {
      return send(res, 400, { error: 'bad request' });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return send(res, 400, { error: 'content must be an object' });
    }
    try {
      await saveContent(body);
    } catch (err) {
      // Without this the throw becomes Vercel's plain-text "A server error has
      // occurred", which the panel cannot parse as JSON and reports as a
      // confusing syntax error instead of the real cause.
      console.error('saveContent failed:', err);
      return send(res, 500, { error: `storage: ${err.message}` });
    }
    return send(res, 200, { ok: true });
  }

  return send(res, 405, { error: 'method not allowed' });
}
