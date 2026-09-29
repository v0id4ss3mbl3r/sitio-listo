/* ─────────────────────────────────────────────────────────────────────────
 * Registro de plantillas y render compartido.
 *
 * Antes esto era una cadena de 30 `if (template_id === ...)` dentro de
 * [domain]/page.tsx. Al querer previsualizar una plantilla con datos de
 * ejemplo había que elegir entre duplicar las 30 ramas o extraerlas: esto es
 * lo segundo. Ahora el mismo motor sirve al sitio real y a la vista previa,
 * así que una plantilla nueva se ve en los dos lados con una sola línea acá.
 * ───────────────────────────────────────────────────────────────────────── */

import type { ComponentType } from 'react';

import type { Theme } from '@/lib/themes';

import SaborUrbano from '../templates/SaborUrbano';
import PortfolioMinimal from '../templates/PortfolioMinimal';
import LandingPro from '../templates/LandingPro';
import ServiciosPro from '../templates/ServiciosPro';
import TiendaExpress from '../templates/TiendaExpress';
import TiendaCatalogo from '../templates/TiendaCatalogo';
import FotografiaEstudio from '../templates/FotografiaEstudio';
import GimnasioFitness from '../templates/GimnasioFitness';
import ComercioLocal from '../templates/ComercioLocal';
import BellezaEstetica from '../templates/BellezaEstetica';
import Cafeteria from '../templates/Cafeteria';
import BarCerveceria from '../templates/BarCerveceria';
import Pasteleria from '../templates/Pasteleria';
import Barberia from '../templates/Barberia';
import ConsultorioMedico from '../templates/ConsultorioMedico';
import Odontologia from '../templates/Odontologia';
import Spa from '../templates/Spa';
import Veterinaria from '../templates/Veterinaria';
import EstudioJuridico from '../templates/EstudioJuridico';
import EstudioContable from '../templates/EstudioContable';
import Arquitectura from '../templates/Arquitectura';
import TallerMecanico from '../templates/TallerMecanico';
import TecnologiaReparaciones from '../templates/TecnologiaReparaciones';
import Academia from '../templates/Academia';
import Inmobiliaria from '../templates/Inmobiliaria';
import HotelCabanas from '../templates/HotelCabanas';
import AgenciaViajes from '../templates/AgenciaViajes';
import Floreria from '../templates/Floreria';
import EventosDj from '../templates/EventosDj';
import OngFundacion from '../templates/OngFundacion';

/** Props base que reciben todas las plantillas. */
export type BaseTemplateProps = {
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  phone: string;
  address: string;
  planType: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
};

/** Lo que vive en pages.content y solo algunas plantillas consumen. */
export type TemplateContent = {
  openingHours?: string;
  ctaText?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  features?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  services?: any;
};

export type CatalogData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;
};

type Entry = {
  // Las 30 plantillas tienen firmas distintas; el registro es heterogéneo a
  // propósito y cada rama de abajo pasa lo que corresponde.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any>;
  /** Consume site_items. */
  items?: boolean;
  /** Consume pages.content.openingHours. */
  hours?: boolean;
};

const REGISTRY: Record<string, Entry> = {
  // Sin contenido administrable: solo textos y colores.
  'sabor-urbano': { Component: SaborUrbano },
  'portfolio-minimal': { Component: PortfolioMinimal },
  'landing-pro': { Component: LandingPro },
  'servicios-pro': { Component: ServiciosPro },
  'tienda-express': { Component: TiendaExpress },

  // Colecciones, sin horarios.
  'fotografia-estudio': { Component: FotografiaEstudio, items: true },
  'gimnasio-fitness': { Component: GimnasioFitness, items: true },
  'belleza-estetica': { Component: BellezaEstetica, items: true },

  // Colecciones + horarios.
  'comercio-local': { Component: ComercioLocal, items: true, hours: true },
  'cafeteria': { Component: Cafeteria, items: true, hours: true },
  'bar-cerveceria': { Component: BarCerveceria, items: true, hours: true },
  'pasteleria': { Component: Pasteleria, items: true, hours: true },
  'barberia': { Component: Barberia, items: true, hours: true },
  'consultorio-medico': { Component: ConsultorioMedico, items: true, hours: true },
  'odontologia': { Component: Odontologia, items: true, hours: true },
  'spa': { Component: Spa, items: true, hours: true },
  'veterinaria': { Component: Veterinaria, items: true, hours: true },
  'estudio-juridico': { Component: EstudioJuridico, items: true, hours: true },
  'estudio-contable': { Component: EstudioContable, items: true, hours: true },
  'arquitectura': { Component: Arquitectura, items: true, hours: true },
  'taller-mecanico': { Component: TallerMecanico, items: true, hours: true },
  'tecnologia-reparaciones': { Component: TecnologiaReparaciones, items: true, hours: true },
  'academia': { Component: Academia, items: true, hours: true },
  'inmobiliaria': { Component: Inmobiliaria, items: true, hours: true },
  'hotel-cabanas': { Component: HotelCabanas, items: true, hours: true },
  'agencia-viajes': { Component: AgenciaViajes, items: true, hours: true },
  'floreria': { Component: Floreria, items: true, hours: true },
  'eventos-dj': { Component: EventosDj, items: true, hours: true },
  'ong-fundacion': { Component: OngFundacion, items: true, hours: true },

  // La tienda completa tiene su propia firma (productos, categorías, ajustes).
  'tienda-catalogo': { Component: TiendaCatalogo },
};

export const CATALOG_TEMPLATE_ID = 'tienda-catalogo';

/** ¿Esta plantilla necesita que se carguen los site_items? */
export function templateNeedsItems(templateId: string): boolean {
  return REGISTRY[templateId]?.items === true;
}

/** ¿Esta plantilla necesita que se cargue el catálogo de productos? */
export function templateNeedsCatalog(templateId: string): boolean {
  return templateId === CATALOG_TEMPLATE_ID;
}

export function isKnownTemplate(templateId: string): boolean {
  return templateId in REGISTRY;
}

export function renderTemplate({
  templateId,
  base,
  theme,
  items = [],
  catalog,
  content = {},
}: {
  templateId: string;
  base: BaseTemplateProps;
  theme: Theme;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  catalog?: CatalogData;
  content?: TemplateContent;
}) {
  const entry = REGISTRY[templateId];

  if (!entry) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', fontFamily: 'system-ui', minHeight: '100vh', background: '#f9fafb' }}>
        <h1 style={{ color: base.primaryColor, fontSize: '3rem', fontWeight: 800 }}>{base.siteName}</h1>
        <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#4b5563' }}>Estamos preparando algo increíble.</p>
        <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#9ca3af' }}>Plantilla: {templateId}</div>
      </div>
    );
  }

  const { Component } = entry;

  if (templateId === CATALOG_TEMPLATE_ID) {
    return (
      <Component
        siteName={base.siteName}
        logoUrl={base.logoUrl}
        primaryColor={base.primaryColor}
        planType={base.planType}
        products={catalog?.products ?? []}
        categories={catalog?.categories ?? []}
        settings={catalog?.settings ?? null}
        theme={theme}
      />
    );
  }

  // Estas dos leen campos sueltos de pages.content que ninguna otra usa.
  if (templateId === 'landing-pro') {
    return (
      <Component
        {...base}
        ctaText={content.ctaText}
        features={content.features}
        theme={theme}
      />
    );
  }

  if (templateId === 'servicios-pro') {
    return <Component {...base} services={content.services} theme={theme} />;
  }

  return (
    <Component
      {...base}
      theme={theme}
      {...(entry.items ? { items } : {})}
      {...(entry.hours ? { openingHours: content.openingHours } : {})}
    />
  );
}
