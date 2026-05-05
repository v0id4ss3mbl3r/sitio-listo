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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500 selection:text-white scroll-smooth overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal {
          animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .header-blur {
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: saturate(180%) blur(20px);
        }
      `}} />

      {/* Navigation: Clean & Solid */}
      <nav className="fixed top-0 w-full z-50 px-6 h-20 md:px-12 flex justify-between items-center header-blur border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black text-xl" style={{ backgroundColor: primaryColor }}>
            {siteName.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none">
            {siteName}
          </h1>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
          <a href="#menu" className="hover:text-white transition-colors">La Carta</a>
          <a href="#about" className="hover:text-white transition-colors">Nosotros</a>
          <a href="#location" className="hover:text-white transition-colors">Contacto</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="px-8 py-3.5 rounded-full text-[11px] font-black transition-all hover:scale-105 active:scale-95 shadow-xl uppercase tracking-widest text-white border-none"
            style={{ backgroundColor: primaryColor }}
          >
            RESERVAR
          </button>
        </div>
      </nav>

      {/* Hero Section: Centered & Impactful */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/templates/restaurant_hero.png')",
            filter: 'brightness(0.25) contrast(1.2)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]" />

        <div className="relative z-10 max-w-5xl reveal">
          <div 
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black tracking-[0.4em] mb-12 border uppercase"
            style={{ borderColor: primaryColor, color: primaryColor, background: `${primaryColor}10` }}
          >
            Urban Food Experience
          </div>
          <h2 className="text-5xl md:text-8xl lg:text-[9rem] font-black mb-12 tracking-tighter leading-[0.85] uppercase italic">
            {heroTitle || siteName}
          </h2>
          <p className="text-lg md:text-2xl text-gray-400 mb-16 font-medium leading-relaxed max-w-3xl mx-auto">
            {heroSubtitle || "Auténtico sabor de calle. Ingredientes frescos, recetas audaces y la mejor vibra de la ciudad."}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a 
              href="#menu"
              className="px-14 py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-black hover:scale-105 shadow-2xl"
              style={{ backgroundColor: primaryColor }}
            >
              Explorar Menú
            </a>
            <a 
              href="#about"
              className="px-14 py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 border-white/20 hover:border-white hover:bg-white/5"
            >
              Ver Historia
            </a>
          </div>
        </div>
      </section>

      {/* Featured Menu: Clean Grid */}
      <section id="menu" className="py-32 md:py-48 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-8">Nuestros Favoritos</h3>
          <div className="w-24 h-2 mx-auto rounded-full" style={{ backgroundColor: primaryColor }} />
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            { name: 'Doble Smash', price: '$8.500', tag: 'BEST SELLER' },
            { name: 'Spicy Burger', price: '$7.900', tag: 'NEW' },
            { name: 'Veggie Power', price: '$7.200', tag: 'LITE' }
          ].map((item, idx) => (
            <div key={idx} className="group p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-2">
              <div className="aspect-square rounded-3xl bg-white/5 mb-10 overflow-hidden relative">
                <div className="w-full h-full flex items-center justify-center text-gray-800 text-6xl font-black italic">B{idx+1}</div>
                <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-black text-[10px] font-black tracking-widest text-white">{item.tag}</div>
              </div>
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-3xl font-black uppercase italic leading-none">{item.name}</h4>
                <span className="font-black text-2xl" style={{ color: primaryColor }}>{item.price}</span>
              </div>
              <button className="w-full py-5 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98]">
                Pedir Ahora
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* About Section: Balanced & No Overlaps */}
      <section id="about" className="py-32 md:py-48 px-6 bg-[#0c0c0c]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-24 items-center">
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)]">
               <img src="/templates/restaurant_hero.png" alt="Story" className="w-full h-full object-cover grayscale brightness-75 transition-all duration-1000 hover:grayscale-0 hover:brightness-100" />
            </div>
            {/* 100% Badge: Now positioned safely */}
            <div className="hidden md:flex absolute -top-8 -left-8 w-40 h-40 bg-white text-black rounded-full flex-col items-center justify-center text-center p-6 -rotate-12 border-[10px] border-[#0c0c0c] z-10">
              <span className="text-4xl font-black leading-none mb-1">100%</span>
              <span className="text-[11px] font-black uppercase tracking-widest">Real Quality</span>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-10">
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
              Pasión por <br/> el <span style={{ color: primaryColor }}>Sabor Real</span>
            </h3>
            <p className="text-xl text-gray-400 leading-relaxed font-medium">
              {aboutText || "Nacimos en el corazón de la ciudad con una misión clara: elevar la comida callejera a una experiencia de alta cocina. Cada hamburguesa es una obra de arte creada con fuego y dedicación."}
            </p>
            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-white/10">
              <div>
                <span className="block text-5xl font-black mb-3">20+</span>
                <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-500">Ingredientes</span>
              </div>
              <div>
                <span className="block text-5xl font-black mb-3">5/5</span>
                <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-500">Calidad</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Blocks: Fixed Layout */}
      <section id="location" className="py-32 md:py-48 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          <div className="p-16 rounded-[3rem] bg-white/[0.03] border border-white/5 flex flex-col gap-12">
            <h3 className="text-5xl font-black uppercase italic tracking-tighter">Horarios</h3>
            <div className="space-y-8">
              {[
                { d: 'Lunes a Jueves', h: '19:00 — 00:00' },
                { d: 'Viernes y Sábados', h: '19:00 — 02:00' },
                { d: 'Domingos', h: '19:30 — 23:30' }
              ].map(item => (
                <div key={item.d} className="flex justify-between items-center pb-8 border-b border-white/5">
                  <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">{item.d}</span>
                  <span className="font-black text-lg">{item.h}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-16 rounded-[3rem] bg-white/[0.03] border border-white/5 flex flex-col justify-between gap-12">
            <div className="flex flex-col gap-6">
              <h3 className="text-5xl font-black uppercase italic tracking-tighter">Ubicación</h3>
              <div className="flex flex-col gap-2">
                <p className="text-3xl font-black">Av. Siempreviva 742</p>
                <p className="text-lg text-gray-500 font-medium tracking-wide">Buenos Aires, Argentina</p>
              </div>
            </div>
            <button 
              className="w-full py-7 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-[1.02] shadow-2xl text-white border-none"
              style={{ backgroundColor: primaryColor }}
            >
              Cómo Llegar
            </button>
          </div>
        </div>
      </section>

      {/* Footer: Centered & Clean */}
      <footer className="py-32 px-6 border-t border-white/5 text-center bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-16">
          <h4 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">{siteName}</h4>
          
          <div className="flex flex-wrap justify-center gap-10 md:gap-16 text-[11px] font-black uppercase tracking-[0.4em] text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
          </div>
          
          <div className="pt-16 border-t border-white/5 w-full flex flex-col items-center gap-6">
            <p className="text-gray-600 text-[10px] font-bold tracking-[0.4em] uppercase italic opacity-50">
              © {new Date().getFullYear()} — SitioListo
            </p>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>
        </div>
      </footer>
    </div>
  );
}
