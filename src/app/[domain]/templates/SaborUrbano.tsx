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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-sans">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ backgroundColor: primaryColor }}
        />
        <div 
          className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-10"
          style={{ backgroundColor: primaryColor }}
        />
      </div>

      {/* Dynamic Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center backdrop-blur-xl bg-black/40 border-b border-white/5">
        <h1 className="text-2xl font-black tracking-tighter" style={{ color: primaryColor }}>
          {siteName.toUpperCase()}
        </h1>
        <div className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          <a href="#menu" className="hover:text-white transition-colors">Carta</a>
          <a href="#about" className="hover:text-white transition-colors">Nosotros</a>
          <a href="#contact" className="hover:text-white transition-colors">Ubicación</a>
        </div>
        <button 
          className="px-8 py-2.5 rounded-full text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] uppercase tracking-widest"
          style={{ backgroundColor: primaryColor }}
        >
          Reservar
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center px-6">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/templates/restaurant_hero.png')",
            filter: 'brightness(0.25) contrast(1.1)'
          }}
        />
        <div className="relative z-10 max-w-5xl">
          <div 
            className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.3em] mb-8 border backdrop-blur-md uppercase"
            style={{ borderColor: `${primaryColor}40`, color: primaryColor, background: `${primaryColor}10` }}
          >
            Experiencia Gastronómica
          </div>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-[0.9] uppercase">
            {heroTitle || "Sabor que cautiva"}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-12 font-medium leading-relaxed max-w-2xl mx-auto opacity-80">
            {heroSubtitle || "Descubrí una fusión única de ingredientes locales y técnicas internacionales."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#menu"
              className="px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all hover:bg-white hover:text-black border border-white/20 backdrop-blur-sm"
            >
              Explorar Menú
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 md:py-48 px-6 relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="relative">
            <div 
              className="absolute -inset-6 rounded-3xl opacity-20 blur-3xl"
              style={{ backgroundColor: primaryColor }}
            />
            <div className="relative aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
               <img src="/templates/restaurant_hero.png" alt="About" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000" />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <h3 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">Nuestra Historia</h3>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-medium">
              {aboutText || "Llevamos más de una década perfeccionando el arte de la cocina urbana, combinando tradición con un toque moderno."}
            </p>
            <div className="grid grid-cols-2 gap-10 py-10 border-y border-white/10">
              <div>
                <span className="block text-4xl font-black mb-2" style={{ color: primaryColor }}>15+</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Años de pasión</span>
              </div>
              <div>
                <span className="block text-4xl font-black mb-2" style={{ color: primaryColor }}>4.9/5</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Reseñas Google</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-32 px-6 text-center bg-white text-black">
        <h3 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase italic">¿Listo para visitarnos?</h3>
        <p className="text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto opacity-70">
          Reservá tu mesa ahora y asegurate un lugar en nuestra mesa.
        </p>
        <button 
          className="px-16 py-6 rounded-full text-white font-black text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-2xl"
          style={{ backgroundColor: primaryColor }}
        >
          Hacer Reserva
        </button>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-20 bg-[#050505] text-center border-t border-white/5">
        <h4 className="text-2xl font-black mb-8 tracking-tighter uppercase" style={{ color: primaryColor }}>{siteName}</h4>
        <div className="flex justify-center gap-10 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-10">
          <a href="#" className="hover:text-white">Instagram</a>
          <a href="#" className="hover:text-white">Facebook</a>
          <a href="#" className="hover:text-white">TripAdvisor</a>
        </div>
        <p className="text-gray-600 text-[10px] font-bold tracking-[0.4em] uppercase">© {new Date().getFullYear()} — DISEÑADO CON SITIOLISTO</p>
      </footer>
    </div>
  );
}
