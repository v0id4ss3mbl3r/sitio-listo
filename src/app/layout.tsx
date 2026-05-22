import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
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
