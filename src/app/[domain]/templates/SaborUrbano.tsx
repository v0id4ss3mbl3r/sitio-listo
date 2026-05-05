import React from 'react';

interface TemplateProps {
  siteName: string;
  primaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
}

export default function SaborUrbano({ 
  siteName, 
  primaryColor, 
  heroTitle, 
  heroSubtitle, 
  aboutText 
}: TemplateProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] font-sans selection:bg-orange-500/30 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <h1 className="text-2xl font-black tracking-tighter" style={{ color: primaryColor }}>
          {siteName.toUpperCase()}
        </h1>
        <div className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          <a href="#menu" className="hover:text-white transition-colors">Menú</a>
          <a href="#about" className="hover:text-white transition-colors">Nosotros</a>
          <a href="#contact" className="hover:text-white transition-colors">Contacto</a>
        </div>
        <button 
          className="px-8 py-3 rounded-full text-[10px] font-black transition-all hover:scale-105 active:scale-95 shadow-xl uppercase tracking-widest text-white"
          style={{ backgroundColor: primaryColor }}
        >
          Reservar
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/templates/restaurant_hero.png')",
            filter: 'brightness(0.2) contrast(1.1)'
          }}
        />
        <div className="relative z-10 max-w-4xl">
          <div 
            className="inline-block px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] mb-10 border uppercase"
            style={{ borderColor: `${primaryColor}40`, color: primaryColor, background: `${primaryColor}10` }}
          >
            Sabor Auténtico
          </div>
          <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black mb-10 tracking-tighter leading-[0.8] uppercase">
            {heroTitle || siteName}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-14 font-medium leading-relaxed max-w-2xl mx-auto opacity-80">
            {heroSubtitle || "Una propuesta gastronómica que combina tradición con un toque moderno."}
          </p>
          <a 
            href="#menu"
            className="inline-flex items-center gap-4 px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-black border border-white/20"
          >
            Explorar Menú
          </a>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 md:py-48 px-6 bg-[#080808]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
               <img src="/templates/restaurant_hero.png" alt="About" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000" />
            </div>
            <div 
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full flex items-center justify-center text-center p-6 text-[10px] font-black tracking-widest border border-white/10 backdrop-blur-xl"
              style={{ background: `${primaryColor}20`, color: primaryColor }}
            >
              EST. 2024
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <h3 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">Nuestra Historia</h3>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-medium">
              {aboutText || "Llevamos la cocina urbana a un nuevo nivel, honrando las raíces pero siempre mirando hacia adelante."}
            </p>
            <div className="grid grid-cols-2 gap-10 py-12 border-y border-white/5">
              <div>
                <span className="block text-4xl font-black mb-2" style={{ color: primaryColor }}>15+</span>
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500">Años de pasión</span>
              </div>
              <div>
                <span className="block text-4xl font-black mb-2" style={{ color: primaryColor }}>4.9/5</span>
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500">Reseñas Clientes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-24 border-t border-white/5 text-center bg-[#050505]">
        <h4 className="text-2xl font-black mb-8 tracking-tighter uppercase italic" style={{ color: primaryColor }}>{siteName}</h4>
        <div className="flex justify-center gap-10 text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-12">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Facebook</a>
          <a href="#" className="hover:text-white transition-colors">Ubicación</a>
        </div>
        <p className="text-gray-700 text-[9px] font-bold tracking-[0.4em] uppercase">© {new Date().getFullYear()} — DISEÑADO CON SITIOLISTO</p>
      </footer>
    </div>
  );
}
