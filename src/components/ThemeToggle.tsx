'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const subscribeNoop = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // El tema real solo se conoce en el cliente: en el server devolvemos `false`
  // para renderizar el placeholder y evitar el mismatch de hidratación.
  const mounted = React.useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

  if (!mounted) {
    return <div style={{ width: 36, height: 36 }} />; // Placeholder for layout shift
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      style={{
        background: 'transparent',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      aria-label="Alternar tema"
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
