import { send, storageStatus } from './_lib.js';

// Reports only whether each piece of configuration is present — never a value.
// Exists so a misconfigured deployment can be diagnosed without the admin
// password, which is the difference between "the save is broken" and knowing
// precisely which environment variable is missing.
export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method not allowed' });
  return send(res, 200, storageStatus);
}
