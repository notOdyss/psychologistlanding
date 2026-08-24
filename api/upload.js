import { readBuffer, send, requireAuth, saveUpload } from './_lib.js';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method not allowed' });
  if (!requireAuth(req, res)) return;

  const contentType = (req.headers['content-type'] || '').split(';')[0].trim();
  if (!ALLOWED.includes(contentType)) {
    return send(res, 415, { error: 'unsupported file type' });
  }

  const filename = decodeURIComponent(String(req.headers['x-filename'] || 'upload'));

  let buffer;
  try {
    buffer = await readBuffer(req);
  } catch (err) {
    return send(res, 413, { error: err.message });
  }
  if (!buffer.length) return send(res, 400, { error: 'empty file' });

  try {
    const url = await saveUpload(filename, buffer, contentType);
    return send(res, 200, { url });
  } catch (err) {
    console.error('saveUpload failed:', err);
    return send(res, 500, { error: `storage: ${err.message}` });
  }
}
