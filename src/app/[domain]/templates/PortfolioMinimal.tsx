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
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] selection:bg-black selection:text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference invert">
        <span className="text-xl font-black tracking-tight">{siteName}</span>
        <nav className="flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em]">
          <a href="#work" className="hover:opacity-50 transition-opacity">Trabajo</a>
          <a href="#about" className="hover:opacity-50 transition-opacity">Info</a>
          <a href="mailto:hola@ejemplo.com" className="hover:opacity-50 transition-opacity">Contacto</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="pt-48 pb-32 px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-8">
            <h2 className="text-7xl md:text-[10rem] font-black leading-[0.85] tracking-tighter mb-12">
              {heroTitle}
            </h2>
            <p className="text-xl md:text-3xl font-medium leading-tight max-w-xl text-gray-500">
              {heroSubtitle}
            </p>
          </div>
          <div className="md:col-span-4 aspect-[3/4] relative overflow-hidden rounded-3xl bg-gray-100">
            <img 
              src="/templates/portfolio_hero.png" 
              alt="Profile" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
            />
          </div>
        </div>
      </section>

      {/* Work Grid */}
      <section id="work" className="px-8 py-32 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <h3 className="text-5xl font-black tracking-tight italic">Proyectos destacados</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">2023 — 2026</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group relative aspect-video bg-[#111111] p-12 overflow-hidden flex flex-col justify-end transition-all hover:bg-white hover:text-black">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">0{i} / Digital Design</span>
                <h4 className="text-3xl font-black tracking-tight mb-4">Caso de Estudio {i}</h4>
                <div 
                  className="w-0 group-hover:w-full h-1 transition-all duration-500" 
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-48 px-8 max-w-4xl mx-auto text-center">
        <div className="mb-12 inline-flex items-center justify-center w-12 h-12 rounded-full border border-black/10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <p className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
          {aboutText}
        </p>
        <button 
          className="mt-16 px-12 py-5 rounded-full text-white font-bold transition-all hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
          style={{ backgroundColor: primaryColor }}
        >
          HABLEMOS
        </button>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-black/5 flex flex-col items-center gap-8">
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
          <a href="#" className="hover:opacity-40">Twitter</a>
          <a href="#" className="hover:opacity-40">Instagram</a>
          <a href="#" className="hover:opacity-40">LinkedIn</a>
        </div>
        <p className="text-[9px] font-medium text-gray-400 tracking-[0.5em] uppercase">
          Hecho con amor en SitioListo — {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
