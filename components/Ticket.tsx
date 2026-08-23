import { useEffect, useMemo, useRef, useState } from 'react';
import { Printer, ChefHat, Zap } from 'lucide-react';
import { Language } from '../types';
import { tx } from '../utils/i18n';
import { decodeTicket } from '../utils/ticket';
import { navigate } from '../utils/router';
import { getAutoPrint, setStoredAutoPrint } from '../utils/autoprint';

const KITCHEN_KEY = 'kitchen-orders-v1';
const DEFAULT_PREP_MIN = 12;

function fmtTime(ms: number): string {
  try {
    return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function Ticket({ lang }: { lang: Language }) {
  const order = useMemo(
    () => decodeTicket(typeof window !== 'undefined' ? window.location.hash : ''),
    []
  );

  const [autoPrint, setAutoPrint] = useState(() => {
    // A ?autoprint=on|off link overrides the stored flag (handy when setting up
    // the kitchen tablet); otherwise use whatever this device was last set to.
    try {
      const p = new URLSearchParams(window.location.search).get('autoprint');
      if (p === 'on' || p === '1') return true;
      if (p === 'off' || p === '0') return false;
    } catch {
      // no window/search available — fall through to the stored flag
    }
    return getAutoPrint();
  });
  const printedRef = useRef(false);

  // Persist a ?autoprint= override so it sticks for future tickets on this device.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('autoprint');
    if (p === 'on' || p === '1') setStoredAutoPrint(true);
    else if (p === 'off' || p === '0') setStoredAutoPrint(false);
  }, []);

  // On an armed kitchen device, print the ticket by itself once it's rendered.
  // Fires once per opened ticket; the small delay lets fonts/layout settle so
  // the chit isn't printed blank.
  useEffect(() => {
    if (!order || !autoPrint || printedRef.current) return;
    printedRef.current = true;
    const t = window.setTimeout(() => window.print(), 500);
    return () => window.clearTimeout(t);
  }, [order, autoPrint]);

  const toggleAutoPrint = () => {
    setAutoPrint((prev) => {
      const next = !prev;
      setStoredAutoPrint(next);
      return next;
    });
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          {tx(
            lang,
            'קישור הכרטיס אינו תקין.',
            'This ticket link is invalid.',
            'رابط التذكرة غير صالح.',
            'Ссылка на чек недействительна.',
            'Μη έγκυρος σύνδεσμος δελτίου.'
          )}
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 rounded-full bg-brand-terracotta-400 hover:bg-brand-terracotta-500 text-white px-5 py-2.5 text-sm font-semibold"
        >
          {tx(lang, 'לדף הבית', 'Home', 'الصفحة الرئيسية', 'На главную', 'Αρχική')}
        </button>
      </div>
    );
  }

  const startInKitchen = () => {
    try {
      const raw = localStorage.getItem(KITCHEN_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      const items = order.items.map((i) => `${i.q}× ${i.n}${i.v ? ` — ${i.v}` : ''}`);
      const newOrder = {
        id: `${Date.now()}-t`,
        label: order.n || tx(lang, 'הזמנה', 'Order', 'طلب', 'Заказ', 'Παραγγελία'),
        startAt: Date.now(),
        durationSec: DEFAULT_PREP_MIN * 60,
        alerted: false,
        items,
        total: order.t,
      };
      localStorage.setItem(
        KITCHEN_KEY,
        JSON.stringify([newOrder, ...(Array.isArray(existing) ? existing : [])])
      );
    } catch {
      // storage unavailable — still route to the kitchen
    }
    navigate('/kitchen');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center py-6 px-4">
      {/* Actions — never printed */}
      <div className="print:hidden w-full max-w-[80mm] mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-terracotta-400 hover:bg-brand-terracotta-500 text-white px-4 py-3 text-sm font-bold shadow-lift active:scale-95 transition-transform"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            {tx(lang, 'הדפס', 'Print', 'طباعة', 'Печать', 'Εκτύπωση')}
          </button>
          <button
            type="button"
            onClick={startInKitchen}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 text-sm font-bold shadow-lift active:scale-95 transition-transform"
          >
            <ChefHat className="w-4 h-4" aria-hidden="true" />
            {tx(
              lang,
              'התחל במטבח',
              'Start in kitchen',
              'ابدأ في المطبخ',
              'В кухню',
              'Στην κουζίνα'
            )}
          </button>
        </div>

        {/* Per-device auto-print switch — arm the kitchen tablet once. */}
        <button
          type="button"
          onClick={toggleAutoPrint}
          aria-pressed={autoPrint}
          className={`mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
            autoPrint
              ? 'bg-brand-blue-500 text-white'
              : 'bg-white text-slate-700 ring-1 ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600'
          }`}
        >
          <Zap className="w-4 h-4" aria-hidden="true" />
          {autoPrint
            ? tx(
                lang,
                'הדפסה אוטומטית: פועלת',
                'Auto-print: ON',
                'الطباعة التلقائية: مفعّلة',
                'Автопечать: вкл.',
                'Αυτόματη εκτύπωση: ΝΑΙ'
              )
            : tx(
                lang,
                'הדפסה אוטומטית: כבויה',
                'Auto-print: OFF',
                'الطباعة التلقائية: متوقفة',
                'Автопечать: выкл.',
                'Αυτόματη εκτύπωση: ΟΧΙ'
              )}
        </button>
        <p className="mt-1.5 text-center text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          {autoPrint
            ? tx(
                lang,
                'כרטיסים יודפסו לבד במכשיר הזה.',
                'Tickets print by themselves on this device.',
                'ستُطبع التذاكر تلقائيًا على هذا الجهاز.',
                'Чеки печатаются сами на этом устройстве.',
                'Τα δελτία εκτυπώνονται μόνα τους σε αυτή τη συσκευή.'
              )
            : tx(
                lang,
                'הפעילו במכשיר המטבח כדי להדפיס הזמנות אוטומטית.',
                'Turn on for the kitchen device to auto-print orders.',
                'فعّلها على جهاز المطبخ لطباعة الطلبات تلقائيًا.',
                'Включите на кухонном устройстве для автопечати заказов.',
                'Ενεργοποιήστε στη συσκευή κουζίνας για αυτόματη εκτύπωση.'
              )}
        </p>
      </div>

      {/* The ticket — the only thing that prints (see @media print in index.css) */}
      <div
        id="kitchen-ticket"
        className="w-[80mm] max-w-full bg-white text-black rounded-lg shadow-lg px-4 py-5"
      >
        <div className="text-center">
          <div className="font-display font-bold text-xl leading-none">GREEK SOUVLAKI</div>
          <div className="text-[11px] tracking-wide mt-1">Kfar Yasif · כפר יאסיף</div>
        </div>

        <div className="border-t border-dashed border-black/60 my-3" />

        <div className="flex items-center justify-between text-xs">
          <span className="uppercase tracking-wide">
            {tx(lang, 'שעה', 'Time', 'الوقت', 'Время', 'Ώρα')}
          </span>
          <span className="font-semibold tabular-nums">{fmtTime(order.at)}</span>
        </div>

        <div className="text-center my-3">
          <div className="text-[10px] uppercase tracking-widest text-black/60">
            {tx(lang, 'לקוח', 'Customer', 'الزبون', 'Клиент', 'Πελάτης')}
          </div>
          <div className="font-bold text-2xl leading-tight mt-0.5 break-words">
            {order.n || '—'}
          </div>
        </div>

        <div className="border-t border-dashed border-black/60 my-3" />

        <div className="space-y-1.5">
          {order.items.map((it, i) => (
            <div key={i} className="flex items-start justify-between gap-2 text-sm">
              <span className="font-bold tabular-nums shrink-0">{it.q}×</span>
              <span className="flex-1 text-start leading-snug break-words">
                {it.n}
                {it.v ? <span className="text-black/70"> — {it.v}</span> : null}
              </span>
              <span className="tabular-nums shrink-0">{it.p} ₪</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-black/60 my-3" />

        <div className="flex items-center justify-between font-bold text-lg">
          <span className="uppercase tracking-wide">
            {tx(lang, 'סה״כ', 'Total', 'الإجمالي', 'Итого', 'Σύνολο')}
          </span>
          <span className="tabular-nums">{order.t} ₪</span>
        </div>

        <div className="text-center text-[10px] text-black/50 mt-4">greeksouflaki.com</div>
      </div>
    </div>
  );
}
