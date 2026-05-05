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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500 selection:text-white">
      {/* Modern Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 md:px-12 flex justify-between items-center bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg rotate-12 flex items-center justify-center font-black text-black" style={{ backgroundColor: primaryColor }}>S</div>
          <h1 className="text-xl font-black tracking-tighter">
            {siteName.toUpperCase()}
          </h1>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <a href="#menu" className="hover:text-white transition-colors">La Carta</a>
          <a href="#about" className="hover:text-white transition-colors">Nosotros</a>
          <a href="#contact" className="hover:text-white transition-colors">Contacto</a>
        </div>
        <button 
          className="px-6 py-2.5 rounded-lg text-[11px] font-black transition-all hover:brightness-110 active:scale-95 shadow-lg uppercase tracking-widest text-white border-none"
          style={{ backgroundColor: primaryColor }}
        >
          RESERVAR MESA
        </button>
      </nav>

      {/* Hero: The Burger Experience */}
      <section className="relative h-[90vh] flex items-center justify-center text-center px-6 pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/templates/restaurant_hero.png')",
            filter: 'brightness(0.3)'
          }}
        />
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]" />

        <div className="relative z-10 max-w-5xl">
          <span 
            className="inline-block px-3 py-1 rounded-md text-[10px] font-black tracking-[0.4em] mb-6 border uppercase"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Street Food Culture
          </span>
          <h2 className="text-5xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tight leading-[0.9] uppercase italic">
            {heroTitle || "Sabor que rompe las reglas"}
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            {heroSubtitle || "Hamburguesas artesanales, ingredientes premium y la mejor vibra de la ciudad."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#menu"
              className="px-10 py-4 rounded-lg font-black text-xs uppercase tracking-widest transition-all text-black hover:scale-105 border-none"
              style={{ backgroundColor: primaryColor }}
            >
              EXPLORAR MENÚ
            </a>
            <a 
              href="#about"
              className="px-10 py-4 rounded-lg font-black text-xs uppercase tracking-widest transition-all border-2 border-white/10 hover:border-white hover:bg-white/5"
            >
              NUESTRA HISTORIA
            </a>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: '100% Carne Premium', desc: 'Seleccionamos los mejores cortes para un sabor inigualable.' },
            { title: 'Pan Artesanal', desc: 'Horneado cada mañana para mantener la frescura perfecta.' },
            { title: 'Salsas Secretas', desc: 'Recetas exclusivas que solo vas a encontrar acá.' }
          ].map((item, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded-full mb-6 flex items-center justify-center font-bold" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                0{idx + 1}
              </div>
              <h3 className="text-xl font-black mb-4 uppercase">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About: High Contrast Story */}
      <section id="about" className="py-32 px-6 bg-[#0c0c0c]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-20 items-center">
          <div className="w-full md:w-1/2 aspect-square rounded-3xl overflow-hidden border border-white/10">
             <img src="/templates/restaurant_hero.png" alt="Burgers" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase leading-none">
              Pasión por <br/> lo que <span style={{ color: primaryColor }}>hacemos</span>
            </h3>
            <p className="text-xl text-gray-400 leading-relaxed mb-10">
              {aboutText || "No somos solo una hamburguesería. Somos un punto de encuentro para los amantes de la buena comida y los momentos memorables."}
            </p>
            <div className="flex gap-12 border-t border-white/10 pt-10">
              <div>
                <span className="block text-4xl font-black mb-2">12+</span>
                <span className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Variedades</span>
              </div>
              <div>
                <span className="block text-4xl font-black mb-2">50k+</span>
                <span className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Fans</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-20 border-t border-white/10 text-center">
        <h4 className="text-3xl font-black mb-10 tracking-tighter uppercase italic">{siteName}</h4>
        <div className="flex justify-center gap-10 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-12">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Facebook</a>
          <a href="#" className="hover:text-white transition-colors">Ubicación</a>
        </div>
        <p className="text-gray-700 text-[10px] font-bold tracking-[0.4em] uppercase italic">
          Powered by SitioListo — {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
