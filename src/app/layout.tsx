import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Geist,
  Geist_Mono,
  Inter,
  JetBrains_Mono,
  Source_Serif_4,
  Work_Sans,
} from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { fetchAppThemeCached } from "@/lib/appSettings";
import { getTheme, themeRootCss } from "@/lib/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500", "800"],
});

// Serif para títulos. Source Serif 4 (Adobe, licencia libre) — el tipo de
// fuente que se ve en libros y en interfaces tipo "ebook" (Notion, Claude,
// Substack). Carga solo los pesos que usamos.
const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

// Fuentes del tema Kiosco (el por defecto). Son variables: se omite `weight`
// a propósito, Next carga el archivo variable y sirve todo el rango.
//
// Los otros presets reusan fuentes ya cargadas acá (Taller → Source Serif,
// Estudio → Geist) en vez de sumar familias nuevas: cada familia extra la
// paga el visitante en cada carga, y esos temas son de respaldo.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SitioListo — Tu sitio web, listo en minutos",
    template: "%s | SitioListo",
  },
  description:
    "Elegí tu plantilla, personalizala y publicala al instante. Sitios web profesionales con subdominio propio y pagos mensuales accesibles.",
  keywords: [
    "sitio web",
    "plantillas web",
    "creador de sitios",
    "web argentina",
    "sitiolisto",
    "landing page",
    "portfolio",
    "tienda online",
  ],
  openGraph: {
    title: "SitioListo — Tu sitio web, listo en minutos",
    description:
      "Elegí tu plantilla, personalizala y publicala al instante.",
    url: "https://sitiolisto.com.ar",
    siteName: "SitioListo",
    locale: "es_AR",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Tema global del producto (elegido por admin en /admin/apariencia).
  // oficina (default) → themeRootCss devuelve '' y no inyecta nada.
  const theme = getTheme(await fetchAppThemeCached());
  const themeCss = themeRootCss(theme);

  // `surface` y `useGradients` viven en el contrato desde el principio y las
  // plantillas de clientes ya los leen. Exponerlos como data-attributes deja
  // que la landing y el panel también los honren, y que sean un interruptor
  // más del skin en vez de una decisión escrita a mano en cada componente.

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable} ${sourceSerif.variable} ${bricolage.variable} ${workSans.variable}`}
      data-app-theme={theme.id}
      data-surface={theme.tokens.surface}
      data-gradients={theme.tokens.useGradients ? 'on' : 'off'}
      suppressHydrationWarning
    >
      <body>
        {themeCss && (
          <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
