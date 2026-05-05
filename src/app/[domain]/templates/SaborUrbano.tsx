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
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans selection:bg-orange-50 selection:text-orange-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center bg-white/90 backdrop-blur-md border-b border-gray-100">
        <h1 className="text-xl font-bold tracking-tight uppercase" style={{ color: primaryColor }}>
          {siteName}
        </h1>
        <div className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <a href="#menu" className="hover:text-black">Menú</a>
          <a href="#about" className="hover:text-black">Nosotros</a>
          <a href="#contact" className="hover:text-black">Contacto</a>
        </div>
        <button 
          className="px-6 py-2.5 rounded-lg text-white text-xs font-bold transition-all hover:opacity-90 active:scale-95 shadow-sm uppercase tracking-widest"
          style={{ backgroundColor: primaryColor }}
        >
          Reservar
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center px-6 bg-gray-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ 
            backgroundImage: "url('/templates/restaurant_hero.png')",
          }}
        />
        <div className="relative z-10 max-w-4xl text-white">
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
            {heroTitle || "Una experiencia única"}
          </h2>
          <p className="text-xl md:text-2xl mb-12 font-medium opacity-90 max-w-2xl mx-auto">
            {heroSubtitle || "Disfrutá de la mejor gastronomía en un ambiente relajado y moderno."}
          </p>
          <a 
            href="#menu"
            className="inline-block px-10 py-4 bg-white text-black rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors"
          >
            Ver la Carta
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50">
             <img src="/templates/restaurant_hero.png" alt="Nosotros" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block" style={{ color: primaryColor }}>Desde 2010</span>
            <h3 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Nuestra Historia</h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              {aboutText || "Nacimos con la pasión de llevar los sabores más auténticos a tu mesa, utilizando ingredientes frescos y técnicas artesanales."}
            </p>
            <div className="grid grid-cols-2 gap-10 py-10 border-t border-gray-100">
              <div>
                <span className="block text-3xl font-bold mb-1" style={{ color: primaryColor }}>12k+</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Clientes felices</span>
              </div>
              <div>
                <span className="block text-3xl font-bold mb-1" style={{ color: primaryColor }}>4.9/5</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Puntaje Google</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 px-6 text-center bg-gray-50 border-y border-gray-100">
        <h3 className="text-3xl md:text-5xl font-bold mb-10 tracking-tight">¿Buscás una mesa?</h3>
        <button 
          className="px-12 py-5 rounded-lg text-white font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90 shadow-lg"
          style={{ backgroundColor: primaryColor }}
        >
          Hacer Reserva
        </button>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-20 bg-white text-center">
        <h4 className="text-xl font-bold mb-8 uppercase tracking-widest" style={{ color: primaryColor }}>{siteName}</h4>
        <div className="flex justify-center gap-10 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-10">
          <a href="#" className="hover:text-black">Instagram</a>
          <a href="#" className="hover:text-black">Facebook</a>
          <a href="#" className="hover:text-black">TripAdvisor</a>
        </div>
        <p className="text-gray-400 text-[10px] font-bold tracking-[0.4em] uppercase">© {new Date().getFullYear()} — SITIO LISTO</p>
      </footer>
    </div>
  );
}
