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
    <div className="min-h-screen bg-[#f8f8f8] text-[#111111] selection:bg-black selection:text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center bg-[#f8f8f8]/80 backdrop-blur-xl border-b border-black/5">
        <span className="text-xl font-black tracking-tight uppercase">{siteName}</span>
        <nav className="hidden sm:flex gap-8 text-[10px] font-bold uppercase tracking-[0.3em]">
          <a href="#work" className="hover:opacity-40 transition-opacity">Proyectos</a>
          <a href="#about" className="hover:opacity-40 transition-opacity">Info</a>
          <a href="#contact" className="hover:opacity-40 transition-opacity">Contacto</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="pt-40 md:pt-56 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-center">
          <div className="md:col-span-8">
            <h2 className="text-5xl md:text-8xl lg:text-[9rem] font-black leading-[0.9] tracking-tighter mb-10 break-words">
              {heroTitle || siteName}
            </h2>
            <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-2xl text-gray-500">
              {heroSubtitle || "Diseño y estrategia para marcas digitales que buscan destacar."}
            </p>
          </div>
          <div className="md:col-span-4 aspect-[4/5] relative overflow-hidden rounded-2xl bg-gray-200 shadow-2xl">
            <img 
              src="/templates/portfolio_hero.png" 
              alt="Profile" 
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" 
            />
          </div>
        </div>
      </section>

      {/* Work Grid */}
      <section id="work" className="px-6 md:px-12 py-32 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <h3 className="text-4xl md:text-6xl font-black tracking-tight italic">Proyectos destacados</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Edición 2024 — 2026</span>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-px bg-white/5 border border-white/5">
            {[
              { id: '01', title: 'Identidad Visual', category: 'Digital Design' },
              { id: '02', title: 'Plataforma E-com', category: 'Web Development' },
              { id: '03', title: 'Campaña Social', category: 'Marketing' },
              { id: '04', title: 'App Mobile', category: 'Product Design' }
            ].map((item) => (
              <div key={item.id} className="group relative aspect-[16/10] bg-[#111111] p-10 overflow-hidden flex flex-col justify-end transition-all hover:bg-white hover:text-black">
                <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-8xl font-black">{item.id}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">{item.category}</span>
                <h4 className="text-3xl font-black tracking-tight mb-4">{item.title}</h4>
                <div 
                  className="w-0 group-hover:w-full h-1 transition-all duration-700" 
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-40 md:py-60 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="mb-10 inline-flex items-center justify-center w-14 h-14 rounded-full border border-black/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <p className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-16">
            {aboutText || "Soy un diseñador independiente enfocado en crear experiencias minimalistas y funcionales."}
          </p>
          <a 
            href="mailto:hola@ejemplo.com"
            className="px-12 py-5 rounded-full text-white font-bold transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest text-xs"
            style={{ backgroundColor: primaryColor }}
          >
            Hablemos hoy
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-20 border-t border-black/5 flex flex-col items-center gap-10">
        <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em]">
          <a href="#" className="hover:opacity-40 transition-opacity">Twitter</a>
          <a href="#" className="hover:opacity-40 transition-opacity">Instagram</a>
          <a href="#" className="hover:opacity-40 transition-opacity">LinkedIn</a>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-300 tracking-[0.6em] uppercase mb-2">Diseñado con SitioListo</p>
          <p className="text-[10px] font-bold text-gray-900 tracking-[0.2em] uppercase">© {new Date().getFullYear()} {siteName}</p>
        </div>
      </footer>
    </div>
  );
}
