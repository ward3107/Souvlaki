import { useState } from 'react';
import { Lock, RotateCcw } from 'lucide-react';
import { Language } from '../../types';
import { tx, isRtlLang } from '../../utils/i18n';
import { navigate } from '../../utils/router';
import {
  loadOverrides,
  setItemOverride,
  clearOverrides,
  type MenuOverrides,
} from '../../utils/menuOverrides';
import { ADMIN_PIN } from './constants';
import AdminShell from './AdminShell';
import BuiltInEditor from './BuiltInEditor';

export default function LocalAdmin({ lang }: { lang: Language }) {
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

  const toggleSoldOut = (itemId: string, current: boolean) =>
    setOverrides(setItemOverride(itemId, { soldOut: !current }));

  const changePrice = (itemId: string, value: string, basePrice: number) => {
    const num = value === '' ? undefined : Number(value);
    setOverrides(
      setItemOverride(itemId, {
        price: num == null || Number.isNaN(num) || num === basePrice ? undefined : num,
      })
    );
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
    <AdminShell
      lang={lang}
      right={
        <button
          type="button"
          onClick={() => {
            clearOverrides();
            setOverrides({});
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          {tx(lang, 'איפוס הכל', 'Reset all', 'إعادة الكل', 'Сбросить', 'Επαναφορά')}
        </button>
      }
    >
      <p className="mb-4 text-xs text-white/40">
        {tx(
          lang,
          'ללא Supabase — עריכת מחיר/זמינות נשמרת במכשיר זה בלבד.',
          'No Supabase — price/availability edits are saved on this device only.',
          'بدون Supabase — تُحفظ التعديلات على هذا الجهاز فقط.',
          'Без Supabase — изменения сохраняются только на этом устройстве.',
          'Χωρίς Supabase — οι αλλαγές αποθηκεύονται μόνο σε αυτή τη συσκευή.'
        )}
      </p>
      <BuiltInEditor
        lang={lang}
        overrides={overrides}
        onToggleSoldOut={toggleSoldOut}
        onChangePrice={changePrice}
      />
    </AdminShell>
  );
}
