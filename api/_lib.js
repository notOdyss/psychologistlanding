import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

/* ---------------------------------------------------------------- helpers */

export function readJson(req) {
  // Vercel's Node runtime may have already parsed and consumed the body; the
  // Vite dev middleware never does. Handle both.
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
    try {
      return Promise.resolve(JSON.parse(req.body.toString()));
    } catch {
      return Promise.reject(new Error('invalid json'));
    }
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 5_000_000) reject(new Error('body too large'));
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('invalid json'));
      }
    });
    req.on('error', reject);
  });
}

export function readBuffer(req) {
  if (Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 8_000_000) {
        reject(new Error('file too large'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export function send(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

/* ------------------------------------------------------------------- auth */

const SECRET = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || '';
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function issueToken() {
  return sign({ exp: Date.now() + TOKEN_TTL_MS });
}

export function verifyToken(token) {
  if (!token || !SECRET) return false;
  const [body, sig] = String(token).split('.');
  if (!body || !sig) return false;
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAuth(req, res) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!verifyToken(token)) {
    send(res, 401, { error: 'unauthorized' });
    return false;
  }
  return true;
}

export function checkPassword(candidate) {
  const actual = process.env.ADMIN_PASSWORD || '';
  if (!actual) return false;
  const a = Buffer.from(String(candidate));
  const b = Buffer.from(actual);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/* ---------------------------------------------------------------- storage */
/* Uses Vercel Blob in production. Off-platform (i.e. `npm run dev`) it falls
   back to the local filesystem so the panel is testable offline.            */

// This project's Blob store authenticates over OIDC, so there is no
// BLOB_READ_WRITE_TOKEN and there never will be: on Vercel the SDK resolves
// credentials itself, and BLOB_STORE_ID is what signals the store is attached.
// The token is still honoured if one is ever set, e.g. for a store that uses it.
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_STORE_ID = process.env.BLOB_STORE_ID;
const CONTENT_KEY = 'cms/content.json';
const LOCAL_CONTENT = path.join(process.cwd(), '.data', 'content.json');
const LOCAL_UPLOADS = path.join(process.cwd(), 'public', 'uploads');

// True when running on Vercel, where the filesystem is read-only. The local
// disk fallback below is a development convenience and can never work here, so
// we refuse it explicitly rather than failing later with a confusing ENOENT
// about /var/task.
const onVercel = Boolean(process.env.VERCEL);

// OIDC only works in the deployed environment — locally it fails with
// "OIDC is enabled for this project, but not for the development environment" —
// so a store id alone counts only when we are actually running on Vercel.
export const usingBlob = Boolean(BLOB_TOKEN) || (onVercel && Boolean(BLOB_STORE_ID));

// Passing token: undefined lets the SDK resolve OIDC credentials itself.
const blobAuth = BLOB_TOKEN ? { token: BLOB_TOKEN } : {};

export const storageStatus = {
  blobConfigured: usingBlob,
  // Which credential the storage calls actually use. A deployment created
  // before the token was added still reports "oidc", which is the only way to
  // tell that a redeploy has not yet picked up new environment variables.
  authMode: BLOB_TOKEN ? 'token' : 'oidc',
  passwordConfigured: Boolean(process.env.ADMIN_PASSWORD),
  secretConfigured: Boolean(process.env.ADMIN_SECRET),
  onVercel,
};

function assertWritableStore() {
  if (!usingBlob && onVercel) {
    throw new Error(
      'No Blob store is attached: neither BLOB_READ_WRITE_TOKEN nor BLOB_STORE_ID ' +
        'is set. Connect the store to this project in Vercel and redeploy.',
    );
  }
}

// Read-only connectivity check for /api/health. A successful list() proves the
// function's credentials work, which is the part that cannot be verified from a
// developer machine: OIDC is refused outside the deployed environment.
export async function probeStore() {
  if (!usingBlob) return { reachable: false, reason: 'no store attached' };
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ limit: 1, ...blobAuth });
    return { reachable: true, blobCount: blobs.length };
  } catch (err) {
    return { reachable: false, reason: err.message };
  }
}

export async function loadContent() {
  if (!usingBlob) {
    try {
      return JSON.parse(await fs.readFile(LOCAL_CONTENT, 'utf8'));
    } catch {
      return null;
    }
  }
  const { list } = await import('@vercel/blob');
  const { blobs } = await list({ prefix: CONTENT_KEY, limit: 1, ...blobAuth });
  if (!blobs.length) return null;
  // Cache-buster: the blob CDN would otherwise serve a stale copy after a save.
  const res = await fetch(`${blobs[0].url}?ts=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function saveContent(content) {
  assertWritableStore();
  const json = JSON.stringify(content, null, 2);
  if (!usingBlob) {
    await fs.mkdir(path.dirname(LOCAL_CONTENT), { recursive: true });
    await fs.writeFile(LOCAL_CONTENT, json, 'utf8');
    return;
  }
  const { put } = await import('@vercel/blob');
  // No cacheControlMaxAge here: Vercel Blob rejects values below 60 seconds, and
  // loadContent() already defeats the CDN cache with a timestamped URL.
  await put(CONTENT_KEY, json, {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    ...blobAuth,
  });
}

export async function saveUpload(filename, buffer, contentType) {
  assertWritableStore();
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80) || 'file';
  const key = `${Date.now()}-${safe}`;
  if (!usingBlob) {
    await fs.mkdir(LOCAL_UPLOADS, { recursive: true });
    await fs.writeFile(path.join(LOCAL_UPLOADS, key), buffer);
    return `/uploads/${key}`;
  }
  const { put } = await import('@vercel/blob');
  const blob = await put(`cms/uploads/${key}`, buffer, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
    ...blobAuth,
  });
  return blob.url;
}
