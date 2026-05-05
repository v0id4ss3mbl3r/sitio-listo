import React from 'react';

interface TemplateProps {
  siteName: string;
  primaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
}

export default function PortfolioMinimal({ 
  siteName, 
  primaryColor, 
  heroTitle, 
  heroSubtitle, 
  aboutText 
}: TemplateProps) {
  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111111] font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-black/5">
        <span className="text-xl font-black tracking-tighter uppercase italic">{siteName}</span>
        <nav className="hidden sm:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          <a href="#work" className="hover:text-black transition-colors">Portfolio</a>
          <a href="#about" className="hover:text-black transition-colors">About</a>
          <a href="#contact" className="hover:text-black transition-colors">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-48 md:pt-64 pb-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <div 
            className="inline-block px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] mb-10 border border-black/5 uppercase"
            style={{ color: primaryColor, backgroundColor: `${primaryColor}10` }}
          >
            Digital Studio
          </div>
          <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter mb-12 break-words">
            {heroTitle || siteName}
          </h2>
          <p className="text-xl md:text-3xl font-medium leading-tight max-w-2xl text-gray-400">
            {heroSubtitle || "Diseño y estrategia para marcas que buscan destacar en la era digital."}
          </p>
        </div>
      </section>

      {/* Work Grid */}
      <section id="work" className="px-6 md:px-12 py-32 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-6">
            <h3 className="text-4xl md:text-7xl font-black tracking-tight italic uppercase">Featured Works</h3>
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] opacity-30">Selection 2024</span>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-12 lg:gap-20">
            {[
              { id: '01', title: 'Brand Identity', category: 'Creative Direction' },
              { id: '02', title: 'E-commerce', category: 'Web Development' },
              { id: '03', title: 'App Concept', category: 'Product Design' },
              { id: '04', title: 'Marketing', category: 'Social Strategy' }
            ].map((item) => (
              <div key={item.id} className="group">
                <div className="aspect-[16/10] relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 mb-10">
                   <div className="w-full h-full flex items-center justify-center text-gray-800 text-6xl font-black italic">
                     {item.id}
                   </div>
                   <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">{item.category}</span>
                    <h4 className="text-3xl font-bold tracking-tight">{item.title}</h4>
                  </div>
                  <div className="h-px w-12 mt-4 bg-white/20 group-hover:bg-white transition-colors" style={{ height: '2px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-48 px-6 border-b border-black/5">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="mb-14 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-black text-white shadow-2xl">
             <span className="text-2xl font-black italic">S</span>
          </div>
          <p className="text-3xl md:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tighter mb-20">
            {aboutText || "Soy un diseñador independiente ayudando a marcas visionarias a transformar sus ideas en productos digitales icónicos."}
          </p>
          <button 
            className="px-16 py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-105 active:scale-95 shadow-2xl text-white"
            style={{ backgroundColor: primaryColor }}
          >
            Hablemos hoy
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-24 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-12 bg-white">
        <span className="text-2xl font-black tracking-tighter uppercase italic">{siteName}</span>
        <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
          <a href="#" className="hover:text-black transition-colors">Twitter</a>
          <a href="#" className="hover:text-black transition-colors">Instagram</a>
          <a href="#" className="hover:text-black transition-colors">LinkedIn</a>
        </div>
        <p className="text-[9px] font-bold text-gray-300 tracking-[0.3em] uppercase">© {new Date().getFullYear()} {siteName} / SitioListo</p>
      </footer>
    </div>
  );
}
