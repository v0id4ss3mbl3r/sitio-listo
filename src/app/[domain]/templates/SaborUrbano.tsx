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
    <div className="min-h-screen bg-[#080808] text-white font-sans selection:bg-white selection:text-black scroll-smooth">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-reveal {
          animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
      `}} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 md:px-12 flex justify-between items-center bg-[#080808]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl rotate-12 flex items-center justify-center font-black text-black text-lg transition-transform hover:rotate-0" style={{ backgroundColor: primaryColor }}>
            {siteName.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">
            {siteName}
          </h1>
        </div>
        
        <div className="hidden lg:flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          <a href="#menu" className="hover:text-white transition-colors relative group">
            La Carta
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full" />
          </a>
          <a href="#about" className="hover:text-white transition-colors relative group">
            Nosotros
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full" />
          </a>
          <a href="#location" className="hover:text-white transition-colors relative group">
            Contacto
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full" />
          </a>
        </div>

        <button 
          className="px-8 py-3 rounded-full text-[11px] font-black transition-all hover:scale-105 active:scale-95 shadow-2xl uppercase tracking-widest text-white border-none"
          style={{ backgroundColor: primaryColor }}
        >
          RESERVAR
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center text-center px-6 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ 
            backgroundImage: "url('/templates/restaurant_hero.png')",
            filter: 'brightness(0.3) contrast(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/20 via-transparent to-[#080808]" />

        <div className="relative z-10 max-w-6xl animate-reveal">
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.3em] mb-12 border uppercase backdrop-blur-md"
            style={{ borderColor: `${primaryColor}40`, color: primaryColor, background: `${primaryColor}05` }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
            Open for dinner
          </div>
          <h2 className="text-6xl md:text-9xl lg:text-[11rem] font-black mb-10 tracking-tighter leading-[0.8] uppercase italic">
            {heroTitle || siteName}
          </h2>
          <p className="text-lg md:text-2xl text-gray-400 mb-16 font-medium leading-relaxed max-w-2xl mx-auto opacity-80">
            {heroSubtitle || "Donde el sabor se encuentra con la calle. Ingredientes reales, fuego y pasión."}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="#menu"
              className="group relative px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all text-black hover:pr-16"
              style={{ backgroundColor: primaryColor }}
            >
              Ver Menú
              <span className="absolute right-8 opacity-0 group-hover:opacity-100 transition-all">→</span>
            </a>
            <a 
              href="#about"
              className="px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all border border-white/10 hover:bg-white hover:text-black"
            >
              Nuestra Historia
            </a>
          </div>
        </div>
      </section>

      {/* Featured Menu Grid */}
      <section id="menu" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-6">Favoritos <br/> del Mes</h3>
            <p className="text-gray-500 font-medium leading-relaxed">Seleccionamos lo mejor de nuestra cocina para que no tengas que elegir. Sabores intensos garantizados.</p>
          </div>
          <div className="h-px flex-1 bg-white/5 mx-12 hidden md:block" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Special Selection</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            { name: 'Doble Smash Bacon', price: '$8.500', tags: ['BEST SELLER', 'HOT'] },
            { name: 'Crispy Chicken Box', price: '$7.200', tags: ['NEW'] },
            { name: 'Truffle Burger', price: '$9.800', tags: ['PREMIUM'] }
          ].map((item, idx) => (
            <div key={idx} className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-2">
              <div className="aspect-square rounded-2xl bg-white/5 mb-8 overflow-hidden">
                <div className="w-full h-full bg-gray-900/50 flex items-center justify-center italic text-gray-700 font-black">IMAGE {idx + 1}</div>
              </div>
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-2xl font-black uppercase italic leading-none">{item.name}</h4>
                <span className="font-black text-lg" style={{ color: primaryColor }}>{item.price}</span>
              </div>
              <div className="flex gap-2 mb-6">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[8px] font-black px-2 py-1 bg-white/10 rounded uppercase tracking-widest">{tag}</span>
                ))}
              </div>
              <button className="w-full py-3 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all">Pedir Ahora</button>
            </div>
          ))}
        </div>
      </section>

      {/* History & Vibe */}
      <section id="about" className="py-32 md:py-48 px-6 bg-[#0c0c0c]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-24 items-center">
          <div className="relative group">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
               <img src="/templates/restaurant_hero.png" alt="Burgers" className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white text-black rounded-full flex flex-col items-center justify-center text-center p-8 rotate-12 group-hover:rotate-0 transition-transform">
              <span className="text-4xl font-black leading-none mb-1">100%</span>
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Real Food</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-10">
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
              Nacido en <br/> <span style={{ color: primaryColor }}>la calle</span>
            </h3>
            <p className="text-xl text-gray-400 leading-relaxed font-medium">
              {aboutText || "Todo empezó con una parrilla, un sueño y la obsesión por encontrar la hamburguesa perfecta. Hoy, compartimos esa obsesión con vos cada noche."}
            </p>
            <div className="grid grid-cols-2 gap-12 border-y border-white/5 py-12">
              <div>
                <span className="block text-5xl font-black mb-3">15+</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600">Recetas Propias</span>
              </div>
              <div>
                <span className="block text-5xl font-black mb-3">24/7</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600">Pasión Total</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section id="location" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
            <h3 className="text-4xl font-black uppercase italic mb-10">Horarios</h3>
            <div className="space-y-6">
              {[
                { days: 'Lunes a Jueves', hours: '19:00 — 00:00' },
                { days: 'Viernes y Sábados', hours: '19:00 — 02:00' },
                { days: 'Domingos', hours: '19:30 — 23:30' }
              ].map(item => (
                <div key={item.days} className="flex justify-between items-center pb-6 border-b border-white/5">
                  <span className="text-gray-400 font-bold uppercase text-[11px] tracking-widest">{item.days}</span>
                  <span className="font-black text-sm">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-4xl font-black uppercase italic mb-8">Ubicación</h3>
              <p className="text-2xl font-bold mb-4">Av. Siempreviva 742</p>
              <p className="text-gray-500 font-medium">Buenos Aires, Argentina</p>
            </div>
            <button className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest mt-12 transition-all hover:bg-white hover:text-black border border-white/10">Cómo llegar</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 text-center bg-[#080808]">
        <h4 className="text-4xl font-black mb-10 tracking-tighter uppercase italic">{siteName}</h4>
        <div className="flex justify-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 mb-16">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Facebook</a>
          <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
        </div>
        <div className="flex flex-col items-center gap-4">
           <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-500">
             © {new Date().getFullYear()} — SITIO LISTO
           </div>
        </div>
      </footer>
    </div>
  );
}
