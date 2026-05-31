'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  ShoppingCart,
  Trash2,
  X,
  CheckCircle2,
  ChevronDown,
  Truck,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Product = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  image_urls: string[];
  in_stock: boolean;
  is_featured: boolean;
};

type StoreSettings = {
  theme_color: string;
  whatsapp_numbers: Array<{ id: string; label: string; phone: string }>;
  banner_title: string | null;
  banner_subtitle: string | null;
  banner_image_url: string | null;
  store_description: string | null;
};

export type TiendaCatalogoProps = {
  siteName: string;
  logoUrl?: string;
  primaryColor: string;
  planType: string;
  products: Product[];
  categories: Category[];
  settings: StoreSettings | null;
};

type CartItem = Product & { quantity: number };

const PRODUCT_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
];

function buildWhatsappMessage(opts: {
  customerName: string;
  customerPhone: string;
  notes: string;
  items: CartItem[];
  total: number;
}) {
  const lines: string[] = [];
  lines.push('*NUEVO PEDIDO* 🛒');
  lines.push('');
  lines.push(`*Cliente:* ${opts.customerName}`);
  lines.push(`*Teléfono:* ${opts.customerPhone}`);
  if (opts.notes) lines.push(`*Observaciones:* ${opts.notes}`);
  lines.push('');
  lines.push('*Detalle:*');
  opts.items.forEach((item, i) => {
    lines.push(
      `${i + 1}. ${item.name} x ${item.quantity} — $${(item.price * item.quantity).toLocaleString('es-AR')}`
    );
  });
  lines.push('');
  lines.push(`*TOTAL: $${opts.total.toLocaleString('es-AR')}*`);
  return lines.join('\n');
}

export default function TiendaCatalogo({
  siteName,
  logoUrl,
  primaryColor,
  planType,
  products,
  categories,
  settings,
}: TiendaCatalogoProps) {
  const themeColor = settings?.theme_color || primaryColor || '#171717';
  const whatsappNumbers =
    settings?.whatsapp_numbers && settings.whatsapp_numbers.length > 0
      ? settings.whatsapp_numbers
      : [{ id: 'default', label: 'Ventas', phone: '' }];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'success'>('cart');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    notes: '',
    selectedSeller: whatsappNumbers[0].phone,
  });

  const cartKey = `sitiolisto_cart_${siteName.toLowerCase().replace(/\s+/g, '_')}`;

  useEffect(() => {
    // Carga del carrito persistido al mount. setState dentro de useEffect es
    // el patrón estándar para hidratar state desde localStorage.
    const saved = typeof window !== 'undefined' ? localStorage.getItem(cartKey) : null;
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCart(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, [cartKey]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, cartKey]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: prev[product.id]
        ? { ...prev[product.id], quantity: prev[product.id].quantity + 1 }
        : { ...product, quantity: 1 },
    }));
    showToast(`¡${product.name} agregado!`);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setCart((prev) => {
      const newQuantity = (prev[id].quantity || 1) + change;
      if (newQuantity <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { ...prev[id], quantity: newQuantity } };
    });
  };

  const cartItemsCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const message = buildWhatsappMessage({
      customerName: customerData.name,
      customerPhone: customerData.phone,
      notes: customerData.notes,
      items: Object.values(cart),
      total: cartTotal,
    });
    const seller = customerData.selectedSeller || whatsappNumbers[0]?.phone || '';
    if (!seller) {
      alert('No hay un número de WhatsApp configurado para recibir el pedido.');
      return;
    }
    const url = `https://wa.me/${seller}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setCart({});
    setCheckoutStep('success');
  };

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      const matchesSearch =
        searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === null || p.category_id === activeCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price_asc') return filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') return filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, searchQuery, activeCategory, sortBy]);

  const showBranding = planType !== 'pro' && planType !== 'extremo' && planType !== 'personalizado';
  const bannerTitle = settings?.banner_title || 'La mejor selección en un solo lugar.';
  const bannerSubtitle =
    settings?.banner_subtitle ||
    'Explorá nuestro catálogo con las últimas novedades y ofertas exclusivas pensadas para vos.';
  const storeDescription =
    settings?.store_description ||
    'Seleccioná lo que buscás y completá tu pedido directamente de forma segura.';

  return (
    <main
      className="min-h-screen bg-neutral-50 font-sans text-neutral-900 flex flex-col"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes tc-fade-in {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          .tc-fade    { animation: tc-fade-in 0.55s ease-out both; }
          .tc-fade-d1 { animation-delay: 0.1s; }
          .tc-fade-d2 { animation-delay: 0.22s; }
          .tc-fade-d3 { animation-delay: 0.34s; }

          .tc-product-card {
            transition: transform 0.3s cubic-bezier(0.4,0,0.2,1),
                        box-shadow 0.3s cubic-bezier(0.4,0,0.2,1);
          }
          .tc-product-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 40px -10px ${themeColor}38;
          }
          .tc-product-card:hover .tc-product-overlay { opacity: 1; }

          .tc-product-overlay {
            position: absolute; inset: 0;
            background: rgba(0,0,0,0.18);
            display: flex; align-items: center; justify-content: center;
            opacity: 0;
            transition: opacity 0.25s ease;
            border-radius: inherit;
          }

          /* hide scrollbar on category nav */
          .tc-cat-nav::-webkit-scrollbar { display: none; }
          .tc-cat-nav { -ms-overflow-style: none; scrollbar-width: none; }

          .tc-btn-add {
            transition: filter 0.2s ease, transform 0.15s ease;
          }
          .tc-btn-add:hover:not(:disabled) {
            filter: brightness(1.1);
            transform: translateY(-1px);
          }
          .tc-btn-add:active:not(:disabled) { transform: scale(0.97); }
        `,
        }}
      />

      {/* TOAST */}
      {toastMessage && (
        <div
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 text-white px-6 py-3 rounded-full shadow-xl font-bold text-sm whitespace-nowrap"
          style={{ backgroundColor: themeColor }}
        >
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <header
        className="sticky top-0 z-40 border-b border-neutral-100 shadow-sm"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer flex-shrink-0"
            onClick={() => {
              setActiveCategory(null);
              setSearchQuery('');
              setMobileSearchOpen(false);
            }}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={siteName} className="h-9 sm:h-11 w-auto object-contain" />
            ) : (
              <>
                <div
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                  style={{ backgroundColor: themeColor }}
                >
                  {siteName.charAt(0).toUpperCase()}
                </div>
                <span className="font-black text-lg sm:text-xl tracking-tight text-neutral-900 hidden sm:block">
                  {siteName}
                </span>
              </>
            )}
          </div>

          {/* Search — desktop */}
          <div className="relative w-full max-w-sm hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-neutral-200 transition-all"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="sm:hidden p-2 rounded-xl hover:bg-neutral-100 text-neutral-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart */}
            <button
              onClick={() => {
                setIsCartOpen(true);
                setCheckoutStep('cart');
              }}
              className="relative flex items-center gap-2 px-3 py-2 sm:px-4 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-700" />
              <span className="font-bold text-sm hidden lg:block text-neutral-700">Mi Carrito</span>
              {cartItemsCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full shadow-md"
                  style={{ backgroundColor: themeColor }}
                >
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="sm:hidden px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-neutral-200 transition-all"
              />
            </div>
          </div>
        )}

        {/* Category nav — pill buttons */}
        {categories.length > 0 && (
          <nav className="border-t border-neutral-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <ul className="tc-cat-nav flex items-center gap-1 overflow-x-auto h-12">
                <li>
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="whitespace-nowrap text-xs font-bold px-4 py-1.5 rounded-full transition-all"
                    style={
                      activeCategory === null
                        ? { backgroundColor: themeColor, color: '#fff' }
                        : { color: '#6b7280' }
                    }
                  >
                    Todo
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setActiveCategory(cat.id)}
                      className="whitespace-nowrap text-xs font-bold px-4 py-1.5 rounded-full transition-all"
                      style={
                        activeCategory === cat.id
                          ? { backgroundColor: themeColor, color: '#fff' }
                          : { color: '#6b7280' }
                      }
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}
      </header>

      <div className="flex-grow">
        {/* BANNER + BENEFITS — only on the unconstrained home view */}
        {!searchQuery && activeCategory === null && (
          <>
            {/* HERO BANNER */}
            <section className="relative overflow-hidden" style={{ background: '#0f172a' }}>
              {/* Decorative blobs */}
              <div
                className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)`,
                }}
              />
              <div
                className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)`,
                }}
              />

              {settings?.banner_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.banner_image_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                />
              )}

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-24 flex flex-col sm:flex-row items-center justify-between gap-10 z-10">
                <div className="max-w-2xl text-center sm:text-left">
                  {/* Live badge */}
                  <div
                    className="tc-fade inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-6"
                    style={{
                      background: `${themeColor}22`,
                      color: themeColor,
                      border: `1px solid ${themeColor}40`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: themeColor }}
                    />
                    Catálogo Oficial
                  </div>

                  <h2
                    className="tc-fade tc-fade-d1 text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight"
                    style={{ fontStyle: 'italic' }}
                  >
                    {bannerTitle}
                  </h2>
                  <p className="tc-fade tc-fade-d2 text-base sm:text-lg text-neutral-400 mb-8 font-medium">
                    {bannerSubtitle}
                  </p>
                  <a
                    href="#catalog"
                    className="tc-fade tc-fade-d3 tc-btn-add inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white px-6 py-3 rounded-xl"
                    style={{ backgroundColor: themeColor }}
                  >
                    Ver catálogo
                    <ChevronDown className="h-4 w-4" />
                  </a>
                </div>

                {/* Right decoration */}
                <div className="hidden sm:flex items-center justify-center relative w-60 h-60 flex-shrink-0">
                  <div
                    className="absolute w-48 h-48 rounded-full blur-3xl opacity-40"
                    style={{ backgroundColor: themeColor }}
                  />
                  <div className="relative z-10 w-36 h-36 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center">
                    <ShoppingCart className="w-14 h-14 text-white opacity-80" />
                  </div>
                </div>
              </div>
            </section>

            {/* BENEFITS STRIP */}
            <section
              style={{
                background: '#0f172a',
                borderTop: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
                  {[
                    {
                      icon: <Truck className="w-5 h-5" style={{ color: themeColor }} />,
                      title: 'Envíos a todo el país',
                      desc: 'Llegamos directo a tu puerta.',
                    },
                    {
                      icon: <CreditCard className="w-5 h-5" style={{ color: themeColor }} />,
                      title: 'Múltiples medios de pago',
                      desc: 'Efectivo, transferencia y tarjetas.',
                    },
                    {
                      icon: <ShieldCheck className="w-5 h-5" style={{ color: themeColor }} />,
                      title: 'Compra 100% Segura',
                      desc: 'Protegemos todos tus datos.',
                    },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-4 py-5 px-4 sm:px-6">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${themeColor}20` }}
                      >
                        {b.icon}
                      </div>
                      <div>
                        <p className="text-white text-[11px] font-black uppercase tracking-wide">
                          {b.title}
                        </p>
                        <p className="text-neutral-500 text-[11px] font-medium mt-0.5">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* CATALOG HEADER */}
        <div
          id="catalog"
          className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4"
        >
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-neutral-500 text-[10px] font-black uppercase tracking-[0.15em] mb-2">
              Catálogo
            </div>
            <h2
              className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900"
              style={{ fontStyle: 'italic' }}
            >
              {searchQuery
                ? `Resultados para "${searchQuery}"`
                : activeCategory
                  ? categories.find((c) => c.id === activeCategory)?.name
                  : 'Todos los productos'}
            </h2>
            <p className="text-neutral-400 text-sm mt-1 font-semibold">
              {filteredProducts.length} productos disponibles
            </p>
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'price_asc' | 'price_desc')}
              className="w-full sm:w-auto appearance-none bg-white border border-neutral-200 text-neutral-700 font-bold text-sm py-2.5 pl-4 pr-10 rounded-xl outline-none cursor-pointer hover:border-neutral-300 transition-colors"
            >
              <option value="newest">Más Recientes</option>
              <option value="price_asc">Menor Precio</option>
              <option value="price_desc">Mayor Precio</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-24 text-center">
              <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-5">
                <ShoppingCart className="w-9 h-9 text-neutral-300" />
              </div>
              <h3 className="text-xl font-black text-neutral-800">No hay productos para mostrar.</h3>
              <p className="text-neutral-400 mt-2 font-medium text-sm">
                Intentá con otra búsqueda o categoría.
              </p>
            </div>
          ) : (
            filteredProducts.map((product, idx) => {
              const gradient = PRODUCT_GRADIENTS[idx % PRODUCT_GRADIENTS.length];
              return (
                <div
                  key={product.id}
                  className={`tc-product-card bg-white rounded-2xl border border-neutral-100 overflow-hidden flex flex-col ${!product.in_stock ? 'opacity-70' : 'cursor-pointer'}`}
                  onClick={() => product.in_stock && setSelectedProduct(product)}
                >
                  {/* Image area */}
                  <div className="aspect-square relative overflow-hidden">
                    {!product.in_stock && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-[2px] bg-white/50">
                        <span className="bg-neutral-900 text-white font-black text-[10px] tracking-widest uppercase px-3 py-1 rounded-full shadow">
                          Agotado
                        </span>
                      </div>
                    )}

                    {product.compare_at_price && product.compare_at_price > product.price && (
                      <span
                        className="absolute top-2 left-2 z-10 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm"
                        style={{ backgroundColor: themeColor }}
                      >
                        {Math.round(
                          ((product.compare_at_price - product.price) /
                            product.compare_at_price) *
                            100
                        )}
                        % OFF
                      </span>
                    )}

                    {product.is_featured && (
                      <span className="absolute top-2 right-2 z-10 bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">
                        ★ Dest.
                      </span>
                    )}

                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply p-3 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: gradient }}
                      >
                        <span className="text-4xl sm:text-5xl font-black italic text-white/25 select-none">
                          {product.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    {product.in_stock && (
                      <div className="tc-product-overlay rounded-2xl">
                        <span className="bg-white text-neutral-900 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
                          Ver detalle
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card info */}
                  <div className="p-3 flex flex-col flex-grow bg-neutral-50/60 border-t border-neutral-50">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-800 line-clamp-2 leading-snug min-h-[36px]">
                      {product.name}
                    </h3>

                    <div className="mt-2 mb-3 flex flex-col">
                      <p className="text-base sm:text-lg font-black" style={{ color: themeColor }}>
                        ${product.price.toLocaleString('es-AR')}
                      </p>
                      {product.compare_at_price && product.compare_at_price > product.price ? (
                        <p className="text-[11px] text-neutral-400 line-through font-semibold">
                          ${product.compare_at_price.toLocaleString('es-AR')}
                        </p>
                      ) : (
                        <div className="h-4" />
                      )}
                    </div>

                    <button
                      disabled={!product.in_stock}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className={`tc-btn-add mt-auto w-full text-center text-white text-[11px] sm:text-xs font-black py-2.5 rounded-xl ${!product.in_stock ? 'bg-neutral-200 !text-neutral-400 cursor-not-allowed' : ''}`}
                      style={product.in_stock ? { backgroundColor: themeColor } : {}}
                    >
                      {product.in_stock ? '+ Agregar' : 'Sin Stock'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#0f172a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-10 w-auto object-contain opacity-80"
                />
              ) : (
                <>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                    style={{ backgroundColor: themeColor }}
                  >
                    {siteName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xl font-black text-white tracking-tight">{siteName}</span>
                </>
              )}
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm font-medium">
              {storeDescription}
            </p>
          </div>

          <div>
            <h4 className="font-black text-white mb-4 uppercase text-[11px] tracking-[0.12em]">
              Contacto
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-500 font-medium">
              {whatsappNumbers.map((w) => (
                <li key={w.id} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: themeColor }}
                  />
                  {w.label}: {w.phone || '—'}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-neutral-600 text-xs font-bold">
              © {new Date().getFullYear()} {siteName}. Todos los derechos reservados.
            </p>
            {showBranding && (
              <a
                href="https://sitiolisto.com.ar"
                className="text-xs font-bold hover:opacity-80 transition-opacity"
                style={{ color: themeColor }}
              >
                Creado con SitioListo
              </a>
            )}
          </div>
        </div>
      </footer>

      {/* MODAL DETALLE PRODUCTO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          />

          <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur p-2 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors shadow-md"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image panel */}
            <div className="w-full md:w-1/2 flex items-center justify-center min-h-[260px] sm:min-h-[340px] p-8 bg-neutral-50">
              {selectedProduct.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain mix-blend-multiply max-h-64 sm:max-h-80"
                />
              ) : (
                <div
                  className="w-full h-48 sm:h-64 rounded-2xl flex items-center justify-center"
                  style={{ background: PRODUCT_GRADIENTS[0] }}
                >
                  <span className="text-6xl font-black italic text-white/25 select-none">
                    {selectedProduct.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Details panel */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-auto">
              {selectedProduct.is_featured && (
                <span className="inline-flex self-start items-center gap-1.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3 border border-amber-100">
                  ★ Destacado
                </span>
              )}

              <h2
                className="text-2xl sm:text-3xl font-black text-neutral-900 leading-tight mb-3"
                style={{ fontStyle: 'italic' }}
              >
                {selectedProduct.name}
              </h2>

              <div className="flex items-end gap-3 mb-5">
                <p className="text-3xl sm:text-4xl font-black" style={{ color: themeColor }}>
                  ${selectedProduct.price.toLocaleString('es-AR')}
                </p>
                {selectedProduct.compare_at_price &&
                  selectedProduct.compare_at_price > selectedProduct.price && (
                    <div className="flex flex-col items-start pb-1">
                      <span
                        className="text-[10px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-md mb-1"
                        style={{ backgroundColor: themeColor }}
                      >
                        {Math.round(
                          ((selectedProduct.compare_at_price - selectedProduct.price) /
                            selectedProduct.compare_at_price) *
                            100
                        )}
                        % OFF
                      </span>
                      <p className="text-base text-neutral-400 line-through font-bold">
                        ${selectedProduct.compare_at_price.toLocaleString('es-AR')}
                      </p>
                    </div>
                  )}
              </div>

              <div className="flex-grow">
                <p className="text-neutral-600 whitespace-pre-wrap font-medium leading-relaxed text-sm">
                  {selectedProduct.description || 'Este producto no tiene descripción adicional.'}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-neutral-100">
                {!selectedProduct.in_stock ? (
                  <div className="w-full bg-neutral-100 text-neutral-400 font-black py-4 rounded-xl text-center text-sm">
                    Sin Stock
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                      setIsCartOpen(true);
                    }}
                    className="tc-btn-add w-full text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm"
                    style={{ backgroundColor: themeColor }}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Agregar al Carrito
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      <div
        className={`fixed inset-0 z-[70] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Drawer header */}
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-white">
            <div>
              <h3 className="text-lg font-black text-neutral-900">
                {checkoutStep === 'cart'
                  ? 'Tu Pedido'
                  : checkoutStep === 'form'
                    ? 'Datos del Pedido'
                    : '¡Listo!'}
              </h3>
              {checkoutStep === 'cart' && cartItemsCount > 0 && (
                <p className="text-xs text-neutral-400 font-semibold mt-0.5">
                  {cartItemsCount} {cartItemsCount === 1 ? 'producto' : 'productos'}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-neutral-400 hover:text-neutral-700 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer body */}
          <div className="flex-grow overflow-y-auto bg-neutral-50/30">
            {checkoutStep === 'cart' && (
              <div className="p-5 space-y-3">
                {cartItemsCount === 0 ? (
                  <div className="flex flex-col items-center justify-center pt-20 text-neutral-400 gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center">
                      <ShoppingCart className="h-8 w-8 opacity-40" />
                    </div>
                    <p className="font-bold text-sm">Tu carrito está vacío.</p>
                    <p className="text-xs text-neutral-300 font-medium">
                      ¡Agregá productos para comenzar!
                    </p>
                  </div>
                ) : (
                  Object.values(cart).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 border border-neutral-100 rounded-2xl bg-white shadow-sm"
                    >
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-14 h-14 object-contain rounded-xl bg-neutral-50 p-1 flex-shrink-0"
                        />
                      ) : (
                        <div
                          className="w-14 h-14 rounded-xl flex-shrink-0"
                          style={{ background: PRODUCT_GRADIENTS[0] }}
                        />
                      )}
                      <div className="flex-grow min-w-0">
                        <p className="font-bold text-neutral-800 text-xs leading-tight line-clamp-2">
                          {item.name}
                        </p>
                        <p className="font-black text-sm mt-0.5" style={{ color: themeColor }}>
                          ${(item.price * item.quantity).toLocaleString('es-AR')}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 font-black text-neutral-600 text-sm transition-colors"
                          >
                            −
                          </button>
                          <span className="text-xs font-black w-4 text-center text-neutral-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 font-black text-neutral-600 text-sm transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-300 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {checkoutStep === 'form' && (
              <form id="checkout-form" onSubmit={handleConfirmOrder} className="p-5 space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1.5">
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    className="w-full p-3.5 border border-neutral-200 rounded-xl text-neutral-900 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 text-sm transition-all"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1.5">
                    Tu Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                    className="w-full p-3.5 border border-neutral-200 rounded-xl text-neutral-900 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 text-sm transition-all"
                    placeholder="Ej: 11-2345-6789"
                  />
                </div>
                {whatsappNumbers.length > 1 && (
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1.5">
                      Enviar pedido a:
                    </label>
                    <select
                      value={customerData.selectedSeller}
                      onChange={(e) =>
                        setCustomerData({ ...customerData, selectedSeller: e.target.value })
                      }
                      className="w-full p-3.5 border border-neutral-200 rounded-xl text-neutral-900 bg-white outline-none font-bold text-sm"
                    >
                      {whatsappNumbers.map((opt) => (
                        <option key={opt.id} value={opt.phone}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1.5">
                    Observaciones
                  </label>
                  <textarea
                    rows={3}
                    value={customerData.notes}
                    onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                    className="w-full p-3.5 border border-neutral-200 rounded-xl text-neutral-900 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 text-sm transition-all resize-none"
                    placeholder="Aclaraciones sobre el pedido..."
                  />
                </div>
              </form>
            )}

            {checkoutStep === 'success' && (
              <div className="p-8 flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-xl font-black text-neutral-900">¡Pedido enviado!</h3>
                <p className="text-neutral-500 font-medium text-sm max-w-xs">
                  Abrimos WhatsApp con el resumen de tu pedido. Confirmá el envío del mensaje para
                  que recibamos tu compra.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutStep('cart');
                  }}
                  className="mt-4 font-black text-sm hover:opacity-70 transition-opacity"
                  style={{ color: themeColor }}
                >
                  ← Volver a la tienda
                </button>
              </div>
            )}
          </div>

          {/* Drawer footer */}
          {checkoutStep !== 'success' && cartItemsCount > 0 && (
            <div className="p-5 border-t border-neutral-100 bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-neutral-500 font-bold text-sm">Total a pagar:</span>
                <span className="text-2xl font-black" style={{ color: themeColor }}>
                  ${cartTotal.toLocaleString('es-AR')}
                </span>
              </div>

              {checkoutStep === 'cart' ? (
                <button
                  onClick={() => setCheckoutStep('form')}
                  className="tc-btn-add w-full text-white font-black py-4 rounded-xl shadow-lg text-sm"
                  style={{ backgroundColor: themeColor }}
                >
                  Continuar Compra →
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="px-4 py-4 font-black text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors text-sm"
                  >
                    ← Atrás
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    className="tc-btn-add flex-grow text-white font-black py-4 rounded-xl shadow-lg text-sm"
                    style={{ backgroundColor: themeColor }}
                  >
                    Confirmar por WhatsApp
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
