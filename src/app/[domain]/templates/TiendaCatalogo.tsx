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
      {toastMessage && (
        <div
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 text-white px-6 py-3 rounded-full shadow-xl font-bold text-sm"
          style={{ backgroundColor: themeColor }}
        >
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 grid grid-cols-3 items-center">
          <div className="relative w-full max-w-xs hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100"
            />
          </div>

          <div
            className="flex justify-start sm:justify-center items-center cursor-pointer col-span-2 sm:col-span-1"
            onClick={() => {
              setActiveCategory(null);
              setSearchQuery('');
            }}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={siteName}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            ) : (
              <h1 className="text-2xl font-black tracking-tight uppercase">{siteName}</h1>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setIsCartOpen(true);
                setCheckoutStep('cart');
              }}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-neutral-100 active:scale-95"
            >
              <ShoppingCart className="h-6 w-6 text-neutral-700" />
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

        {categories.length > 0 && (
          <nav className="border-t border-neutral-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <ul className="flex items-center gap-6 overflow-x-auto h-14">
                <li>
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`whitespace-nowrap text-sm font-bold relative h-14 flex items-center ${activeCategory === null ? 'text-neutral-900' : 'text-neutral-500'}`}
                  >
                    Todos los productos
                    {activeCategory === null && (
                      <span
                        className="absolute bottom-0 left-0 w-full h-1 rounded-t-md"
                        style={{ backgroundColor: themeColor }}
                      />
                    )}
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setActiveCategory(cat.id)}
                      className={`whitespace-nowrap text-sm font-bold relative h-14 flex items-center ${activeCategory === cat.id ? 'text-neutral-900' : 'text-neutral-500'}`}
                    >
                      {cat.name}
                      {activeCategory === cat.id && (
                        <span
                          className="absolute bottom-0 left-0 w-full h-1 rounded-t-md"
                          style={{ backgroundColor: themeColor }}
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}
      </header>

      <div className="flex-grow">
        {!searchQuery && activeCategory === null && (
          <>
            <section className="relative bg-neutral-900 text-white overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundColor: themeColor }} />
              {settings?.banner_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.banner_image_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
              )}
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-10">
                <div className="max-w-2xl">
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
                    {bannerTitle}
                  </h2>
                  <p className="text-lg text-neutral-300 mb-8 font-medium">{bannerSubtitle}</p>
                </div>
                <div className="hidden sm:flex w-72 h-72 rounded-full border-8 border-white/10 items-center justify-center relative">
                  <div
                    className="absolute w-56 h-56 rounded-full blur-2xl opacity-50"
                    style={{ backgroundColor: themeColor }}
                  />
                  <ShoppingCart className="w-32 h-32 text-white relative z-10 opacity-90" />
                </div>
              </div>
            </section>

            <section className="bg-white border-b border-neutral-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-8 h-8 mb-3" style={{ color: themeColor }} />
                  <h4 className="font-black text-neutral-900 text-sm uppercase tracking-wide">
                    Envíos a todo el país
                  </h4>
                  <p className="text-sm text-neutral-500 mt-1">Llegamos directo a tu puerta.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <CreditCard className="w-8 h-8 mb-3" style={{ color: themeColor }} />
                  <h4 className="font-black text-neutral-900 text-sm uppercase tracking-wide">
                    Múltiples medios de pago
                  </h4>
                  <p className="text-sm text-neutral-500 mt-1">Efectivo, transferencia y tarjetas.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <ShieldCheck className="w-8 h-8 mb-3" style={{ color: themeColor }} />
                  <h4 className="font-black text-neutral-900 text-sm uppercase tracking-wide">
                    Compra 100% Segura
                  </h4>
                  <p className="text-sm text-neutral-500 mt-1">Protegemos todos tus datos.</p>
                </div>
              </div>
            </section>
          </>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-900">
              {searchQuery
                ? `Resultados para "${searchQuery}"`
                : activeCategory
                  ? categories.find((c) => c.id === activeCategory)?.name
                  : 'Catálogo Completo'}
            </h2>
            <p className="text-neutral-500 text-sm mt-1 font-medium">
              {filteredProducts.length} productos disponibles
            </p>
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'price_asc' | 'price_desc')}
              className="w-full sm:w-auto appearance-none bg-white border border-neutral-200 text-neutral-700 font-bold text-sm py-2.5 pl-4 pr-10 rounded-xl outline-none cursor-pointer"
            >
              <option value="newest">Más Recientes</option>
              <option value="price_asc">Menor Precio</option>
              <option value="price_desc">Mayor Precio</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <ShoppingCart className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-900">No hay productos para mostrar.</h3>
              <p className="text-neutral-500 mt-2">Intentá con otra búsqueda o categoría.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${!product.in_stock ? 'opacity-75' : 'cursor-pointer'}`}
                onClick={() => product.in_stock && setSelectedProduct(product)}
              >
                <div className="aspect-square bg-white w-full relative overflow-hidden flex items-center justify-center p-4">
                  {!product.in_stock && (
                    <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-neutral-900 text-white font-black text-xs tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg">
                        Agotado
                      </span>
                    </div>
                  )}
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <span
                      className="absolute top-3 left-3 z-10 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-sm"
                      style={{ backgroundColor: themeColor }}
                    >
                      {Math.round(
                        ((product.compare_at_price - product.price) / product.compare_at_price) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
                  {product.is_featured && (
                    <span className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-sm">
                      Destacado
                    </span>
                  )}
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-neutral-300 text-xs font-bold bg-neutral-50 w-full h-full flex items-center justify-center rounded-xl">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="p-4 text-center flex flex-col flex-grow bg-neutral-50/50 border-t border-neutral-50">
                  <h3 className="text-sm font-bold text-neutral-800 line-clamp-2 min-h-[40px] leading-tight">
                    {product.name}
                  </h3>

                  <div className="mt-2 mb-4 flex flex-col items-center justify-center">
                    <p className="text-lg font-black text-neutral-900">
                      ${product.price.toLocaleString('es-AR')}
                    </p>
                    {product.compare_at_price && product.compare_at_price > product.price ? (
                      <p className="text-xs text-neutral-400 line-through font-bold mt-0.5">
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
                    className={`mt-auto w-full text-center text-white text-xs font-black py-3 rounded-xl active:scale-95 ${!product.in_stock ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' : 'hover:opacity-90 shadow-md'}`}
                    style={product.in_stock ? { backgroundColor: themeColor } : {}}
                  >
                    {product.in_stock ? 'Agregar al carrito' : 'Sin Stock'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="bg-white border-t border-neutral-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain mb-4 opacity-80" />
            ) : (
              <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-800 mb-4">
                {siteName}
              </h2>
            )}
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">{storeDescription}</p>
          </div>

          <div>
            <h4 className="font-black text-neutral-900 mb-4 uppercase text-sm tracking-wide">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-neutral-500 font-medium">
              {whatsappNumbers.map((w) => (
                <li key={w.id}>
                  {w.label}: {w.phone || '—'}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-neutral-400 text-xs font-bold">
              © {new Date().getFullYear()} {siteName}. Todos los derechos reservados.
            </p>
            {showBranding && (
              <p className="text-neutral-400 text-xs font-bold">
                <a
                  href="https://sitiolisto.com.ar"
                  className="hover:underline"
                  style={{ color: themeColor }}
                >
                  Creado con SitioListo
                </a>
              </p>
            )}
          </div>
        </div>
      </footer>

      {/* MODAL DETALLE PRODUCTO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          />

          <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur p-2 rounded-full text-neutral-500 hover:text-neutral-900"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="w-full md:w-1/2 bg-white p-6 sm:p-10 flex items-center justify-center min-h-[300px]">
              {selectedProduct.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="text-neutral-400 font-bold bg-neutral-50 w-full h-full flex items-center justify-center rounded-2xl">
                  Sin imagen
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col overflow-y-auto bg-neutral-50/50">
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 leading-tight mb-2">
                {selectedProduct.name}
              </h2>

              <div className="flex items-end gap-3 mb-6">
                <p className="text-4xl font-black text-neutral-900">
                  ${selectedProduct.price.toLocaleString('es-AR')}
                </p>
                {selectedProduct.compare_at_price &&
                  selectedProduct.compare_at_price > selectedProduct.price && (
                    <p className="text-lg text-neutral-400 line-through font-bold mb-1">
                      ${selectedProduct.compare_at_price.toLocaleString('es-AR')}
                    </p>
                  )}
              </div>

              <div className="text-neutral-600 mb-8 whitespace-pre-wrap flex-grow font-medium leading-relaxed">
                {selectedProduct.description || 'Este producto no tiene descripción adicional.'}
              </div>

              <div className="mt-auto pt-6 border-t border-neutral-200">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                    setIsCartOpen(true);
                  }}
                  className="w-full text-white font-black py-4 rounded-xl active:scale-95 shadow-lg flex items-center justify-center gap-2 hover:opacity-90"
                  style={{ backgroundColor: themeColor }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CARRITO */}
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
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white">
            <h3 className="text-xl font-black text-neutral-900">
              {checkoutStep === 'cart'
                ? 'Tu Pedido'
                : checkoutStep === 'form'
                  ? 'Datos del Pedido'
                  : '¡Listo!'}
            </h3>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-neutral-400 hover:text-neutral-900 p-1 bg-neutral-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto bg-neutral-50/30">
            {checkoutStep === 'cart' && (
              <div className="p-6 space-y-4">
                {cartItemsCount === 0 ? (
                  <div className="flex flex-col items-center justify-center pt-20 text-neutral-400">
                    <ShoppingCart className="h-16 w-16 mb-4 opacity-50" />
                    <p className="font-bold">Tu carrito está vacío.</p>
                  </div>
                ) : (
                  Object.values(cart).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 border border-neutral-100 rounded-2xl bg-white shadow-sm"
                    >
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-contain rounded-xl bg-neutral-50 p-1"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center text-[10px] text-neutral-400 font-bold">
                          Sin foto
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <p className="font-bold text-neutral-900 text-sm truncate">{item.name}</p>
                        <p className="font-black text-sm" style={{ color: themeColor }}>
                          ${(item.price * item.quantity).toLocaleString('es-AR')}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 font-black text-neutral-600"
                          >
                            -
                          </button>
                          <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 font-black text-neutral-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-300 hover:text-red-500 p-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {checkoutStep === 'form' && (
              <form id="checkout-form" onSubmit={handleConfirmOrder} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-black text-neutral-500 uppercase mb-2">
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    className="w-full p-3.5 border border-neutral-200 rounded-xl text-neutral-900 outline-none focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-neutral-500 uppercase mb-2">
                    Tu Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                    className="w-full p-3.5 border border-neutral-200 rounded-xl text-neutral-900 outline-none focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
                    placeholder="Ej: 11-2345-6789"
                  />
                </div>
                {whatsappNumbers.length > 1 && (
                  <div>
                    <label className="block text-xs font-black text-neutral-500 uppercase mb-2">
                      Enviar pedido a:
                    </label>
                    <select
                      value={customerData.selectedSeller}
                      onChange={(e) =>
                        setCustomerData({ ...customerData, selectedSeller: e.target.value })
                      }
                      className="w-full p-3.5 border border-neutral-200 rounded-xl text-neutral-900 bg-white outline-none font-bold"
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
                  <label className="block text-xs font-black text-neutral-500 uppercase mb-2">
                    Observaciones
                  </label>
                  <textarea
                    rows={3}
                    value={customerData.notes}
                    onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                    className="w-full p-3.5 border border-neutral-200 rounded-xl text-neutral-900 outline-none focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
                    placeholder="Aclaraciones sobre el pedido..."
                  />
                </div>
              </form>
            )}

            {checkoutStep === 'success' && (
              <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-4">
                <CheckCircle2 className="h-20 w-20 text-green-500" />
                <h3 className="text-2xl font-black text-neutral-900">¡Pedido enviado!</h3>
                <p className="text-neutral-500 font-medium">
                  Abrimos WhatsApp con el resumen de tu pedido. Confirmá el envío del mensaje
                  para que recibamos tu compra.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutStep('cart');
                  }}
                  className="mt-6 font-bold hover:opacity-80"
                  style={{ color: themeColor }}
                >
                  Volver a la tienda
                </button>
              </div>
            )}
          </div>

          {checkoutStep !== 'success' && cartItemsCount > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-white">
              <div className="flex items-center justify-between mb-5">
                <span className="text-neutral-500 font-bold">Total a pagar:</span>
                <span className="text-3xl font-black text-neutral-900">
                  ${cartTotal.toLocaleString('es-AR')}
                </span>
              </div>

              {checkoutStep === 'cart' ? (
                <button
                  onClick={() => setCheckoutStep('form')}
                  className="w-full text-white font-black py-4 rounded-xl active:scale-95 shadow-lg hover:opacity-90"
                  style={{ backgroundColor: themeColor }}
                >
                  Continuar Compra
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="px-5 py-4 font-black text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    className="flex-grow text-white font-black py-4 rounded-xl active:scale-95 shadow-lg hover:opacity-90"
                    style={{ backgroundColor: themeColor }}
                  >
                    Confirmar Pedido por WhatsApp
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
