import { useEffect, useState } from 'react';
import defaults from './defaults.js';

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

export function useContent() {
  const [content, setContent] = useState(defaults);

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
        /* offline or API missing: keep the built-in defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return content;
}
