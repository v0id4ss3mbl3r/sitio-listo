"use client";
import React, { useState } from 'react';

export type CategoryId = 'burgers' | 'sides' | 'drinks';

export interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: string;
}

export interface MenuCategory {
  id: CategoryId;
  label: string;
}

interface TemplateProps {
  siteName?: string;
  primaryColor?: string;
  heroTitle?: React.ReactNode;
  heroSubtitle?: string;
  aboutText?: string;
  categories?: MenuCategory[];
  menuItems?: Record<CategoryId, MenuItem[]>;
}

const DEFAULT_CATEGORIES: MenuCategory[] = [
  { id: 'burgers', label: 'Hamburguesas' },
  { id: 'sides', label: 'Acompañamientos' },
  { id: 'drinks', label: 'Bebidas' }
];

const DEFAULT_MENU: Record<CategoryId, MenuItem[]> = {
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
  siteName = "Sabor Urbano",
  primaryColor = "#ff4500",
  heroTitle = <>Sabor que <br /> conecta</>,
  heroSubtitle = "Artesanía en cada mordida. Usamos los mejores ingredientes para crear la hamburguesa definitiva.",
  aboutText = "Nuestra mística nace de la paciencia. Seleccionamos cada corte, horneamos nuestro propio pan y creamos salsas que no existen en ningún otro lugar.",
  categories = DEFAULT_CATEGORIES,
  menuItems = DEFAULT_MENU
}: TemplateProps) {

  const [activeCategory, setActiveCategory] = useState<CategoryId>(categories[0].id);

  return (
    <div
      className="min-h-screen bg-[#050505] text-[#f0f0f0] font-sans selection:bg-white selection:text-black scroll-smooth overflow-x-hidden"
      style={{ '--primary': primaryColor } as React.CSSProperties}
    >
      <nav className="fixed top-0 w-full z-50 px-6 h-20 md:h-24 md:px-12 flex justify-between items-center bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-black text-black text-xl shadow-lg bg-[var(--primary)]">
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

        <button className="bg-[var(--primary)] hover:brightness-110 active:scale-95 transition-all px-6 md:px-8 py-3 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest text-black border-none cursor-pointer">
          RESERVAR
        </button>
      </nav>

      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]" />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center mt-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full text-[9px] font-black tracking-[0.4em] mb-8 border uppercase backdrop-blur-md text-[var(--primary)] border-[var(--primary)] bg-[var(--primary)]/10">
            Urban Excellence
          </div>
          <h2 className="text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-tighter font-black mb-8 uppercase italic text-white">
            {heroTitle}
          </h2>
          <p className="text-base md:text-xl text-gray-400 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full sm:w-auto">
            <a href="#menu" className="w-full sm:w-auto bg-[var(--primary)] hover:brightness-110 transition-all px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] text-black text-center">
              Explorar Menú
            </a>
            <a href="#about" className="w-full sm:w-auto px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all border border-white/10 hover:bg-white hover:text-black text-center">
              Nuestra Mística
            </a>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24 md:py-40 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.8] mb-6">La Carta</h3>
            <p className="text-lg md:text-xl text-gray-400 font-medium">Seleccioná una categoría y descubrí nuestra propuesta.</p>
          </div>

          <div className="flex gap-4 md:gap-8 overflow-x-auto w-full justify-start md:justify-center pb-4 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] transition-all border-b-2 ${activeCategory === cat.id ? 'border-[var(--primary)] text-white' : 'border-transparent text-gray-600 hover:text-gray-400'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {menuItems[activeCategory]?.map((item) => (
            <div key={`${activeCategory}-${item.id}`} className="flex flex-col p-8 rounded-[2rem] transition-all hover:bg-white/[0.05] border border-white/5 bg-white/[0.02]">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl md:text-2xl font-black uppercase italic leading-tight pr-4">{item.name}</h4>
                <span className="text-sm md:text-base font-black text-[var(--primary)] whitespace-nowrap">{item.price}</span>
              </div>
              <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed mb-6 flex-grow">{item.desc}</p>
              <div className="w-full h-px bg-white/5 mb-6" />
              <button className="w-full py-4 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95">
                PEDIR
              </button>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="py-24 md:py-40 px-6 bg-[#080808]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 md:gap-24 items-center">
          <div className="w-full lg:w-1/2 relative flex justify-center">
            <div className="aspect-[4/5] w-full max-w-md rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl bg-zinc-900 flex items-center justify-center">
              <span className="text-zinc-800 text-6xl font-black italic opacity-20">IMAGEN</span>
            </div>
            <div className="absolute -bottom-6 -right-2 md:-right-6 w-32 h-32 md:w-40 md:h-40 bg-[#050505] border border-white/10 rounded-full flex flex-col items-center justify-center text-center p-4 z-10 shadow-xl">
              <div className="text-3xl md:text-4xl font-black italic text-[var(--primary)] mb-1">100%</div>
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-white">Calidad</span>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-8 md:gap-10 text-center lg:text-left">
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.9]">
              Fuego <br /> & <span className="text-[var(--primary)]">Espíritu</span>
            </h3>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-medium">
              {aboutText}
            </p>
            <div className="flex justify-center lg:justify-start gap-12 md:gap-16 pt-8 border-t border-white/5">
              <div>
                <span className="block text-4xl md:text-5xl font-black mb-2">12+</span>
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-gray-600">Variedades</span>
              </div>
              <div>
                <span className="block text-4xl md:text-5xl font-black mb-2">24/7</span>
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-gray-600">Dedicación</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="location" className="py-24 md:py-40 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-10">
          <div className="p-8 md:p-16 rounded-[2rem] border border-white/5 bg-white/[0.02] flex flex-col gap-10">
            <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-center sm:text-left">Horarios</h3>
            <div className="flex flex-col gap-6">
              {[
                { d: 'Lun a Jue', h: '19:00 — 00:00' },
                { d: 'Vie y Sáb', h: '19:00 — 02:00' },
                { d: 'Domingos', h: '19:30 — 23:30' }
              ].map(item => (
                <div key={item.d} className="flex flex-col sm:flex-row justify-between items-center sm:items-baseline border-b border-white/5 pb-4">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-2 sm:mb-0">{item.d}</span>
                  <span className="text-base md:text-lg font-black">{item.h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 md:p-16 rounded-[2rem] border border-white/5 bg-white/[0.02] flex flex-col justify-between gap-10 text-center sm:text-left">
            <div className="flex flex-col gap-8">
              <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">Visitanos</h3>
              <div className="flex flex-col gap-2">
                <p className="text-2xl md:text-3xl font-black italic">Av. Siempreviva 742</p>
                <p className="text-xs md:text-sm text-gray-500 font-bold tracking-[0.2em] uppercase">Buenos Aires, Argentina</p>
              </div>
            </div>
            <button className="bg-[var(--primary)] hover:brightness-110 w-full py-5 md:py-6 rounded-xl font-black text-xs uppercase tracking-[0.3em] text-black border-none transition-all">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      <footer className="py-16 md:py-24 px-6 border-t border-white/5 text-center bg-[#050505]">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-12 md:gap-16">
          <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-black text-black text-xl md:text-2xl italic shadow-xl bg-[var(--primary)]">
              {siteName.charAt(0).toUpperCase()}
            </div>
            <h4 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">{siteName}</h4>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
}