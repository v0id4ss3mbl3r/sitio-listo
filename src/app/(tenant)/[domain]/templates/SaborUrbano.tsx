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
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
      {/* Dynamic Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-black/20 border-b border-white/5">
        <h1 className="text-2xl font-black tracking-tighter" style={{ color: primaryColor }}>
          {siteName.toUpperCase()}
        </h1>
        <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-gray-400">
          <a href="#menu" className="hover:text-white transition-colors">Menú</a>
          <a href="#about" className="hover:text-white transition-colors">Nosotros</a>
          <a href="#contact" className="hover:text-white transition-colors">Contacto</a>
        </div>
        <button 
          className="px-6 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
          style={{ backgroundColor: primaryColor }}
        >
          RESERVAR
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: "url('/templates/restaurant_hero.png')",
            filter: 'brightness(0.3)'
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span 
            className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-[0.2em] mb-6 border animate-fade-in"
            style={{ borderColor: `${primaryColor}40`, color: primaryColor }}
          >
            BIENVENIDOS A {siteName}
          </span>
          <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
            {heroTitle}
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 font-light leading-relaxed max-w-2xl mx-auto">
            {heroSubtitle}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a 
              href="#menu"
              className="px-10 py-4 rounded-full font-bold transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              VER MENÚ
            </a>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity" />
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
               <img src="/templates/restaurant_hero.png" alt="About" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-8 tracking-tight">Nuestra Historia</h3>
            <p className="text-xl text-gray-400 leading-relaxed font-light mb-8">
              {aboutText}
            </p>
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
              <div>
                <span className="block text-3xl font-bold mb-1" style={{ color: primaryColor }}>15+</span>
                <span className="text-xs uppercase tracking-widest text-gray-500">Años de experiencia</span>
              </div>
              <div>
                <span className="block text-3xl font-bold mb-1" style={{ color: primaryColor }}>4.9/5</span>
                <span className="text-xs uppercase tracking-widest text-gray-500">Puntaje Clientes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <h4 className="text-xl font-bold mb-6 tracking-tighter">{siteName}</h4>
        <p className="text-gray-500 text-sm tracking-widest">© {new Date().getFullYear()} — DISEÑADO CON SITIOLISTO</p>
      </footer>
    </div>
  );
}
