import { useState } from 'react';
import { Lock, ArrowLeft, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';
import { navigate } from '../utils/router';
import { MENU_CATEGORIES, getLocalized, formatPrice, type Lang } from '../utils/menuData';
import {
  loadOverrides,
  setItemOverride,
  clearOverrides,
  type MenuOverrides,
} from '../utils/menuOverrides';

// Owner console at /admin — unlinked from the customer site. PIN-gated (device
// session only). Lets the owner toggle "sold out" and override prices live;
// changes take effect on the menu immediately via localStorage + events.
const ADMIN_PIN = (import.meta.env.VITE_ADMIN_PIN as string | undefined) || '1234';

export default function Admin({ lang }: { lang: Language }) {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [overrides, setOverrides] = useState<MenuOverrides>(() => loadOverrides());
  const isRtl = isRtlLang(lang);
  const l = lang as Lang;

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
    // An empty field or a value equal to base clears the override.
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
              {tx(
                lang,
                'ניהול תפריט',
                'Menu Admin',
                'إدارة القائمة',
                'Управление меню',
                'Διαχείριση μενού'
              )}
            </h1>
          </div>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {tx(lang, 'איפוס הכל', 'Reset all', 'إعادة الكل', 'Сбросить', 'Επαναφορά')}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        <p className="mb-4 text-xs text-white/40">
          {tx(
            lang,
            'שינויים נשמרים במכשיר הזה ומשפיעים על התפריט מיד. "אזל מהמלאי" מסתיר את כפתור ההוספה.',
            'Changes save on this device and update the menu instantly. "Sold out" hides the add button.',
            'تُحفظ التغييرات على هذا الجهاز وتُحدّث القائمة فورًا. "نفد" يخفي زر الإضافة.',
            'Изменения сохраняются на этом устройстве и сразу применяются. «Нет в наличии» скрывает кнопку добавления.',
            'Οι αλλαγές αποθηκεύονται σε αυτή τη συσκευή και ενημερώνουν το μενού αμέσως. Το «Εξαντλήθηκε» κρύβει το κουμπί προσθήκης.'
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
                        {tx(lang, 'בסיס', 'base', 'أساسي', 'база', 'βάση')}{' '}
                        {formatPrice(item.price)}
                      </span>
                    </span>

                    <label className="flex items-center gap-1.5 text-xs text-white/60">
                      ₪
                      <input
                        type="number"
                        min={0}
                        defaultValue={ov.price ?? ''}
                        onBlur={(e) => changePrice(item.id, e.target.value, item.price)}
                        placeholder={String(item.price)}
                        aria-label={tx(lang, 'מחיר', 'Price', 'السعر', 'Цена', 'Τιμή')}
                        className="w-20 rounded-lg border border-white/10 bg-slate-800 px-2 py-1.5 text-center text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => toggleSoldOut(item.id, soldOut)}
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
      </main>
    </div>
  );
}
