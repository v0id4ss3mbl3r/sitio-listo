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
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black font-sans scroll-smooth">
      {/* Background Accent */}
      <div 
        className="fixed top-0 right-0 w-[600px] h-[600px] blur-[150px] opacity-10 rounded-full pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center backdrop-blur-md bg-black/40 border-b border-white/5">
        <span className="text-xl font-black tracking-tighter uppercase italic">{siteName}</span>
        <nav className="hidden sm:flex gap-10 text-[10px] font-bold uppercase tracking-[0.4em]">
          <a href="#work" className="hover:opacity-40 transition-opacity">Portfolio</a>
          <a href="#about" className="hover:opacity-40 transition-opacity">Bio</a>
          <a href="#contact" className="hover:opacity-40 transition-opacity">Contact</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative pt-48 md:pt-64 pb-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-8">
            <div 
              className="inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-[0.3em] mb-8 border border-white/10 uppercase"
              style={{ color: primaryColor, backgroundColor: `${primaryColor}10` }}
            >
              Creative Studio
            </div>
            <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter mb-12 break-words">
              {heroTitle || siteName}
            </h2>
            <p className="text-xl md:text-3xl font-medium leading-tight max-w-2xl text-gray-400">
              {heroSubtitle || "Crafting digital experiences that bridge the gap between design and human emotion."}
            </p>
          </div>
          <div className="lg:col-span-4 aspect-[4/5] relative group">
            <div 
              className="absolute -inset-4 blur-2xl opacity-20 transition-opacity group-hover:opacity-40"
              style={{ backgroundColor: primaryColor }}
            />
            <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <img 
                src="/templates/portfolio_hero.png" 
                alt="Profile" 
                className="w-full h-full object-cover grayscale brightness-75 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Work Grid */}
      <section id="work" className="px-6 md:px-12 py-40 border-y border-white/5 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-6">
            <div>
              <h3 className="text-5xl md:text-7xl font-black tracking-tight mb-4">Selected Works</h3>
              <div className="h-1 w-24" style={{ backgroundColor: primaryColor }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-30">CURATED PROJECTS / 2024</span>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-12 lg:gap-20">
            {[
              { id: '01', title: 'Aether Digital', category: 'Product Strategy' },
              { id: '02', title: 'Lumina Branding', category: 'Visual Identity' },
              { id: '03', title: 'Nexus Experience', category: 'UX/UI Design' },
              { id: '04', title: 'Vortex Motion', category: '3D Art' }
            ].map((item) => (
              <div key={item.id} className="group cursor-none">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-white/5 border border-white/5 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="px-8 py-3 rounded-full bg-white text-black text-xs font-black tracking-widest uppercase">View Project</span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">{item.category}</span>
                    <h4 className="text-3xl font-bold tracking-tight group-hover:italic transition-all">{item.title}</h4>
                  </div>
                  <span className="text-lg font-light opacity-20">/{item.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-48 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute -top-20 -left-20 text-[20rem] font-black opacity-[0.02] select-none pointer-events-none uppercase">
            Story
          </div>
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="mb-12 inline-flex items-center justify-center w-20 h-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <p className="text-3xl md:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tighter mb-20 max-w-4xl">
              {aboutText || "Independent designer helping visionary companies transform ideas into iconic digital products."}
            </p>
            <a 
              href="mailto:hello@example.com"
              className="group relative px-16 py-6 overflow-hidden rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all"
            >
              <div 
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-110" 
                style={{ backgroundColor: primaryColor }}
              />
              <span className="relative z-10">Let's collaborate</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start">
             <h4 className="text-3xl font-black tracking-tighter mb-4 italic" style={{ color: primaryColor }}>{siteName}</h4>
             <p className="text-gray-500 text-[10px] tracking-[0.4em] uppercase">Based in the Digital World / 2024</p>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em]">
            <a href="#" className="hover:text-white text-gray-500 transition-colors">X</a>
            <a href="#" className="hover:text-white text-gray-500 transition-colors">IG</a>
            <a href="#" className="hover:text-white text-gray-500 transition-colors">LI</a>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-bold text-gray-700 tracking-[0.5em] uppercase">Powered by SitioListo</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
