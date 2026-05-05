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
    <div className="min-h-screen bg-[#080808] text-[#f5f5f5] selection:bg-white selection:text-black font-serif">
      {/* Dynamic Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-8 flex justify-between items-center bg-transparent">
        <h1 className="text-3xl font-black tracking-tighter mix-blend-difference" style={{ color: primaryColor }}>
          {siteName.toUpperCase()}
        </h1>
        <div className="hidden lg:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md bg-white/5 px-10 py-4 rounded-full border border-white/10">
          <a href="#menu" className="hover:opacity-50 transition-opacity">Menu</a>
          <a href="#about" className="hover:opacity-50 transition-opacity">Legacy</a>
          <a href="#contact" className="hover:opacity-50 transition-opacity">Location</a>
        </div>
        <button 
          className="px-10 py-4 rounded-full text-[10px] font-black transition-all hover:scale-105 active:scale-95 shadow-2xl uppercase tracking-widest text-white"
          style={{ backgroundColor: primaryColor }}
        >
          Book a Table
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-110 animate-slow-zoom"
          style={{ 
            backgroundImage: "url('/templates/restaurant_hero.png')",
            filter: 'brightness(0.3) contrast(1.2)'
          }}
        />
        <div className="relative z-10 max-w-6xl">
          <div className="flex justify-center mb-10 overflow-hidden">
             <div className="h-px w-12 bg-white/30 self-center" />
             <span className="px-6 text-[10px] font-black tracking-[0.5em] uppercase opacity-70">Exquisite Dining</span>
             <div className="h-px w-12 bg-white/30 self-center" />
          </div>
          <h2 className="text-7xl md:text-9xl lg:text-[11rem] font-black mb-12 tracking-tighter leading-[0.8] italic">
            {heroTitle || "The Art of Taste"}
          </h2>
          <p className="text-xl md:text-3xl text-gray-300 mb-16 font-light leading-tight max-w-3xl mx-auto opacity-80 serif italic">
            {heroSubtitle || "A culinary journey where tradition meets avant-garde techniques."}
          </p>
          <a 
            href="#menu"
            className="group relative inline-flex items-center gap-4 px-12 py-5 border border-white/20 rounded-full transition-all hover:border-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-black transition-colors">Discover the Menu</span>
          </a>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20 flex flex-col items-center gap-4">
           <span className="text-[8px] font-black uppercase tracking-[0.5em]">Scroll</span>
           <div className="h-12 w-px bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-40 md:py-60 px-8 relative overflow-hidden bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 lg:gap-40 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-10 border border-white/5 rounded-[40px] pointer-events-none" />
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
               <img src="/templates/restaurant_hero.png" alt="Legacy" className="w-full h-full object-cover brightness-75 hover:brightness-100 transition-all duration-[2s]" />
            </div>
            <div 
              className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full border border-white/10 backdrop-blur-xl flex items-center justify-center text-[10px] font-black tracking-[0.3em] text-center p-8 uppercase italic leading-loose"
              style={{ color: primaryColor }}
            >
              Est. Since 2010
            </div>
          </div>
          <div className="flex flex-col gap-12 order-1 lg:order-2">
            <div className="space-y-4">
               <span className="text-[10px] font-black tracking-[0.4em] uppercase" style={{ color: primaryColor }}>Our Heritage</span>
               <h3 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic">A Century of Passion</h3>
            </div>
            <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light italic">
              {aboutText || "From humble beginnings to a gastronomic landmark, our kitchen has always been a sanctuary for those who seek the extraordinary."}
            </p>
            <div className="grid grid-cols-2 gap-16 py-16 border-y border-white/5">
              <div>
                <span className="block text-5xl font-black mb-3 italic">150+</span>
                <span className="text-[9px] uppercase tracking-widest font-black text-gray-500">Unique Recipes</span>
              </div>
              <div>
                <span className="block text-5xl font-black mb-3 italic">3★</span>
                <span className="text-[9px] uppercase tracking-widest font-black text-gray-500">Global Accolades</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Experience */}
      <section className="py-40 px-8 text-center bg-white text-black relative">
        <div className="absolute top-0 left-0 w-full h-px bg-black/5" />
        <span className="text-[10px] font-black tracking-[0.6em] uppercase mb-12 block opacity-40 italic">Reservations</span>
        <h3 className="text-6xl md:text-9xl font-black mb-16 tracking-tighter italic leading-none uppercase">Join our table</h3>
        <button 
          className="group relative px-20 py-8 overflow-hidden rounded-full transition-all hover:scale-105"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="absolute inset-0 bg-black translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          <span className="relative z-10 text-white text-[10px] font-black uppercase tracking-[0.4em]">Inquire for a Table</span>
        </button>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-32 bg-[#080808] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
           <h4 className="text-4xl font-black mb-12 tracking-tighter uppercase italic" style={{ color: primaryColor }}>{siteName}</h4>
           <div className="flex gap-16 text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-20">
             <a href="#" className="hover:text-white transition-colors">Instagram</a>
             <a href="#" className="hover:text-white transition-colors">Facebook</a>
             <a href="#" className="hover:text-white transition-colors">Contact</a>
           </div>
           <div className="w-full flex justify-between items-center opacity-30">
              <span className="text-[8px] font-black tracking-[0.5em] uppercase">© {new Date().getFullYear()}</span>
              <span className="text-[8px] font-black tracking-[0.5em] uppercase">SitioListo Premium Experience</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
