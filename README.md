# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Admin panel (CMS)

The site content lives in a small CMS instead of being hardcoded. The editor
opens `/admin`, logs in with a password, edits labelled fields in Kazakh, and
presses Save. No GitHub or Vercel account is needed.

### How it works

- `src/content/defaults.js` — the built-in content. Rendered whenever nothing
  has been saved yet, or if the API is unreachable. The site can never break.
- `api/content.js` — `GET` serves saved content, `PUT` saves it (auth required).
- `api/login.js` — checks the password, returns a signed 12-hour token.
- `api/upload.js` — image/PDF uploads.
- Storage is Vercel Blob in production, `.data/content.json` locally.

### Required Vercel setup (one time)

1. In the Vercel project, open **Storage → Create → Blob** and connect it.
   This sets `BLOB_READ_WRITE_TOKEN` automatically.
2. Add two environment variables under **Settings → Environment Variables**:
   - `ADMIN_PASSWORD` — the password you give the editor.
   - `ADMIN_SECRET` — any long random string, used to sign login tokens.
3. Redeploy.

To change the password later, edit `ADMIN_PASSWORD` and redeploy. Changing
`ADMIN_SECRET` immediately logs everyone out.

### Adding a new editable field

1. Add it to `src/content/defaults.js`.
2. Add a labelled entry for it in `src/admin/schema.js`.
3. Render it in `src/App.jsx`.

### Local development

Create a `.env` file with `ADMIN_PASSWORD` and `ADMIN_SECRET`, then `npm run dev`.
Content saves to `.data/content.json` and uploads to `public/uploads` — both are
gitignored and never deployed.

### Why `routes` and not `rewrites` in vercel.json

Vercel resolves static files *before* applying `rewrites`, so a rewrite on `/`
never fires — `dist/index.html` matches first and is served directly. The
legacy `routes` array gives explicit ordering, letting `/` reach `api/page.js`
ahead of the filesystem lookup while everything else still resolves normally:

1. `/` → `api/page.js` (injects the saved content)
2. `handle: filesystem` → assets, images, `/index.html`, the other functions
3. anything left (e.g. `/admin`) → `api/page.js`
