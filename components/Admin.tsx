import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  Lock,
  ArrowLeft,
  RotateCcw,
  LogOut,
  UtensilsCrossed,
  ClipboardList,
  Loader2,
} from 'lucide-react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';
import { navigate } from '../utils/router';
import { MENU_CATEGORIES, getLocalized, formatPrice, type Lang } from '../utils/menuData';
import {
  loadOverrides,
  setItemOverride,
  clearOverrides,
  getOverrides,
  applyItemOverride,
  resetAllOverrides,
  type MenuOverrides,
} from '../utils/menuOverrides';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import { fetchRecentOrders, type OrderRow } from '../utils/orders';

// Owner console at /admin — unlinked from the customer site.
//   • With Supabase configured: proper email+password login; changes are shared
//     across all visitors, and order history is available.
//   • Without it: a device-local PIN + localStorage editor (fallback).
const ADMIN_PIN = (import.meta.env.VITE_ADMIN_PIN as string | undefined) || '1234';

export default function Admin({ lang }: { lang: Language }) {
  return isSupabaseConfigured ? <SupabaseAdmin lang={lang} /> : <LocalAdmin lang={lang} />;
}

// ============================================================================
// Shared presentational menu editor
// ============================================================================

function MenuEditor({
  lang,
  overrides,
  onToggleSoldOut,
  onChangePrice,
}: {
  lang: Language;
  overrides: MenuOverrides;
  onToggleSoldOut: (itemId: string, current: boolean) => void;
  onChangePrice: (itemId: string, value: string, basePrice: number) => void;
}) {
  const l = lang as Lang;
  return (
    <>
      <p className="mb-4 text-xs text-white/40">
        {tx(
          lang,
          'שינויים משפיעים על התפריט מיד. "אזל מהמלאי" מסתיר את כפתור ההוספה.',
          'Changes update the menu instantly. "Sold out" hides the add button.',
          'تُحدّث التغييرات القائمة فورًا. "نفد" يخفي زر الإضافة.',
          'Изменения сразу применяются к меню. «Нет в наличии» скрывает кнопку добавления.',
          'Οι αλλαγές ενημερώνουν το μενού αμέσως. Το «Εξαντλήθηκε» κρύβει το κουμπί προσθήκης.'
        )}
      </p>
      {MENU_CATEGORIES.map((cat) => (
        <section key={cat.id} className="mb-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-white/50">
            {getLocalized(cat.name, l)}
          </h2>
          <ul className="space-y-2">
            {cat.items.map((item) => {
              const ov = overrides[item.id] ?? {};
              const soldOut = !!ov.soldOut;
              return (
                <li
                  key={item.id}
                  className={`flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-slate-900 p-3 ${
                    soldOut ? 'opacity-60' : ''
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {getLocalized(item.name, l)}
                    <span className="ms-2 text-xs text-white/40">
                      {tx(lang, 'בסיס', 'base', 'أساسي', 'база', 'βάση')} {formatPrice(item.price)}
                    </span>
                  </span>

                  <label className="flex items-center gap-1.5 text-xs text-white/60">
                    ₪
                    <input
                      type="number"
                      min={0}
                      defaultValue={ov.price ?? ''}
                      onBlur={(e) => onChangePrice(item.id, e.target.value, item.price)}
                      placeholder={String(item.price)}
                      aria-label={tx(lang, 'מחיר', 'Price', 'السعر', 'Цена', 'Τιμή')}
                      className="w-20 rounded-lg border border-white/10 bg-slate-800 px-2 py-1.5 text-center text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => onToggleSoldOut(item.id, soldOut)}
                    aria-pressed={soldOut}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      soldOut
                        ? 'bg-red-500/90 text-white hover:bg-red-500'
                        : 'bg-white/10 text-white/80 hover:bg-white/15'
                    }`}
                  >
                    {soldOut
                      ? tx(lang, 'אזל מהמלאי', 'Sold out', 'نفد', 'Нет в наличии', 'Εξαντλήθηκε')
                      : tx(lang, 'זמין', 'Available', 'متوفر', 'В наличии', 'Διαθέσιμο')}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}

function AdminShell({
  lang,
  children,
  onReset,
  right,
}: {
  lang: Language;
  children: React.ReactNode;
  onReset?: () => void;
  right?: React.ReactNode;
}) {
  const isRtl = isRtlLang(lang);
  return (
    <div className="min-h-screen bg-slate-950 text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-label={tx(
                lang,
                'לאתר',
                'Back to site',
                'إلى الموقع',
                'На сайт',
                'Στον ιστότοπο'
              )}
              className="rounded-full p-2 text-white/70 hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
            </button>
            <h1 className="font-display text-lg font-semibold">
              {tx(lang, 'ניהול', 'Admin', 'إدارة', 'Управление', 'Διαχείριση')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                {tx(lang, 'איפוס הכל', 'Reset all', 'إعادة الكل', 'Сбросить', 'Επαναφορά')}
              </button>
            )}
            {right}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-5">{children}</main>
    </div>
  );
}

// ============================================================================
// Supabase-backed admin (shared, authenticated)
// ============================================================================

function SupabaseAdmin({ lang }: { lang: Language }) {
  const isRtl = isRtlLang(lang);
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [tab, setTab] = useState<'menu' | 'orders'>('menu');
  const [overrides, setOverrides] = useState<MenuOverrides>({});

  useEffect(() => {
    let active = true;
    supabase!.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase!.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) getOverrides().then(setOverrides);
  }, [session]);

  const signIn = async () => {
    setSigningIn(true);
    setAuthError(false);
    const { error } = await supabase!.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSigningIn(false);
    if (error) setAuthError(true);
    else setPassword('');
  };

  const toggleSoldOut = async (itemId: string, current: boolean) => {
    setOverrides(await applyItemOverride(itemId, { soldOut: !current }));
  };

  const changePrice = async (itemId: string, value: string, basePrice: number) => {
    const num = value === '' ? undefined : Number(value);
    setOverrides(
      await applyItemOverride(itemId, {
        price: num == null || Number.isNaN(num) || num === basePrice ? undefined : num,
      })
    );
  };

  const resetAll = async () => {
    setOverrides(await resetAllOverrides());
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white/50">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (!session) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-950 px-4"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="w-full max-w-xs rounded-2xl bg-slate-900 p-6 text-center shadow-lift">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-terracotta-400/20 text-brand-terracotta-300">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mb-4 font-display text-xl font-semibold text-white">
            {tx(lang, 'כניסת מנהל', 'Owner login', 'دخول المالك', 'Вход владельца', 'Είσοδος')}
          </h1>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setAuthError(false);
            }}
            placeholder={tx(lang, 'אימייל', 'Email', 'البريد', 'Email', 'Email')}
            className="mb-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-terracotta-400"
          />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAuthError(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && signIn()}
            placeholder={tx(lang, 'סיסמה', 'Password', 'كلمة المرور', 'Пароль', 'Κωδικός')}
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-terracotta-400"
          />
          {authError && (
            <p className="mt-2 text-sm text-red-400">
              {tx(
                lang,
                'פרטי כניסה שגויים',
                'Wrong email or password',
                'بيانات دخول خاطئة',
                'Неверный логин',
                'Λάθος στοιχεία'
              )}
            </p>
          )}
          <button
            type="button"
            onClick={signIn}
            disabled={signingIn}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-terracotta-400 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-terracotta-500 active:scale-95 disabled:opacity-60"
          >
            {signingIn && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {tx(lang, 'כניסה', 'Sign in', 'دخول', 'Войти', 'Είσοδος')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-3 text-xs text-white/40 hover:text-white/70"
          >
            {tx(lang, 'לאתר', 'Back to site', 'إلى الموقع', 'На сайт', 'Στον ιστότοπο')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminShell
      lang={lang}
      onReset={tab === 'menu' ? resetAll : undefined}
      right={
        <button
          type="button"
          onClick={() => supabase!.auth.signOut()}
          aria-label={tx(lang, 'התנתקות', 'Sign out', 'خروج', 'Выйти', 'Έξοδος')}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          {tx(lang, 'יציאה', 'Sign out', 'خروج', 'Выйти', 'Έξοδος')}
        </button>
      }
    >
      {/* Tabs */}
      <div className="mb-5 flex gap-2">
        <TabButton
          active={tab === 'menu'}
          onClick={() => setTab('menu')}
          icon={<UtensilsCrossed className="h-4 w-4" aria-hidden="true" />}
          label={tx(lang, 'תפריט', 'Menu', 'القائمة', 'Меню', 'Μενού')}
        />
        <TabButton
          active={tab === 'orders'}
          onClick={() => setTab('orders')}
          icon={<ClipboardList className="h-4 w-4" aria-hidden="true" />}
          label={tx(lang, 'הזמנות', 'Orders', 'الطلبات', 'Заказы', 'Παραγγελίες')}
        />
      </div>

      {tab === 'menu' ? (
        <MenuEditor
          lang={lang}
          overrides={overrides}
          onToggleSoldOut={toggleSoldOut}
          onChangePrice={changePrice}
        />
      ) : (
        <OrdersReport lang={lang} />
      )}
    </AdminShell>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active ? 'bg-brand-blue-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/15'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function OrdersReport({ lang }: { lang: Language }) {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);

  useEffect(() => {
    fetchRecentOrders(50).then(setOrders);
  }, []);

  if (orders === null) {
    return (
      <div className="flex justify-center py-16 text-white/40">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  const since = startOfToday();
  const today = orders.filter((o) => new Date(o.created_at).getTime() >= since);
  const todayRevenue = today.reduce((sum, o) => sum + (o.total ?? 0), 0);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm">
        <span className="text-white/50">
          {tx(lang, 'היום', 'Today', 'اليوم', 'Сегодня', 'Σήμερα')}
        </span>
        <span className="font-semibold">
          {today.length} {tx(lang, 'הזמנות', 'orders', 'طلبات', 'заказов', 'παραγγελίες')}
        </span>
        <span className="text-white/25">·</span>
        <span className="text-white/50">
          {tx(lang, 'מכירות', 'sales', 'المبيعات', 'продажи', 'πωλήσεις')}
        </span>
        <span className="font-mono font-bold text-emerald-300">{todayRevenue} ₪</span>
      </div>

      {orders.length === 0 ? (
        <p className="py-16 text-center text-white/40">
          {tx(
            lang,
            'עדיין אין הזמנות.',
            'No orders yet.',
            'لا طلبات بعد.',
            'Пока нет заказов.',
            'Καμία παραγγελία ακόμη.'
          )}
        </p>
      ) : (
        <ul className="space-y-2">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl border border-white/10 bg-slate-900 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold">
                  {o.customer_name ||
                    tx(lang, 'ללא שם', 'No name', 'بدون اسم', 'Без имени', 'Χωρίς όνομα')}
                </span>
                <span className="shrink-0 text-sm font-bold text-emerald-300 tabular-nums">
                  {o.total ?? 0} ₪
                </span>
              </div>
              <div className="mt-0.5 text-[11px] text-white/40">
                {new Date(o.created_at).toLocaleString()}
              </div>
              {o.items && o.items.length > 0 && (
                <ul className="mt-1.5 space-y-0.5">
                  {o.items.map((it, i) => (
                    <li key={i} className="text-xs text-white/70">
                      {it.q}× {it.n}
                      {it.v ? ` — ${it.v}` : ''}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================================
// Local fallback admin (PIN + localStorage) — used when Supabase isn't configured
// ============================================================================

function LocalAdmin({ lang }: { lang: Language }) {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [overrides, setOverrides] = useState<MenuOverrides>(() => loadOverrides());
  const isRtl = isRtlLang(lang);

  const submitPin = () => {
    if (pin === ADMIN_PIN) {
      setAuthed(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const toggleSoldOut = (itemId: string, current: boolean) => {
    setOverrides(setItemOverride(itemId, { soldOut: !current }));
  };

  const changePrice = (itemId: string, value: string, basePrice: number) => {
    const num = value === '' ? undefined : Number(value);
    setOverrides(
      setItemOverride(itemId, {
        price: num == null || Number.isNaN(num) || num === basePrice ? undefined : num,
      })
    );
  };

  const resetAll = () => {
    clearOverrides();
    setOverrides({});
  };

  if (!authed) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-950 px-4"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="w-full max-w-xs rounded-2xl bg-slate-900 p-6 text-center shadow-lift">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-terracotta-400/20 text-brand-terracotta-300">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mb-4 font-display text-xl font-semibold text-white">
            {tx(
              lang,
              'ניהול תפריט',
              'Menu Admin',
              'إدارة القائمة',
              'Управление меню',
              'Διαχείριση μενού'
            )}
          </h1>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setPinError(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && submitPin()}
            placeholder="PIN"
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-center text-lg tracking-widest text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-terracotta-400"
          />
          {pinError && (
            <p className="mt-2 text-sm text-red-400">
              {tx(lang, 'קוד שגוי', 'Wrong PIN', 'رمز خاطئ', 'Неверный PIN', 'Λάθος PIN')}
            </p>
          )}
          <button
            type="button"
            onClick={submitPin}
            className="mt-4 w-full rounded-full bg-brand-terracotta-400 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-terracotta-500 active:scale-95"
          >
            {tx(lang, 'כניסה', 'Enter', 'دخول', 'Войти', 'Είσοδος')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-3 text-xs text-white/40 hover:text-white/70"
          >
            {tx(lang, 'לאתר', 'Back to site', 'إلى الموقع', 'На сайт', 'Στον ιστότοπο')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminShell lang={lang} onReset={resetAll}>
      <MenuEditor
        lang={lang}
        overrides={overrides}
        onToggleSoldOut={toggleSoldOut}
        onChangePrice={changePrice}
      />
    </AdminShell>
  );
}
