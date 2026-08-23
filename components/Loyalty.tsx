import { useEffect, useState } from 'react';
import { Stamp, Gift, ArrowLeft, X } from 'lucide-react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';
import { navigate } from '../utils/router';
import { track } from '../utils/analytics';

// Digital "buy 10, get 1 free" punch card. No backend: the card lives in the
// customer's own browser (localStorage). To keep it honest, a stamp can only be
// added by staff entering a PIN on the customer's device — the same flow as
// punching a paper card at the counter.
const STORAGE_KEY = 'loyalty-card-v1';
const GOAL = 10;
const STAFF_PIN = (import.meta.env.VITE_STAFF_PIN as string | undefined) || '1234';

interface CardState {
  stamps: number;
  rewards: number; // rewards earned (and available to redeem)
}

function load(): CardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed.stamps === 'number') {
      return { stamps: parsed.stamps, rewards: parsed.rewards ?? 0 };
    }
  } catch {
    // fall through to default
  }
  return { stamps: 0, rewards: 0 };
}

function save(state: CardState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore private-mode / quota
  }
}

export default function Loyalty({ lang }: { lang: Language }) {
  const [card, setCard] = useState<CardState>(() => load());
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const isRtl = isRtlLang(lang);

  useEffect(() => save(card), [card]);

  const addStamp = () => {
    if (pin !== STAFF_PIN) {
      setPinError(true);
      return;
    }
    setPinOpen(false);
    setPin('');
    setPinError(false);
    setCard((prev) => {
      const total = prev.stamps + 1;
      if (total >= GOAL) {
        track('loyalty_reward_earned');
        return { stamps: total - GOAL, rewards: prev.rewards + 1 };
      }
      track('loyalty_stamp_added', { stamps: total });
      return { ...prev, stamps: total };
    });
  };

  const redeem = () => {
    if (card.rewards <= 0) return;
    track('loyalty_reward_redeemed');
    setCard((prev) => ({ ...prev, rewards: Math.max(0, prev.rewards - 1) }));
  };

  return (
    <div
      className="min-h-screen bg-brand-cream-100 px-4 py-10 dark:bg-slate-900"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-md">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-blue-500 dark:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          {tx(lang, 'לאתר', 'Back to site', 'إلى الموقع', 'На сайт', 'Στον ιστότοπο')}
        </button>

        {/* The card */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue-600 to-brand-blue-800 p-6 text-white shadow-lift">
          <div className="mb-1 flex items-center gap-2">
            <Stamp className="h-6 w-6" aria-hidden="true" />
            <h1 className="font-display text-2xl font-semibold">
              {tx(
                lang,
                'כרטיס נאמנות',
                'Loyalty Card',
                'بطاقة الولاء',
                'Карта лояльности',
                'Κάρτα πιστότητας'
              )}
            </h1>
          </div>
          <p className="mb-5 text-sm text-white/70">
            {tx(
              lang,
              'קנו 10 מנות — האחת עלינו! 🎁',
              'Buy 10 dishes — the next is on us! 🎁',
              'اشترِ 10 أطباق — العاشر علينا! 🎁',
              'Купите 10 блюд — следующее за нами! 🎁',
              'Αγοράστε 10 πιάτα — το επόμενο κερασμένο! 🎁'
            )}
          </p>

          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: GOAL }).map((_, i) => {
              const filled = i < card.stamps;
              return (
                <div
                  key={i}
                  className={`flex aspect-square items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                    filled
                      ? 'border-brand-terracotta-300 bg-brand-terracotta-400 text-white'
                      : 'border-white/25 bg-white/5 text-white/40'
                  }`}
                  aria-label={
                    filled
                      ? tx(lang, 'חתום', 'stamped', 'مختوم', 'отмечено', 'σφραγισμένο')
                      : tx(lang, 'ריק', 'empty', 'فارغ', 'пусто', 'κενό')
                  }
                >
                  {filled ? <Stamp className="h-4 w-4" aria-hidden="true" /> : i + 1}
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-center text-sm text-white/80">
            {card.stamps} / {GOAL}
          </p>
        </div>

        {/* Earned reward */}
        {card.rewards > 0 && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-700 dark:bg-emerald-900/20">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Gift className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-semibold">
                {tx(
                  lang,
                  `יש לך ${card.rewards} מנה חינם!`,
                  `You have ${card.rewards} free dish!`,
                  `لديك ${card.rewards} طبق مجاني!`,
                  `У вас ${card.rewards} бесплатное блюдо!`,
                  `Έχετε ${card.rewards} δωρεάν πιάτο!`
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={redeem}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 active:scale-95"
            >
              {tx(lang, 'מימוש', 'Redeem', 'استبدال', 'Использовать', 'Εξαργύρωση')}
            </button>
          </div>
        )}

        {/* Add-stamp action (staff PIN gated) */}
        <button
          type="button"
          onClick={() => setPinOpen(true)}
          className="mt-5 w-full rounded-full bg-brand-terracotta-400 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-terracotta-500 active:scale-[0.98]"
        >
          {tx(
            lang,
            'הוספת חותמת (צוות)',
            'Add a stamp (staff)',
            'إضافة ختم (الطاقم)',
            'Добавить штамп (персонал)',
            'Προσθήκη σφραγίδας (προσωπικό)'
          )}
        </button>

        <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
          {tx(
            lang,
            'הכרטיס נשמר במכשיר שלך. הראו אותו בקופה כדי לקבל חותמת.',
            'Your card is saved on this device. Show it at the counter to get a stamp.',
            'تُحفظ البطاقة على جهازك. أظهرها عند الكاشير للحصول على ختم.',
            'Карта хранится на вашем устройстве. Покажите её на кассе для штампа.',
            'Η κάρτα αποθηκεύεται στη συσκευή σας. Δείξτε την στο ταμείο για σφραγίδα.'
          )}
        </p>
      </div>

      {/* Staff PIN modal */}
      {pinOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-lift dark:bg-slate-800">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {tx(lang, 'קוד צוות', 'Staff PIN', 'رمز الطاقم', 'PIN персонала', 'PIN προσωπικού')}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setPinOpen(false);
                  setPin('');
                  setPinError(false);
                }}
                aria-label={tx(lang, 'סגור', 'Close', 'إغلاق', 'Закрыть', 'Κλείσιμο')}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setPinError(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && addStamp()}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-center text-lg tracking-widest text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-terracotta-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              placeholder="••••"
            />
            {pinError && (
              <p className="mt-2 text-center text-sm text-red-500">
                {tx(lang, 'קוד שגוי', 'Wrong PIN', 'رمز خاطئ', 'Неверный PIN', 'Λάθος PIN')}
              </p>
            )}
            <button
              type="button"
              onClick={addStamp}
              className="mt-4 w-full rounded-full bg-brand-terracotta-400 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-terracotta-500 active:scale-95"
            >
              {tx(lang, 'אישור', 'Confirm', 'تأكيد', 'Подтвердить', 'Επιβεβαίωση')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
