import React from 'react';

import { DEFAULT_THEME, THEMES, type Theme } from "@config/site";

const THEME_LABELS: Record<Theme, string> = {
  boring: "Boring (1)",
  neobrutal: "Neobrutal (2)",
  hyper: "Hyper (3)",
};

const isTheme = (value: string | null): value is Theme =>
  !!value && (THEMES as readonly string[]).includes(value);

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const urlParam = new URLSearchParams(window.location.search).get('theme');
  if (isTheme(urlParam)) return urlParam;
  const stored = localStorage.getItem('theme');
  if (isTheme(stored)) return stored;
  return DEFAULT_THEME;
}

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>(getInitialTheme());

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    window.dispatchEvent(new CustomEvent('theme-set', { detail: theme }));
  }, [theme]);

  // respond to programmatic theme changes (hotkeys in BaseLayout)
  React.useEffect(() => {
    function onThemeSet(e: any) {
      const t = e?.detail as Theme | undefined;
      if (t) setTheme(t);
    }
    window.addEventListener('theme-set', onThemeSet as any);
    return () => window.removeEventListener('theme-set', onThemeSet as any);
  }, []);

  return (
    <div className="nb-card" style={{ padding: 8, display: 'inline-flex', gap: 8 }}>
      {THEMES.map((t) => (
        <button
          key={t}
          className="nb-button"
          style={{ background: theme === t ? 'var(--secondary)' : 'var(--primary)' }}
          onClick={() => setTheme(t)}
        >
          {THEME_LABELS[t]}
        </button>
      ))}
    </div>
  );
}
