import React from 'react';

const THEMES = ["boring", "neobrutal", "hyper"] as const;
type Theme = typeof THEMES[number];

const THEME_LABELS: Record<Theme, string> = {
  boring: "Boring (1)",
  neobrutal: "Neobrutal (2)",
  hyper: "Hyper (3)",
};

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'boring';
  const urlParam = new URLSearchParams(window.location.search).get('theme');
  const stored = localStorage.getItem('theme');
  return (urlParam as Theme) || (stored as Theme) || 'boring';
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
