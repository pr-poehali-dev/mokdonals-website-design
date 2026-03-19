import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/36d7d3d7-b4f4-40ab-8c63-83e693d337c5/files/157f6c47-c06b-4710-802e-a38b32b57dec.jpg";

const CATEGORIES = [
  { id: "burgers", label: "🍔 Бургеры" },
  { id: "fries", label: "🍟 Картошка" },
  { id: "nuggets", label: "🍗 Наггетсы" },
  { id: "pies", label: "🥧 Пирожки" },
  { id: "drinks", label: "🥤 Напитки" },
];

interface MenuItem {
  id: number;
  category: string;
  name: string;
  description: string;
  price: number;
  badge: string | null;
  emoji: string;
}

interface CartItem extends MenuItem {
  qty: number;
}

const MENU: MenuItem[] = [
  { id: 1, category: "burgers", name: "МокБиг", description: "Двойная говяжья котлета, фирменный соус, маринованный огурец, лук, горчица, кетчуп", price: 349, badge: "Хит", emoji: "🍔" },
  { id: 2, category: "burgers", name: "Чизбургер Делюкс", description: "Сочная котлета, двойной чеддер, карамелизованный лук, соус барбекю", price: 289, badge: null, emoji: "🍔" },
  { id: 3, category: "burgers", name: "Куриный Крисп", description: "Хрустящее куриное филе, свежий салат, томаты, майонез с зеленью", price: 259, badge: "Новинка", emoji: "🍔" },
  { id: 4, category: "burgers", name: "Веган Бургер", description: "Растительная котлета, авокадо, микрогрин, горчичный соус", price: 299, badge: null, emoji: "🍔" },
  { id: 5, category: "fries", name: "Фри Классик M", description: "Золотистая картошка фри, хрустящая снаружи, мягкая внутри", price: 99, badge: null, emoji: "🍟" },
  { id: 6, category: "fries", name: "Фри Классик L", description: "Большая порция картошки фри — для настоящих любителей", price: 139, badge: "Популярно", emoji: "🍟" },
  { id: 7, category: "fries", name: "Фри с Сыром", description: "Картошка фри с соусом из расплавленного чеддера", price: 159, badge: null, emoji: "🍟" },
  { id: 8, category: "fries", name: "Фри со Специями", description: "Острая картошка фри с паприкой и чесночным порошком", price: 129, badge: "Остро 🌶", emoji: "🍟" },
  { id: 9, category: "nuggets", name: "Наггетсы 6 шт", description: "Хрустящие куриные наггетсы с соусом на выбор", price: 199, badge: null, emoji: "🍗" },
  { id: 10, category: "nuggets", name: "Наггетсы 9 шт", description: "Большая порция хрустящих наггетсов, три соуса в комплекте", price: 279, badge: "Хит", emoji: "🍗" },
  { id: 11, category: "nuggets", name: "Наггетсы 20 шт", description: "Семейная порция — настоящий пир! Четыре соуса включены", price: 549, badge: "Выгодно", emoji: "🍗" },
  { id: 12, category: "pies", name: "Пирожок с Яблоком", description: "Хрустящий пирожок с нежной яблочной начинкой и корицей", price: 89, badge: null, emoji: "🥧" },
  { id: 13, category: "pies", name: "Пирожок с Вишней", description: "Воздушное тесто с сочной вишнёвой начинкой", price: 89, badge: "Новинка", emoji: "🥧" },
  { id: 14, category: "pies", name: "Пирожок с Картошкой", description: "Тёплый пирожок с картошкой и зеленью", price: 79, badge: null, emoji: "🥧" },
  { id: 15, category: "drinks", name: "Кока-Кола M", description: "Классическая Кока-Кола со льдом", price: 119, badge: null, emoji: "🥤" },
  { id: 16, category: "drinks", name: "Кока-Кола L", description: "Большая Кока-Кола — утоли жажду по-настоящему", price: 149, badge: null, emoji: "🥤" },
  { id: 17, category: "drinks", name: "Молочный Шейк", description: "Густой шейк: клубника, ваниль или шоколад на выбор", price: 229, badge: "Хит", emoji: "🥤" },
  { id: 18, category: "drinks", name: "МокКофе", description: "Ароматный капучино на свежей обжарке", price: 179, badge: null, emoji: "☕" },
  { id: 19, category: "drinks", name: "Сок апельсин", description: "Свежевыжатый апельсиновый сок", price: 159, badge: null, emoji: "🍊" },
];

export default function Index() {
  const [activeCategory, setActiveCategory] = useState("burgers");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [payForm, setPayForm] = useState({ name: "", phone: "", card: "", exp: "", cvv: "", method: "card" });
  const [orderDone, setOrderDone] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const filtered = MENU.filter((i) => i.category === activeCategory);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    setAddedIds((prev) => { const n = new Set(prev); n.add(item.id); return n; });
    setTimeout(() => setAddedIds((prev) => { const n = new Set(prev); n.delete(item.id); return n; }), 800);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const item = prev.find((c) => c.id === id);
      if (!item) return prev;
      if (item.qty === 1) return prev.filter((c) => c.id !== id);
      return prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const deleteFromCart = (id: number) => setCart((prev) => prev.filter((c) => c.id !== id));

  const handleOrder = () => {
    setOrderDone(true);
    setTimeout(() => {
      setOrderDone(false);
      setPaymentOpen(false);
      setCartOpen(false);
      setCart([]);
      setPayForm({ name: "", phone: "", card: "", exp: "", cvv: "", method: "card" });
    }, 3000);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setCartOpen(false); setPaymentOpen(false); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--dark)", color: "#F5F0E8" }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(15,13,11,0.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,195,0,0.08)" }}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍔</span>
          <span className="font-oswald text-2xl font-bold tracking-wider text-yellow">МОК<span style={{ color: "#F5F0E8" }}>ДОНАЛС</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "#A89880" }}>
          <a href="#menu" className="hover:text-yellow transition-colors" style={{ color: "inherit" }}>Меню</a>
          <a href="#about" className="hover:text-yellow transition-colors" style={{ color: "inherit" }}>О нас</a>
        </div>
        <button onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-full btn-yellow text-sm font-semibold">
          <Icon name="ShoppingCart" size={18} />
          <span>Корзина</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "#FF3333", color: "#fff" }}>
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="hero" className="w-full h-full object-cover" style={{ opacity: 0.22 }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,13,11,0.97) 40%, rgba(255,195,0,0.04) 100%)" }} />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-8 blur-3xl"
          style={{ background: "radial-gradient(circle, #FFC300 0%, transparent 70%)" }} />
        <div className="relative z-10 container mx-auto px-6 max-w-6xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 animate-fade-in-up"
              style={{ background: "rgba(255,195,0,0.1)", border: "1px solid rgba(255,195,0,0.25)", color: "#FFC300" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#FFC300" }} />
              Доставка от 30 минут
            </div>
            <h1 className="font-oswald font-bold leading-none mb-6 animate-fade-in-up delay-100"
              style={{ fontSize: "clamp(4rem, 10vw, 8rem)", letterSpacing: "-0.02em" }}>
              ВКУС<br /><span className="text-yellow">БЕЗ</span><br />ГРАНИЦ
            </h1>
            <p className="text-lg mb-10 animate-fade-in-up delay-200 max-w-md"
              style={{ color: "#A89880", lineHeight: "1.7" }}>
              Сочные бургеры, хрустящая картошка, нежные наггетсы — всё это прямо к вашей двери. Свежо, быстро, вкусно.
            </p>
            <div className="flex flex-wrap items-center gap-6 animate-fade-in-up delay-300">
              <a href="#menu">
                <button className="btn-yellow px-8 py-4 rounded-2xl text-lg font-bold font-oswald tracking-wide">
                  СМОТРЕТЬ МЕНЮ
                </button>
              </a>
              <div className="flex items-center gap-6">
                {[["4.9", "Рейтинг"], ["30+", "Блюд"], ["24/7", "Работаем"]].map(([val, label], i) => (
                  <div key={i} className="flex items-center gap-4">
                    {i > 0 && <div className="w-px h-10" style={{ background: "rgba(255,195,0,0.2)" }} />}
                    <div className="text-center">
                      <div className="font-oswald text-2xl font-bold text-yellow">{val}</div>
                      <div className="text-xs" style={{ color: "#A89880" }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-8 bottom-20 animate-float hidden lg:block">
          <div className="w-36 h-36 rounded-full flex flex-col items-center justify-center font-oswald font-bold text-center"
            style={{ background: "var(--yellow)", color: "#0F0D0B" }}>
            <span className="text-4xl">🔥</span>
            <span className="text-sm leading-tight mt-1">Горячие<br />хиты!</span>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="font-oswald text-sm tracking-widest mb-2 block" style={{ color: "#FFC300" }}>— НАШЕ МЕНЮ —</span>
            <h2 className="font-oswald font-bold" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>
              ЧТО БУДЕМ <span className="text-yellow">ЗАКАЗЫВАТЬ?</span>
            </h2>
          </div>

          {/* Category pills */}
          <div className="flex gap-3 mb-12 overflow-x-auto scrollbar-hidden pb-2">
            {CATEGORIES.map((cat) => (
              <button key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`category-pill flex-shrink-0 px-6 py-3 rounded-full text-sm border ${activeCategory === cat.id ? "active" : ""}`}
                style={activeCategory !== cat.id ? { background: "var(--dark-card)", border: "1px solid rgba(255,195,0,0.15)", color: "#A89880" } : { border: "1px solid transparent" }}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Menu grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item, idx) => (
              <div key={item.id}
                className="menu-card rounded-3xl overflow-hidden animate-fade-in-up"
                style={{ background: "var(--dark-card)", border: "1px solid rgba(255,195,0,0.08)", animationDelay: `${idx * 0.06}s` }}>
                <div className="relative h-44 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(255,195,0,0.05) 0%, rgba(15,13,11,0.8) 100%)" }}>
                  <span className="text-8xl select-none" style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.5))" }}>
                    {item.emoji}
                  </span>
                  {item.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold font-oswald tracking-wide"
                      style={{ background: "var(--yellow)", color: "#0F0D0B" }}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-oswald text-xl font-bold mb-1 text-yellow">{item.name}</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: "#7A6E62" }}>{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-oswald text-2xl font-bold" style={{ color: "#F5F0E8" }}>
                      {item.price} ₽
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${addedIds.has(item.id) ? "scale-95" : ""}`}
                      style={addedIds.has(item.id)
                        ? { background: "rgba(255,195,0,0.12)", color: "#FFC300", border: "1px solid rgba(255,195,0,0.35)" }
                        : { background: "var(--yellow)", color: "#0F0D0B" }}>
                      {addedIds.has(item.id) ? (
                        <><Icon name="Check" size={14} /> Добавлено</>
                      ) : (
                        <><Icon name="Plus" size={14} /> В корзину</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 px-6"
        style={{ background: "var(--dark-card)", borderTop: "1px solid rgba(255,195,0,0.08)", borderBottom: "1px solid rgba(255,195,0,0.08)" }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { emoji: "⚡", title: "Быстро", desc: "Доставляем за 30 минут или угощаем бесплатно" },
              { emoji: "🌿", title: "Свежо", desc: "Только свежие продукты и натуральные ингредиенты каждый день" },
              { emoji: "💳", title: "Удобно", desc: "Оплата картой или электронным кошельком онлайн" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <span className="text-5xl">{item.emoji}</span>
                <h3 className="font-oswald text-2xl font-bold text-yellow">{item.title}</h3>
                <p className="text-sm" style={{ color: "#7A6E62", maxWidth: 240 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 text-center" style={{ borderTop: "1px solid rgba(255,195,0,0.06)" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl">🍔</span>
          <span className="font-oswald text-xl font-bold text-yellow">МОК<span style={{ color: "#F5F0E8" }}>ДОНАЛС</span></span>
        </div>
        <p className="text-xs" style={{ color: "#4A4038" }}>© 2026 МокДоналс. Вкус без границ.</p>
      </footer>

      {/* FLOATING CART */}
      {cartCount > 0 && !cartOpen && (
        <button onClick={() => setCartOpen(true)}
          className="fixed bottom-8 right-8 z-40 flex items-center gap-3 px-6 py-4 rounded-2xl btn-yellow text-base font-bold shadow-2xl animate-fade-in animate-pulse-glow">
          <Icon name="ShoppingCart" size={22} />
          <span>{cartCount} позиции</span>
          <span className="font-oswald text-lg">{total} ₽</span>
        </button>
      )}

      {/* CART SIDEBAR */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 cursor-pointer" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
            onClick={() => setCartOpen(false)} />
          <div ref={cartRef} className="w-full max-w-md flex flex-col animate-slide-in-right"
            style={{ background: "var(--dark-card)", borderLeft: "1px solid rgba(255,195,0,0.12)" }}>
            <div className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid rgba(255,195,0,0.1)" }}>
              <h2 className="font-oswald text-2xl font-bold">КОРЗИНА</h2>
              <button onClick={() => setCartOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "rgba(255,195,0,0.08)", color: "#A89880" }}>
                <Icon name="X" size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <span className="text-6xl" style={{ opacity: 0.25 }}>🛒</span>
                  <p style={{ color: "#4A4038" }}>Корзина пуста</p>
                  <button onClick={() => setCartOpen(false)} className="btn-yellow px-6 py-3 rounded-xl text-sm">
                    Выбрать блюда
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl"
                    style={{ background: "var(--dark-surface)", border: "1px solid rgba(255,195,0,0.06)" }}>
                    <span className="text-3xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{item.name}</div>
                      <div className="text-xs font-oswald mt-0.5 text-yellow">{item.price * item.qty} ₽</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-yellow"
                        style={{ background: "rgba(255,195,0,0.1)" }}>
                        <Icon name="Minus" size={12} />
                      </button>
                      <span className="w-6 text-center font-bold text-sm">{item.qty}</span>
                      <button onClick={() => addToCart(item)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: "var(--yellow)", color: "#0F0D0B" }}>
                        <Icon name="Plus" size={12} />
                      </button>
                      <button onClick={() => deleteFromCart(item.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center ml-1"
                        style={{ background: "rgba(255,50,50,0.1)", color: "#FF5555" }}>
                        <Icon name="Trash2" size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="px-6 py-5" style={{ borderTop: "1px solid rgba(255,195,0,0.1)" }}>
                <div className="flex items-center justify-between mb-4">
                  <span style={{ color: "#A89880" }}>Итого:</span>
                  <span className="font-oswald text-3xl font-bold text-yellow">{total} ₽</span>
                </div>
                <button onClick={() => { setCartOpen(false); setPaymentOpen(true); }}
                  className="w-full btn-yellow py-4 rounded-2xl text-lg font-bold font-oswald flex items-center justify-center gap-2">
                  <Icon name="CreditCard" size={20} />
                  ОПЛАТИТЬ ЗАКАЗ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {paymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 cursor-pointer" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            onClick={() => setPaymentOpen(false)} />
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden animate-fade-in-up"
            style={{ background: "var(--dark-card)", border: "1px solid rgba(255,195,0,0.15)" }}>
            {orderDone ? (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
                <span className="text-7xl animate-float">🎉</span>
                <h2 className="font-oswald text-4xl font-bold text-yellow">ЗАКАЗ ПРИНЯТ!</h2>
                <p style={{ color: "#A89880" }}>Доставим за 30 минут. Приятного аппетита!</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 py-5"
                  style={{ borderBottom: "1px solid rgba(255,195,0,0.1)" }}>
                  <h2 className="font-oswald text-2xl font-bold">ОПЛАТА ЗАКАЗА</h2>
                  <button onClick={() => setPaymentOpen(false)}
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,195,0,0.08)", color: "#A89880" }}>
                    <Icon name="X" size={18} />
                  </button>
                </div>

                <div className="px-6 py-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[{ id: "card", label: "💳 Карта" }, { id: "wallet", label: "📱 Кошелёк" }].map((m) => (
                      <button key={m.id}
                        onClick={() => setPayForm(f => ({ ...f, method: m.id }))}
                        className="py-3 rounded-xl font-semibold text-sm transition-all"
                        style={payForm.method === m.id
                          ? { background: "var(--yellow)", color: "#0F0D0B", border: "1px solid transparent" }
                          : { background: "var(--dark-surface)", color: "#A89880", border: "1px solid rgba(255,195,0,0.12)" }}>
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <input placeholder="Ваше имя" value={payForm.name}
                    onChange={(e) => setPayForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: "var(--dark-surface)", border: "1px solid rgba(255,195,0,0.12)", color: "#F5F0E8" }} />
                  <input placeholder="Телефон" value={payForm.phone}
                    onChange={(e) => setPayForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "var(--dark-surface)", border: "1px solid rgba(255,195,0,0.12)", color: "#F5F0E8" }} />

                  {payForm.method === "card" && (
                    <>
                      <input placeholder="Номер карты" value={payForm.card}
                        onChange={(e) => setPayForm(f => ({ ...f, card: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ background: "var(--dark-surface)", border: "1px solid rgba(255,195,0,0.12)", color: "#F5F0E8" }} />
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="ММ/ГГ" value={payForm.exp}
                          onChange={(e) => setPayForm(f => ({ ...f, exp: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                          style={{ background: "var(--dark-surface)", border: "1px solid rgba(255,195,0,0.12)", color: "#F5F0E8" }} />
                        <input placeholder="CVV" value={payForm.cvv} type="password"
                          onChange={(e) => setPayForm(f => ({ ...f, cvv: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                          style={{ background: "var(--dark-surface)", border: "1px solid rgba(255,195,0,0.12)", color: "#F5F0E8" }} />
                      </div>
                    </>
                  )}

                  {payForm.method === "wallet" && (
                    <div className="flex gap-3">
                      {["SberPay", "YooMoney", "T-Pay"].map((w) => (
                        <button key={w} className="flex-1 py-3 rounded-xl text-xs font-bold transition-all hover:border-yellow"
                          style={{ background: "var(--dark-surface)", color: "#A89880", border: "1px solid rgba(255,195,0,0.15)" }}>
                          {w}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <span className="text-sm" style={{ color: "#A89880" }}>К оплате:</span>
                      <span className="font-oswald text-2xl font-bold text-yellow">{total} ₽</span>
                    </div>
                    <button onClick={handleOrder}
                      className="w-full btn-yellow py-4 rounded-2xl text-lg font-bold font-oswald flex items-center justify-center gap-2">
                      <Icon name="Lock" size={18} />
                      ОПЛАТИТЬ {total} ₽
                    </button>
                  </div>

                  <p className="text-center text-xs" style={{ color: "#4A4038" }}>
                    🔒 Защищено SSL-шифрованием. Данные не сохраняются.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
