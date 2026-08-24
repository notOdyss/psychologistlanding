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

const baked = mergeContent(defaults, generated);

export function useContent() {
  // Starts from the baked content, then picks up anything saved since the last
  // build. The rebuild triggered on save usually lands first, making this a no-op.
  const [content, setContent] = useState(baked);

  useEffect(() => {
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
