'use client';

import { createClient } from '@/lib/supabase/browser';
import { LogOut, Home, Palette, CreditCard, Menu, X, ChevronLeft } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [pathname, isMobile]);

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
      {isMobile && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: isSidebarOpen ? '260px' : '0px',
          background: 'var(--bg-card)',
          borderRight: isSidebarOpen ? '1px solid var(--border-subtle)' : 'none',
          padding: isSidebarOpen ? '2rem 1rem' : '0px',
          display: 'flex',
          flexDirection: 'column',
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          bottom: 0,
          left: isMobile ? (isSidebarOpen ? 0 : '-260px') : 0,
          height: '100vh',
          zIndex: 50,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          opacity: isSidebarOpen ? 1 : (isMobile ? 1 : 0),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', padding: '0 0.5rem', minWidth: '220px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
              S
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Sitio<span style={{ color: 'var(--color-primary-light)' }}>Listo</span>
            </span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              borderRadius: '8px',
            }}
            className="hover:bg-[var(--border-subtle)] transition-colors"
          >
            {isMobile ? <X size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: '220px' }}>
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
          height: scrolled ? '60px' : '75px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: scrolled ? '0 1.5rem' : '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          transition: 'all 0.3s ease',
        }}>
          <div>
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                style={{ 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  border: '1px solid var(--border-subtle)', 
                  color: 'var(--color-primary)', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: scrolled ? '34px' : '40px',
                  height: scrolled ? '34px' : '40px',
                  borderRadius: '10px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Menu size={scrolled ? 18 : 20} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ThemeToggle />
            </div>
            
            <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} className="hidden sm:block" />

            <button
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'opacity 0.2s ease' }}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: isMobile ? '1.5rem' : '3rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
