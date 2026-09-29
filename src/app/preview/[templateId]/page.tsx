import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  buildDemoCatalog,
  buildDemoItems,
  getDemoIdentity,
} from '@/lib/demoContent';
import { TEMPLATES } from '@/lib/constants';
import { getTheme, TEMPLATE_DEFAULT_THEME } from '@/lib/themes';
import {
  isKnownTemplate,
  renderTemplate,
  templateNeedsCatalog,
} from '@/app/[domain]/_components/renderTemplate';

// Vista previa de una plantilla con contenido de ejemplo. Se monta en un
// iframe desde la galería de la landing, así que NO lleva navbar ni footer:
// lo que se ve acá es exactamente lo que vería un visitante del sitio.
//
// Usa el mismo motor que el sitio real ([domain]/page.tsx): si una plantilla
// se rompe, se rompe en los dos lados, y nunca muestra algo que el producto
// no pueda entregar.

export const dynamic = 'force-static';

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ templateId: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ templateId: string }>;
}): Promise<Metadata> {
  const { templateId } = await params;
  const plantilla = TEMPLATES.find((t) => t.id === templateId);
  if (!plantilla) return {};

  return {
    title: `Vista previa — ${plantilla.name}`,
    description: `Así se ve la plantilla ${plantilla.name} de SitioListo con contenido de ejemplo.`,
    // Es contenido de demostración duplicado entre plantillas: no queremos
    // que compita en buscadores con los sitios reales de los clientes.
    robots: { index: false, follow: false },
  };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  if (!isKnownTemplate(templateId)) notFound();

  const demo = getDemoIdentity(templateId);
  const theme = getTheme(TEMPLATE_DEFAULT_THEME[templateId]);

  return renderTemplate({
    templateId,
    base: {
      siteName: demo.siteName,
      primaryColor: theme.tokens.primary,
      secondaryColor: theme.tokens.secondary,
      logoUrl: '',
      phone: demo.phone,
      address: demo.address,
      // La preview muestra la plantilla completa, sin la marca de agua que
      // sí lleva el plan Básico.
      planType: 'extremo',
      heroTitle: demo.heroTitle,
      heroSubtitle: demo.heroSubtitle,
      aboutText: demo.aboutText,
    },
    theme,
    items: buildDemoItems(templateId),
    catalog: templateNeedsCatalog(templateId) ? buildDemoCatalog() : undefined,
    content: {
      openingHours: demo.openingHours,
      ctaText: 'Contactanos',
      features: undefined,
      services: undefined,
    },
  });
}
