import { readJson, send, requireAuth, loadContent, saveContent } from './_lib.js';

// Asks Vercel to rebuild, so the new content is baked into the static bundle.
// Deliberately never throws: the save has already succeeded and the site serves
// the new content at runtime regardless, so a hook failure must not surface as
// a save failure to the editor.
async function triggerRebuild() {
  const hook = process.env.DEPLOY_HOOK_URL;
  if (!hook) return false;
  try {
    const res = await fetch(hook, { method: 'POST' });
    return res.ok;
  } catch {
    return false;
  }
}

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
    await saveContent(body);
    const rebuilding = await triggerRebuild();
    return send(res, 200, { ok: true, rebuilding });
  }

  return send(res, 405, { error: 'method not allowed' });
}
