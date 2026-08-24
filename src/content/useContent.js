import { useEffect, useState } from 'react';
import defaults from './defaults.js';
// Written by scripts/fetch-content.mjs before each build: the saved content as
// of build time, so the first paint is already correct (no flash of defaults).
import generated from './generated.json';

// Deep-merges the stored content over the defaults, so a content file saved
// before a new field existed still renders that new field.
export function mergeContent(base, override) {
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  if (base && typeof base === 'object') {
    if (!override || typeof override !== 'object' || Array.isArray(override)) return base;
    const out = { ...base };
    for (const key of Object.keys(base)) out[key] = mergeContent(base[key], override[key]);
    for (const key of Object.keys(override)) if (!(key in base)) out[key] = override[key];
    return out;
  }
  return override === undefined || override === null ? base : override;
}

// Priority order: content injected by api/page.js at request time (always
// current) > content baked in at build time (only reached if the page was
// served statically) > the defaults compiled into the bundle.
const injected =
  typeof window !== 'undefined' && window.__CONTENT__ && typeof window.__CONTENT__ === 'object'
    ? window.__CONTENT__
    : null;

const initial = mergeContent(defaults, injected || generated);

export function useContent() {
  const [content, setContent] = useState(initial);

  useEffect(() => {
    // Injected content is already current; there is nothing newer to fetch.
    if (injected) return undefined;
    let cancelled = false;
    fetch('/api/content')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data === 'object') {
          setContent(mergeContent(defaults, data));
        }
      })
      .catch(() => {
        /* offline or API missing: keep the baked content */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return content;
}
