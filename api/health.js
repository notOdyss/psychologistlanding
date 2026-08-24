import { send, storageStatus, probeStore } from './_lib.js';

// Reports only whether each piece of configuration is present — never a value —
// plus a read-only probe of the Blob store. Exists so a misconfigured or
// unreachable deployment can be diagnosed without the admin password, which is
// the difference between "saving is broken" and knowing exactly why.
export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method not allowed' });
  return send(res, 200, { ...storageStatus, store: await probeStore() });
}
