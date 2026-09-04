import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  Lock,
  RotateCcw,
  LogOut,
  UtensilsCrossed,
  ClipboardList,
  LayoutDashboard,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Language } from '../../types';
import { tx, isRtlLang } from '../../utils/i18n';
import { navigate } from '../../utils/router';
import {
  getOverrides,
  applyItemOverride,
  resetAllOverrides,
  type MenuOverrides,
} from '../../utils/menuOverrides';
import { supabase } from '../../utils/supabase';
import AdminShell from './AdminShell';
import TabButton from './TabButton';
import BuiltInEditor from './BuiltInEditor';
import DishManager from './DishManager';
import Overview from './Overview';
import OrdersReport from './OrdersReport';
import SpecialEditor from './SpecialEditor';

export default function SupabaseAdmin({ lang }: { lang: Language }) {
  const isRtl = isRtlLang(lang);
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [tab, setTab] = useState<'overview' | 'menu' | 'orders' | 'special'>('overview');
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
    const { error } = await supabase!.auth.signInWithPassword({ email: email.trim(), password });
    setSigningIn(false);
    if (error) setAuthError(true);
    else setPassword('');
  };

  const toggleSoldOut = async (itemId: string, current: boolean) =>
    setOverrides(await applyItemOverride(itemId, { soldOut: !current }));

  const changePrice = async (itemId: string, value: string, basePrice: number) => {
    const num = value === '' ? undefined : Number(value);
    setOverrides(
      await applyItemOverride(itemId, {
        price: num == null || Number.isNaN(num) || num === basePrice ? undefined : num,
      })
    );
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
      right={
        <button
          type="button"
          onClick={() => supabase!.auth.signOut()}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          {tx(lang, 'יציאה', 'Sign out', 'خروج', 'Выйти', 'Έξοδος')}
        </button>
      }
    >
      <div className="mb-5 flex gap-2">
        <TabButton
          active={tab === 'overview'}
          onClick={() => setTab('overview')}
          icon={<LayoutDashboard className="h-4 w-4" aria-hidden="true" />}
          label={tx(lang, 'סקירה', 'Overview', 'نظرة', 'Обзор', 'Επισκόπηση')}
        />
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
        <TabButton
          active={tab === 'special'}
          onClick={() => setTab('special')}
          icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
          label={tx(
            lang,
            'המנה של השבוע',
            'Weekly board',
            'طبق الأسبوع',
            'Блюдо недели',
            'Πιάτο εβδομάδας'
          )}
        />
      </div>

      {tab === 'overview' && <Overview lang={lang} />}
      {tab === 'orders' && <OrdersReport lang={lang} />}
      {tab === 'special' && <SpecialEditor lang={lang} />}
      {tab === 'menu' && (
        <>
          <DishManager lang={lang} />
          <div className="mb-3 flex items-center justify-between border-t border-white/10 pt-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">
              {tx(
                lang,
                'מנות הבית',
                'Built-in dishes',
                'أطباق البيت',
                'Основное меню',
                'Βασικό μενού'
              )}
            </h3>
            <button
              type="button"
              onClick={async () => setOverrides(await resetAllOverrides())}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              {tx(lang, 'איפוס', 'Reset', 'إعادة', 'Сброс', 'Επαναφορά')}
            </button>
          </div>
          <p className="mb-3 text-xs text-white/40">
            {tx(
              lang,
              'למנות הבית ניתן לשנות מחיר וזמינות. מנות שהוספת ניתנות לעריכה מלאה למעלה.',
              'Built-in dishes: change price & availability. Dishes you add (above) are fully editable.',
              'أطباق البيت: غيّر السعر والتوفر. الأطباق التي تضيفها (بالأعلى) قابلة للتعديل الكامل.',
              'Основное меню: цена и наличие. Добавленные вами блюда — полностью редактируемы.',
              'Βασικό μενού: τιμή & διαθεσιμότητα. Τα πιάτα που προσθέτετε είναι πλήρως επεξεργάσιμα.'
            )}
          </p>
          <BuiltInEditor
            lang={lang}
            overrides={overrides}
            onToggleSoldOut={toggleSoldOut}
            onChangePrice={changePrice}
          />
        </>
      )}
    </AdminShell>
  );
}
