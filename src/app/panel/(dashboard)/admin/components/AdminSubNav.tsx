'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/usuarios', label: 'Usuarios' },
  { href: '/admin/suscripciones', label: 'Suscripciones' },
  { href: '/admin/sitios', label: 'Sitios' },
  { href: '/admin/plantillas', label: 'Plantillas' },
  { href: '/admin/apariencia', label: 'Apariencia' },
];

export default function AdminSubNav() {
  const pathname = usePathname();

  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      borderBottom: '1px solid var(--border)',
      paddingBottom: '1rem',
      flexWrap: 'wrap',
    }}>
      {links.map(link => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: isActive ? '600' : '400',
              color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--color-primary-10, rgba(99,102,241,0.1))' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
