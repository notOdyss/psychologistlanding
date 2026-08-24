import { readJson, send, checkPassword, issueToken } from './_lib.js';

// Very small in-memory throttle. Serverless instances are short-lived, so this
// is a speed bump against casual guessing, not a full rate limiter.
const attempts = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method not allowed' });

  const ip = req.headers['x-forwarded-for'] || 'local';
  const record = attempts.get(ip) || { count: 0, until: 0 };
  if (record.until > Date.now()) {
    return send(res, 429, { error: 'too many attempts' });
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: 'bad request' });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return send(res, 500, { error: 'ADMIN_PASSWORD is not configured' });
  }

  if (!checkPassword(body.password)) {
    record.count += 1;
    if (record.count >= 8) {
      record.count = 0;
      record.until = Date.now() + 5 * 60 * 1000;
    }
    attempts.set(ip, record);
    return send(res, 401, { error: 'wrong password' });
  }

  attempts.delete(ip);
  return send(res, 200, { token: issueToken() });
}
