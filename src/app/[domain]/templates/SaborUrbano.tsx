"use client";
import React, { useState } from 'react';

interface TemplateProps {
  siteName: string;
  primaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
}

const MENU_CATEGORIES = [
  { id: 'burgers', label: 'Hamburguesas' },
  { id: 'sides', label: 'Acompañamientos' },
  { id: 'drinks', label: 'Bebidas' }
];

const MENU_ITEMS = {
  burgers: [
    { id: '01', name: 'Original Smash', desc: 'Doble carne, cheddar real, cebolla braseada.', price: '$8.200' },
    { id: '02', name: 'Blue Cheese', desc: 'Roquefort premium, nueces y miel de caña.', price: '$9.500' },
    { id: '03', name: 'Crispy Truffle', desc: 'Aceite de trufa blanca y hongos silvestres.', price: '$10.800' }
  ],
  sides: [
    { id: '04', name: 'Papas Rústicas', desc: 'Con romero, sal marina y alioli de la casa.', price: '$4.200' },
    { id: '05', name: 'Onion Rings', desc: 'Aros de cebolla gigantes con dip de BBQ.', price: '$4.500' }
  ],
  drinks: [
    { id: '06', name: 'IPA Artesanal', desc: 'Cerveza tirada, amargor intenso y frutal.', price: '$3.500' },
    { id: '07', name: 'Limonada Ginger', desc: 'Jengibre, menta y almíbar orgánico.', price: '$2.800' }
  ]
};

export default function SaborUrbano({ 
  siteName, 
  primaryColor, 
  heroTitle, 
  heroSubtitle, 
  aboutText 
}: TemplateProps) {
  const [activeCategory, setActiveCategory] = useState('burgers');

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
          backdrop-filter: blur(24px);
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

        .hero-title {
          font-size: clamp(3.5rem, 11vw, 10rem);
          line-height: 0.85;
          letter-spacing: -0.05em;
        }

        .category-tab {
          transition: all 0.3s ease;
          position: relative;
        }

        .category-tab.active {
          color: white;
        }

        .category-tab.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--primary);
          animation: slideIn 0.3s ease forwards;
        }

        @keyframes slideIn {
          from { width: 0; left: 50%; }
          to { width: 100%; left: 0; }
        }

        .menu-item-appear {
          animation: revealUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .placeholder-pattern {
          background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 h-20 md:h-24 md:px-12 flex justify-between items-center bg-[#050505]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-black text-black text-xl shadow-lg" style={{ backgroundColor: primaryColor }}>
            {siteName.charAt(0).toUpperCase()}
          </div>
          <span className="text-lg md:text-xl font-black tracking-tighter uppercase italic text-white hidden sm:block">
            {siteName}
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.3em]">
          <a href="#menu" className="text-gray-400 hover:text-white transition-colors">La Carta</a>
          <a href="#about" className="text-gray-400 hover:text-white transition-colors">Historia</a>
          <a href="#location" className="text-gray-400 hover:text-white transition-colors">Visitanos</a>
        </div>

        <button className="btn-primary px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white border-none cursor-pointer">
          RESERVAR
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 pt-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear hover:scale-110"
          style={{ 
            backgroundImage: "url('/templates/restaurant_hero.png')",
            filter: 'brightness(0.3) contrast(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />

        <div className="relative z-10 max-w-7xl reveal">
          <div 
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full text-[9px] font-black tracking-[0.4em] mb-10 border uppercase backdrop-blur-md"
            style={{ borderColor: `${primaryColor}40`, color: primaryColor, background: `${primaryColor}05` }}
          >
            Urban Excellence
          </div>
          <h2 className="hero-title font-black mb-10 uppercase italic text-white">
            {heroTitle || "Sabor que <br/> conecta"}
          </h2>
          <p className="text-lg md:text-2xl text-gray-400 mb-14 font-medium leading-relaxed max-w-3xl mx-auto opacity-90">
            {heroSubtitle || "Artesanía en cada mordida. Usamos los mejores ingredientes para crear la hamburguesa definitiva."}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="#menu"
              className="btn-primary px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] text-black"
            >
              Explorar Menú
            </a>
            <a 
              href="#about"
              className="px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all border border-white/10 hover:bg-white hover:text-black"
            >
              Nuestra Mística
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Menu Section */}
      <section id="menu" className="py-32 md:py-48 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
          <div className="max-w-2xl reveal">
            <h3 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] mb-8">La Carta</h3>
            <p className="text-xl text-gray-400 font-medium leading-relaxed">Seleccioná una categoría y descubrí nuestra propuesta.</p>
          </div>
          
          <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {MENU_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`category-tab whitespace-nowrap text-[11px] font-black uppercase tracking-[0.3em] pb-2 ${activeCategory === cat.id ? 'active' : 'text-gray-600'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {(MENU_ITEMS as any)[activeCategory].map((item: any, idx: number) => (
            <div key={`${activeCategory}-${item.id}`} className="group glass p-8 rounded-[2.5rem] transition-all hover:bg-white/[0.05] menu-item-appear" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="aspect-[4/5] rounded-[2rem] bg-[#0c0c0c] mb-8 overflow-hidden relative placeholder-pattern flex items-center justify-center">
                 <div className="text-gray-800 text-7xl font-black italic opacity-10 group-hover:opacity-20 transition-opacity">
                   {item.id}
                 </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                   <h4 className="text-2xl font-black uppercase italic leading-none">{item.name}</h4>
                   <span className="font-mono text-sm font-black" style={{ color: primaryColor }}>{item.price}</span>
                </div>
                <p className="text-gray-500 text-xs font-medium leading-relaxed">{item.desc}</p>
                <div className="w-full h-px bg-white/5 my-2" />
                <button className="w-full py-4 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95">
                  PEDIR
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 md:py-48 px-6 bg-[#080808]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-24 items-center">
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
               <img src="/templates/restaurant_hero.png" alt="Story" className="w-full h-full object-cover grayscale brightness-50 transition-all duration-1000 hover:grayscale-0 hover:brightness-100" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-44 h-44 glass rounded-full flex flex-col items-center justify-center text-center p-8 z-10">
              <div className="text-4xl font-black italic mb-1" style={{ color: primaryColor }}>100</div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Quality</span>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-10">
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
              Fuego <br/> & <span style={{ color: primaryColor }}>Espíritu</span>
            </h3>
            <p className="text-xl text-gray-400 leading-relaxed font-medium">
              {aboutText || "Nuestra mística nace de la paciencia. Seleccionamos cada corte, horneamos nuestro propio pan y creamos salsas que no existen en ningún otro lugar."}
            </p>
            <div className="flex gap-16 pt-12 border-t border-white/5">
              <div>
                <span className="block text-5xl font-black mb-3 font-mono">12+</span>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-600">Variedades</span>
              </div>
              <div>
                <span className="block text-5xl font-black mb-3 font-mono">24/7</span>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-600">Dedicación</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="location" className="py-32 md:py-48 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
          <div className="p-12 md:p-16 rounded-[3rem] glass flex flex-col gap-12">
            <h3 className="text-4xl font-black uppercase italic tracking-tighter">Horarios</h3>
            <div className="flex flex-col gap-8">
              {[
                { d: 'Lun a Jue', h: '19:00 — 00:00' },
                { d: 'Vie y Sáb', h: '19:00 — 02:00' },
                { d: 'Domingos', h: '19:30 — 23:30' }
              ].map(item => (
                <div key={item.d} className="flex justify-between items-center group">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] group-hover:text-white transition-colors">{item.d}</span>
                  <span className="font-mono text-lg font-black">{item.h}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-12 md:p-16 rounded-[3rem] glass flex flex-col justify-between gap-12">
            <div className="flex flex-col gap-8">
              <h3 className="text-4xl font-black uppercase italic tracking-tighter">Visitanos</h3>
              <div className="flex flex-col gap-2">
                <p className="text-3xl font-black italic">Av. Siempreviva 742</p>
                <p className="text-sm text-gray-500 font-bold tracking-[0.2em] uppercase">Buenos Aires, Argentina</p>
              </div>
            </div>
            <button className="btn-primary w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] text-black border-none">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5 text-center bg-[#050505]">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-16">
          <div className="flex flex-col items-center gap-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-black text-2xl italic shadow-xl" style={{ backgroundColor: primaryColor }}>
              {siteName.charAt(0).toUpperCase()}
            </div>
            <h4 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">{siteName}</h4>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
          </div>
          
          <div className="w-full pt-16 border-t border-white/5 flex flex-col items-center gap-6">
            <p className="font-mono text-[9px] font-black text-gray-800 tracking-[0.5em] uppercase italic">
              Powered by SitioListo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
