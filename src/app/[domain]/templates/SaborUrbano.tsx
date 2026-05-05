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
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] font-sans selection:bg-white selection:text-black scroll-smooth overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@500;800&display=swap');
        
        :root {
          --primary: ${primaryColor};
        }

        body {
          font-family: 'Inter', sans-serif;
        }

        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        @keyframes revealUp {
          from { opacity: 0; transform: translateY(40px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .reveal {
          animation: revealUp 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .btn-primary {
          background: var(--primary);
          box-shadow: 0 10px 30px -10px ${primaryColor}80;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .btn-primary:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 15px 40px -10px ${primaryColor};
        }

        .nav-link {
          position: relative;
          color: #999;
          transition: color 0.3s;
        }

        .nav-link:hover {
          color: #fff;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          width: 0;
          height: 2px;
          background: var(--primary);
          transition: all 0.3s;
          transform: translateX(-50%);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .section-padding {
          padding-top: clamp(5rem, 10vw, 12rem);
          padding-bottom: clamp(5rem, 10vw, 12rem);
        }

        .hero-title {
          font-size: clamp(3.5rem, 12vw, 11rem);
          line-height: 0.85;
          letter-spacing: -0.05em;
        }
      `}} />

      {/* High-End Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 h-24 md:px-12 flex justify-between items-center bg-[#050505]/60 backdrop-blur-2xl border-b border-white/5 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-black text-2xl shadow-lg" style={{ backgroundColor: primaryColor }}>
            {siteName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic text-white hidden sm:block">
            {siteName}
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.3em]">
          <a href="#menu" className="nav-link">La Carta</a>
          <a href="#about" className="nav-link">Historia</a>
          <a href="#location" className="nav-link">Visitanos</a>
        </div>

        <button className="btn-primary px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white border-none cursor-pointer">
          RESERVAR MESA
        </button>
      </nav>

      {/* Hero Section: Cinematic & Clean */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 pt-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-linear hover:scale-110"
          style={{ 
            backgroundImage: "url('/templates/restaurant_hero.png')",
            filter: 'brightness(0.3) contrast(1.1)'
          }}
        />
        {/* Vignette Overlay */}
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />

        <div className="relative z-10 max-w-7xl reveal">
          <div 
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full text-[10px] font-black tracking-[0.4em] mb-12 border uppercase backdrop-blur-md"
            style={{ borderColor: `${primaryColor}30`, color: primaryColor, background: `${primaryColor}05` }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
            Premium Street Food
          </div>
          <h2 className="hero-title font-black mb-12 uppercase italic text-white">
            {heroTitle || "Sabor que <br/> trasciende"}
          </h2>
          <p className="text-lg md:text-2xl text-gray-400 mb-16 font-medium leading-relaxed max-w-3xl mx-auto opacity-90">
            {heroSubtitle || "Artesanía en cada mordida. Usamos los mejores ingredientes para crear la hamburguesa definitiva."}
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <a 
              href="#menu"
              className="btn-primary px-16 py-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] text-black"
            >
              Explorar Menú
            </a>
            <a 
              href="#about"
              className="px-16 py-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all border-2 border-white/10 hover:border-white hover:bg-white/5"
            >
              Nuestra Mística
            </a>
          </div>
        </div>
      </section>

      {/* Featured Items: Studio Grid */}
      <section id="menu" className="section-padding px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
          <div className="max-w-2xl reveal">
            <h3 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] mb-8">Selección <br/> del Chef</h3>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">No es comida rápida, es cocina de autor entre dos panes. Descubrí por qué somos la referencia de la ciudad.</p>
          </div>
          <div className="font-mono text-[11px] font-black uppercase tracking-[0.5em] text-gray-700 border-b border-white/10 pb-4">
            Curated Menu 2024
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            { id: '01', name: 'Original Smash', desc: 'Doble carne, cheddar real, cebolla braseada.', price: '$8.200' },
            { id: '02', name: 'Blue Cheese', desc: 'Roquefort premium, nueces y miel de caña.', price: '$9.500' },
            { id: '03', name: 'Crispy Truffle', desc: 'Aceite de trufa blanca y hongos silvestres.', price: '$10.800' }
          ].map((item, idx) => (
            <div key={idx} className="group glass p-10 rounded-[3rem] transition-all hover:-translate-y-4 hover:bg-white/[0.05]">
              <div className="aspect-[4/5] rounded-[2rem] bg-black/50 mb-10 overflow-hidden relative shadow-2xl">
                 <div className="w-full h-full flex items-center justify-center text-gray-800 text-7xl font-black italic opacity-20">
                   {item.id}
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                   <h4 className="text-3xl font-black uppercase italic leading-none">{item.name}</h4>
                   <span className="font-mono text-sm font-black" style={{ color: primaryColor }}>{item.price}</span>
                </div>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                <div className="w-full h-px bg-white/5 my-4" />
                <button className="w-full py-5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95">
                  PEDIR AHORA
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section: Luxury Storytelling */}
      <section id="about" className="section-padding px-6 bg-[#080808]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-32 items-center">
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border border-white/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
               <img src="/templates/restaurant_hero.png" alt="Process" className="w-full h-full object-cover grayscale brightness-50 transition-all duration-1000 hover:grayscale-0 hover:brightness-100" />
            </div>
            {/* Minimalist Floating Badge */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 glass rounded-full flex flex-col items-center justify-center text-center p-8 z-10">
              <div className="text-5xl font-black italic mb-1" style={{ color: primaryColor }}>100</div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Quality</span>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-12">
            <h3 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] text-white">
              Fuego <br/> & <span style={{ color: primaryColor }}>Dedicación</span>
            </h3>
            <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-medium">
              {aboutText || "Nuestra mística nace de la paciencia. Seleccionamos cada corte, horneamos nuestro propio pan y creamos salsas que no existen en ningún otro lugar."}
            </p>
            <div className="flex gap-16 pt-16 border-t border-white/5">
              <div>
                <span className="block text-5xl font-black mb-4 font-mono">12</span>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-600">Hamburguesas</span>
              </div>
              <div>
                <span className="block text-5xl font-black mb-4 font-mono">24h</span>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-600">Cocción Lenta</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Información: Modern Modular */}
      <section id="location" className="section-padding px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          <div className="p-16 md:p-20 rounded-[4rem] glass flex flex-col gap-16">
            <h3 className="text-5xl font-black uppercase italic tracking-tighter">Horarios</h3>
            <div className="flex flex-col gap-10">
              {[
                { d: 'Lun a Jue', h: '19:00 — 00:00' },
                { d: 'Vie y Sáb', h: '19:00 — 02:00' },
                { d: 'Domingos', h: '19:30 — 23:30' }
              ].map(item => (
                <div key={item.d} className="flex justify-between items-center group">
                  <span className="text-gray-500 font-black uppercase text-xs tracking-[0.3em] group-hover:text-white transition-colors">{item.d}</span>
                  <span className="font-mono text-xl font-black">{item.h}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-16 md:p-20 rounded-[4rem] glass flex flex-col justify-between gap-16">
            <div className="flex flex-col gap-10">
              <h3 className="text-5xl font-black uppercase italic tracking-tighter">Visitanos</h3>
              <div className="flex flex-col gap-4">
                <p className="text-4xl font-black leading-tight italic">Av. Siempreviva 742</p>
                <p className="text-lg text-gray-500 font-medium tracking-widest uppercase">Buenos Aires, Argentina</p>
              </div>
            </div>
            <button className="btn-primary w-full py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] text-black">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* Footer: Minimal & Sophisticated */}
      <footer className="py-32 px-6 border-t border-white/5 text-center bg-[#050505]">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-24">
          <div className="flex flex-col items-center gap-8">
            <div className="w-16 h-16 rounded-[2rem] flex items-center justify-center font-black text-black text-3xl italic" style={{ backgroundColor: primaryColor }}>
              {siteName.charAt(0).toUpperCase()}
            </div>
            <h4 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">{siteName}</h4>
          </div>
          
          <div className="flex flex-wrap justify-center gap-16 text-[11px] font-black uppercase tracking-[0.5em] text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
          </div>
          
          <div className="w-full pt-20 border-t border-white/5 flex flex-col items-center gap-10">
            <div className="font-mono text-[9px] font-black text-gray-700 tracking-[0.6em] uppercase">
              Designed by SitioListo
            </div>
            <div className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
