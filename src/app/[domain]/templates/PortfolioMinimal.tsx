import React from 'react';

interface TemplateProps {
  siteName: string;
  primaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
}

export default function PortfolioMinimal({ 
  siteName, 
  primaryColor, 
  heroTitle, 
  heroSubtitle, 
  aboutText 
}: TemplateProps) {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-100 selection:text-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-100">
        <span className="text-lg font-bold tracking-tight">{siteName}</span>
        <nav className="hidden sm:flex gap-8 text-xs font-medium uppercase tracking-widest text-gray-500">
          <a href="#work" className="hover:text-black transition-colors">Trabajos</a>
          <a href="#about" className="hover:text-black transition-colors">Sobre mí</a>
          <a href="#contact" className="hover:text-black transition-colors">Contacto</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="pt-40 md:pt-60 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <h2 className="text-5xl md:text-8xl font-bold leading-tight tracking-tighter mb-8">
            {heroTitle || siteName}
          </h2>
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-2xl mb-12">
            {heroSubtitle || "Diseñador independiente enfocado en crear soluciones digitales minimalistas y funcionales."}
          </p>
          <div className="h-px w-20 bg-gray-200" />
        </div>
      </section>

      {/* Work Grid */}
      <section id="work" className="px-6 md:px-12 py-20 border-t border-gray-100 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h3 className="text-3xl font-bold">Proyectos</h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">2024 — 2026</span>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { title: 'Identidad Visual', category: 'Design' },
              { title: 'Plataforma Web', category: 'Development' },
              { title: 'App Mobile', category: 'UX/UI' },
              { title: 'E-commerce', category: 'Shopify' }
            ].map((item, idx) => (
              <div key={idx} className="group">
                <div className="aspect-[16/10] bg-gray-100 rounded-xl mb-6 overflow-hidden border border-gray-100">
                   {/* Imagen Placeholder */}
                   <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 font-medium italic">
                      Project {idx + 1}
                   </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">{item.category}</span>
                  <h4 className="text-xl font-bold group-hover:underline underline-offset-4 decoration-2" style={{ textDecorationColor: primaryColor }}>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 md:px-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
          <h3 className="text-3xl font-bold">Sobre mí</h3>
          <div className="space-y-8">
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              {aboutText || "Ayudo a marcas y startups a destacar a través de un diseño limpio y una estrategia sólida."}
            </p>
            <button 
              className="px-8 py-3 rounded-lg text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              Hablemos hoy
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-20 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <span className="text-lg font-bold">{siteName}</span>
          <div className="flex gap-10 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-black">Instagram</a>
            <a href="#" className="hover:text-black">LinkedIn</a>
            <a href="#" className="hover:text-black">Behance</a>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">© {new Date().getFullYear()} — SitioListo</p>
        </div>
      </footer>
    </div>
  );
}
