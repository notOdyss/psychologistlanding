import { useCallback, useEffect, useMemo, useState } from 'react';
import defaults from '../content/defaults.js';
import { mergeContent } from '../content/useContent.js';
import schema from './schema.js';

const TOKEN_KEY = 'cms_token';

/* --------------------------------------------------- immutable path access */

function getAt(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function setAt(obj, path, value) {
  const [head, ...rest] = path.split('.');
  const next = Array.isArray(obj) ? [...obj] : { ...obj };
  next[head] = rest.length ? setAt(obj[head] ?? {}, rest.join('.'), value) : value;
  return next;
}

/* ------------------------------------------------------------ small pieces */

function Label({ children, hint }) {
  return (
    <div className="mb-1.5">
      <span className="block text-sm font-semibold text-gray-800">{children}</span>
      {hint && <span className="block text-xs text-gray-500 mt-0.5">{hint}</span>}
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20';

function TextField({ label, hint, value, onChange, multiline }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      {multiline ? (
        <textarea
          className={inputClass + ' min-h-[96px] resize-y leading-relaxed'}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className={inputClass} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function ImageField({ label, hint, value, onChange, token, onError }) {
  const [busy, setBusy] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': file.type,
          'x-filename': encodeURIComponent(file.name),
        },
        body: file,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'жүктеу қатесі');
      onChange(data.url);
    } catch (err) {
      onError('Суретті жүктеу мүмкін болмады: ' + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-gray-300">🖼</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]">
            {busy ? 'Жүктелуде…' : 'Сурет таңдау'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={busy}
              onChange={(e) => upload(e.target.files?.[0])}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-800"
            >
              Өшіру
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ListControls({ index, count, onMove, onRemove }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        title="Жоғары"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        className="rounded-lg px-2 py-1 text-gray-500 transition hover:bg-gray-100 disabled:opacity-30"
      >
        ↑
      </button>
      <button
        type="button"
        title="Төмен"
        disabled={index === count - 1}
        onClick={() => onMove(index, index + 1)}
        className="rounded-lg px-2 py-1 text-gray-500 transition hover:bg-gray-100 disabled:opacity-30"
      >
        ↓
      </button>
      <button
        type="button"
        title="Жою"
        onClick={() => onRemove(index)}
        className="rounded-lg px-2 py-1 text-red-500 transition hover:bg-red-50"
      >
        ✕
      </button>
    </div>
  );
}

function useListOps(value, onChange) {
  const items = Array.isArray(value) ? value : [];
  return {
    items,
    update: (index, next) => onChange(items.map((it, i) => (i === index ? next : it))),
    move: (from, to) => {
      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      onChange(next);
    },
    remove: (index) => onChange(items.filter((_, i) => i !== index)),
    add: (blank) => onChange([...items, blank]),
  };
}

function StringsField({ field, value, onChange }) {
  const { items, update, move, remove, add } = useListOps(value, onChange);
  return (
    <div>
      <Label hint={field.hint}>{field.label}</Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input className={inputClass} value={item} onChange={(e) => update(index, e.target.value)} />
            <ListControls index={index} count={items.length} onMove={move} onRemove={remove} />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => add('')}
        className="mt-3 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-[#0F766E] hover:text-[#0F766E]"
      >
        + {field.itemLabel || 'Жол'} қосу
      </button>
    </div>
  );
}

function ObjectListField({ field, value, onChange, token, onError }) {
  const { items, update, move, remove, add } = useListOps(value, onChange);
  const blank = useMemo(
    () => Object.fromEntries(field.fields.map((f) => [f.key, ''])),
    [field.fields],
  );
  const atMax = field.max != null && items.length >= field.max;

  return (
    <div>
      <Label hint={field.hint}>{field.label}</Label>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">
                {field.itemLabel || 'Элемент'} {index + 1}
              </span>
              <ListControls index={index} count={items.length} onMove={move} onRemove={remove} />
            </div>
            <div className="space-y-3">
              {field.fields.map((sub) =>
                sub.type === 'image' ? (
                  <ImageField
                    key={sub.key}
                    label={sub.label}
                    hint={sub.hint}
                    value={item[sub.key]}
                    onChange={(v) => update(index, { ...item, [sub.key]: v })}
                    token={token}
                    onError={onError}
                  />
                ) : (
                  <TextField
                    key={sub.key}
                    label={sub.label}
                    hint={sub.hint}
                    multiline={sub.type === 'textarea'}
                    value={item[sub.key]}
                    onChange={(v) => update(index, { ...item, [sub.key]: v })}
                  />
                ),
              )}
            </div>
          </div>
        ))}
      </div>
      {!atMax && (
        <button
          type="button"
          onClick={() => add({ ...blank })}
          className="mt-3 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-[#0F766E] hover:text-[#0F766E]"
        >
          + {field.itemLabel || 'Элемент'} қосу
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ login screen */

function Login({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error === 'wrong password' ? 'Құпия сөз дұрыс емес' : data.error);
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      onSuccess(data.token);
    } catch (err) {
      setError(err.message || 'Кіру мүмкін болмады');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Сайтты басқару</h1>
        <p className="mb-6 text-sm text-gray-500">Кіру үшін құпия сөзді енгізіңіз</p>
        <input
          type="password"
          autoFocus
          className={inputClass}
          placeholder="Құпия сөз"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-5 w-full rounded-xl bg-[#0F766E] py-3 text-base font-bold text-white transition hover:bg-[#115E59] disabled:opacity-50"
        >
          {busy ? 'Тексерілуде…' : 'Кіру'}
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ editor */

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [content, setContent] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(() => new Set([schema[0].title]));

  useEffect(() => {
    if (!token) return;
    fetch('/api/content')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setContent(mergeContent(defaults, data)))
      .catch(() => setContent(defaults));
  }, [token]);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update = useCallback((path, value) => {
    setContent((prev) => setAt(prev, path, value));
    setDirty(true);
    setStatus('');
  }, []);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setContent(null);
  };

  const save = async () => {
    setStatus('Сақталуда…');
    setError('');
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(content),
      });
      if (res.status === 401) {
        logout();
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'сақтау қатесі');
      setDirty(false);
      setStatus('Сақталды ✓');
      setTimeout(() => setStatus(''), 6000);
    } catch (err) {
      setStatus('');
      setError('Сақталмады: ' + err.message);
    }
  };

  if (!token) return <Login onSuccess={setToken} />;
  if (!content) {
    return <div className="flex min-h-screen items-center justify-center text-gray-500">Жүктелуде…</div>;
  }

  const toggle = (title) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Сайтты басқару</h1>
            {dirty && <p className="text-xs font-medium text-amber-600">Сақталмаған өзгерістер бар</p>}
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Сайтты көру
            </a>
            <button
              onClick={logout}
              className="rounded-xl px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100"
            >
              Шығу
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        {schema.map((group) => {
          const isOpen = open.has(group.title);
          return (
            <section
              key={group.title}
              className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggle(group.title)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-gray-50"
              >
                <span className="text-lg font-bold text-gray-900">{group.title}</span>
                <span className={'text-gray-400 transition-transform ' + (isOpen ? 'rotate-180' : '')}>▾</span>
              </button>
              {isOpen && (
                <div className="space-y-5 border-t border-gray-100 px-6 py-6">
                  {group.fields.map((field) => {
                    const value = getAt(content, field.path);
                    const onChange = (v) => update(field.path, v);
                    if (field.type === 'strings') {
                      return <StringsField key={field.path} field={field} value={value} onChange={onChange} />;
                    }
                    if (field.type === 'list') {
                      return (
                        <ObjectListField
                          key={field.path}
                          field={field}
                          value={value}
                          onChange={onChange}
                          token={token}
                          onError={setError}
                        />
                      );
                    }
                    if (field.type === 'image') {
                      return (
                        <ImageField
                          key={field.path}
                          label={field.label}
                          hint={field.hint}
                          value={value}
                          onChange={onChange}
                          token={token}
                          onError={setError}
                        />
                      );
                    }
                    return (
                      <TextField
                        key={field.path}
                        label={field.label}
                        hint={field.hint}
                        multiline={field.type === 'textarea'}
                        value={value}
                        onChange={onChange}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <p className={'text-sm font-medium ' + (error ? 'text-red-600' : 'text-[#0F766E]')}>{error || status}</p>
          <button
            onClick={save}
            disabled={!dirty}
            className="rounded-xl bg-[#0F766E] px-8 py-3 text-base font-bold text-white transition hover:bg-[#115E59] disabled:opacity-40"
          >
            Сақтау
          </button>
        </div>
      </div>
    </div>
  );
}
