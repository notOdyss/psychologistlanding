import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

// Vite's dev server does not know about Vercel's /api functions, so this plugin
// mounts the very same handlers on `npm run dev`. Without a BLOB_READ_WRITE_TOKEN
// they store content in .data/content.json and public/uploads instead of Vercel Blob.
function devApi(env) {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, env);
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        if (!url.pathname.startsWith('/api/')) return next();
        const name = url.pathname.slice('/api/'.length).replace(/[^a-z]/gi, '');
        try {
          const file = path.resolve(process.cwd(), 'api', `${name}.js`);
          const mod = await import(`${pathToFileURL(file).href}?t=${Date.now()}`);
          await mod.default(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), devApi(env)],
  };
});
