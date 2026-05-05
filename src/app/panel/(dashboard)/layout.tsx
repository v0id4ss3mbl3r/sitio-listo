'use client';

import { createClient } from '@/lib/supabase/browser';
import { LogOut, Home, Palette, CreditCard } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const pathname = usePathname(); // En proxy de app.*, '/' es el dashboard

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
      background: isActive ? 'var(--border-subtle)' : 'transparent',
      textDecoration: 'none',
      fontSize: '0.95rem',
      fontWeight: isActive ? 600 : 500,
      transition: 'all 0.2s ease',
    };
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-dark)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border-subtle)',
          padding: '2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
            S
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Sitio<span style={{ color: 'var(--color-primary-light)' }}>Listo</span>
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          <Link href="/" style={getLinkStyle('/')}>
            <Home size={18} />
            Dashboard
          </Link>
          <Link href="/editor" style={getLinkStyle('/editor')}>
            <Palette size={18} />
            Editor Visual
          </Link>
          <Link href="/cuenta" style={getLinkStyle('/cuenta')}>
            <CreditCard size={18} />
            Suscripción
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <header style={{
          height: '70px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 2rem',
          gap: '1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Tema</span>
            <ThemeToggle />
          </div>
          
          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'opacity 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <LogOut size={16} />
            Salir
          </button>
        </header>

        {/* Content */}
        <main style={{ padding: '2rem 3rem', flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
