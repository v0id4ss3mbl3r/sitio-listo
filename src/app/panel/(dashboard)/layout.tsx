'use client';

import { createClient } from '@/lib/supabase/browser';
import { LogOut, Home, Palette, CreditCard, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
            backdropFilter: 'blur(4px)'
          }}
          className="md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border-subtle)',
          padding: '2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: isMobileMenuOpen ? 0 : '-260px',
          height: '100vh',
          zIndex: 50,
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="md:sticky md:left-0"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
              S
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Sitio<span style={{ color: 'var(--color-primary-light)' }}>Listo</span>
            </span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
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
          justifyContent: 'space-between',
          padding: '0 1rem',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }} className="md:px-8">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden"
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-primary)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Menu size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }} className="hidden sm:inline">Tema</span>
              <ThemeToggle />
            </div>
            
            <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} className="hidden sm:block" />

            <button
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'opacity 0.2s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1 }} className="p-4 sm:p-8 md:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
