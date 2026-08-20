import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Check, Bell, ChefHat } from 'lucide-react';
import { Language } from '../types';
import { tx } from '../utils/i18n';

// ── Owner-only kitchen timer ────────────────────────────────────────────────
// A private, unlinked page (/kitchen) for the restaurant. When a WhatsApp order
// arrives the owner starts a prep countdown; each order counts down, then turns
// red + beeps + vibrates when it is ready (and keeps counting into "overdue" so
// nothing gets forgotten). State lives in localStorage on the owner's device —
// no backend, so it works offline and survives a refresh.

type Order = {
  id: string;
  label: string;
  startAt: number; // epoch ms
  durationSec: number;
  alerted: boolean;
};

const STORAGE_KEY = 'kitchen-orders-v1';
const PRESETS = [10, 15, 20, 25, 30];
const DEFAULT_MIN = 20;

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore quota / private-mode failures
  }
}

// Short "ready" chime via WebAudio — no asset needed.
function chime() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const play = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    };
    play(880, 0, 0.28);
    play(1174, 0.22, 0.34);
    setTimeout(() => ctx.close().catch(() => {}), 900);
  } catch {
    // audio unavailable — the visual alert still fires
  }
}

function fmt(totalSec: number): string {
  const sign = totalSec < 0 ? '+' : '';
  const s = Math.abs(Math.round(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${sign}${m}:${r.toString().padStart(2, '0')}`;
}

export default function Kitchen({ lang }: { lang: Language }) {
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());
  const [now, setNow] = useState(() => Date.now());
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMin, setNewMin] = useState(DEFAULT_MIN);
  const seqRef = useRef(loadOrders().length + 1);

  // One ticker drives every countdown, and fires the ready-alert exactly once
  // per order as it crosses zero. Functional setState keeps this off the render
  // path and avoids stale closures.
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      setOrders((prev) => {
        let changed = false;
        const next = prev.map((o) => {
          const remaining = o.durationSec - (t - o.startAt) / 1000;
          if (remaining <= 0 && !o.alerted) {
            changed = true;
            chime();
            try {
              navigator.vibrate?.([300, 120, 300]);
            } catch {
              // vibration unsupported
            }
            return { ...o, alerted: true };
          }
          return o;
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const startOrder = () => {
    const label =
      newName.trim() ||
      `${tx(lang, 'הזמנה', 'Order', 'طلب', 'Заказ', 'Παραγγελία')} ${seqRef.current}`;
    seqRef.current += 1;
    setOrders((prev) => [
      {
        id: `${Date.now()}-${seqRef.current}`,
        label,
        startAt: Date.now(),
        durationSec: newMin * 60,
        alerted: false,
      },
      ...prev,
    ]);
    setNewName('');
    setNewMin(DEFAULT_MIN);
    setCreating(false);
  };

  const addMinute = (id: string) =>
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const durationSec = o.durationSec + 60;
        const stillOverdue = durationSec - (Date.now() - o.startAt) / 1000 <= 0;
        return { ...o, durationSec, alerted: stillOverdue ? o.alerted : false };
      })
    );

  const removeOrder = (id: string) => setOrders((prev) => prev.filter((o) => o.id !== id));

  const activeCount = orders.length;
  const readyCount = useMemo(
    () => orders.filter((o) => o.durationSec - (now - o.startAt) / 1000 <= 0).length,
    [orders, now]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-slate-950/85 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-terracotta-400/20 text-brand-terracotta-300 flex items-center justify-center">
              <ChefHat className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold leading-none">
                {tx(lang, 'המטבח', 'Kitchen', 'المطبخ', 'Кухня', 'Κουζίνα')}
              </h1>
              <p className="text-[11px] text-white/50 mt-0.5">
                {activeCount > 0
                  ? `${activeCount} ${tx(lang, 'פעילות', 'active', 'نشطة', 'активных', 'ενεργές')}${readyCount ? ` · ${readyCount} ${tx(lang, 'מוכנות', 'ready', 'جاهزة', 'готовы', 'έτοιμες')}` : ''}`
                  : tx(
                      lang,
                      'אין הזמנות פעילות',
                      'No active orders',
                      'لا طلبات نشطة',
                      'Нет активных заказов',
                      'Καμία ενεργή παραγγελία'
                    )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCreating((c) => !c)}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-terracotta-400 hover:bg-brand-terracotta-500 px-4 py-2.5 text-sm font-bold shadow-lift transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            {tx(lang, 'הזמנה חדשה', 'New order', 'طلب جديد', 'Новый заказ', 'Νέα παραγγελία')}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5">
        {/* New-order form */}
        {creating && (
          <div className="mb-5 rounded-2xl bg-slate-900 border border-white/10 p-4">
            <label className="block text-xs text-white/60 mb-1.5" htmlFor="order-name">
              {tx(
                lang,
                'שם הלקוח (לא חובה)',
                'Customer name (optional)',
                'اسم الزبون (اختياري)',
                'Имя клиента (необязательно)',
                'Όνομα πελάτη (προαιρετικό)'
              )}
            </label>
            <input
              id="order-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startOrder()}
              autoComplete="off"
              className="w-full rounded-xl bg-slate-800 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-terracotta-400"
              placeholder={tx(
                lang,
                'לדוגמה: מוחמד',
                'e.g. Maria',
                'مثال: محمد',
                'напр. Мария',
                'π.χ. Μαρία'
              )}
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-white/60 me-1">
                {tx(lang, 'זמן הכנה', 'Prep time', 'وقت التحضير', 'Время', 'Χρόνος')}:
              </span>
              {PRESETS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setNewMin(m)}
                  className={`min-w-[3rem] rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                    newMin === m
                      ? 'bg-brand-terracotta-400 text-white'
                      : 'bg-slate-800 text-white/70 hover:bg-slate-700'
                  }`}
                >
                  {m}
                  <span className="text-[10px] opacity-70 ms-0.5">
                    {tx(lang, 'ד׳', 'm', 'د', 'м', 'λ')}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={startOrder}
                className="flex-1 rounded-full bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-bold transition-colors active:scale-[0.98]"
              >
                {tx(lang, 'התחל טיימר', 'Start timer', 'ابدأ المؤقت', 'Запустить', 'Έναρξη')}
              </button>
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="rounded-full bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-sm font-semibold transition-colors"
              >
                {tx(lang, 'ביטול', 'Cancel', 'إلغاء', 'Отмена', 'Άκυρο')}
              </button>
            </div>
          </div>
        )}

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="text-center py-24 text-white/40">
            <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-40" aria-hidden="true" />
            <p className="text-sm">
              {tx(
                lang,
                'אין הזמנות פעילות. הקש "הזמנה חדשה" כשמגיעה הזמנה.',
                'No active orders. Tap “New order” when one comes in.',
                'لا طلبات نشطة. اضغط "طلب جديد" عند وصول طلب.',
                'Нет активных заказов. Нажмите «Новый заказ», когда поступит заказ.',
                'Καμία ενεργή παραγγελία. Πατήστε «Νέα παραγγελία».'
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {orders.map((o) => {
              const remaining = o.durationSec - (now - o.startAt) / 1000;
              const overdue = remaining <= 0;
              const soon = remaining > 0 && remaining <= 120;
              const pct = Math.max(0, Math.min(1, remaining / o.durationSec));
              const accent = overdue
                ? 'text-red-400'
                : soon
                  ? 'text-amber-300'
                  : 'text-emerald-300';
              const barColor = overdue ? 'bg-red-500' : soon ? 'bg-amber-400' : 'bg-emerald-400';
              const cardRing = overdue
                ? 'border-red-500/60 shadow-[0_0_0_1px_rgba(239,68,68,0.4)] animate-pulse'
                : 'border-white/10';
              return (
                <div
                  key={o.id}
                  className={`rounded-2xl bg-slate-900 border p-4 flex flex-col ${cardRing}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base truncate">{o.label}</h3>
                      <p className="text-[11px] text-white/45 mt-0.5">
                        {overdue
                          ? tx(
                              lang,
                              'מוכן — לחלק!',
                              'Ready — serve!',
                              'جاهز — قدّمه!',
                              'Готово — подавайте!',
                              'Έτοιμο — σερβίρετε!'
                            )
                          : `${Math.round(o.durationSec / 60)} ${tx(lang, 'דקות הכנה', 'min prep', 'دقيقة تحضير', 'мин', 'λεπτά')}`}
                      </p>
                    </div>
                    {overdue && (
                      <Bell className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
                    )}
                  </div>

                  <div
                    className={`mt-2 font-mono tabular-nums text-5xl font-bold tracking-tight ${accent}`}
                  >
                    {fmt(remaining)}
                  </div>

                  <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full ${barColor}`} style={{ width: `${pct * 100}%` }} />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => addMinute(o.id)}
                      className="flex-1 rounded-full bg-slate-800 hover:bg-slate-700 px-3 py-2 text-sm font-semibold transition-colors active:scale-95"
                    >
                      +1 {tx(lang, 'ד׳', 'min', 'د', 'мин', 'λ')}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeOrder(o.id)}
                      aria-label={tx(lang, 'הושלם', 'Done', 'تم', 'Готово', 'Έτοιμο')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500/90 hover:bg-emerald-500 px-3 py-2 text-sm font-bold transition-colors active:scale-95"
                    >
                      <Check className="w-4 h-4" aria-hidden="true" />
                      {tx(lang, 'הושלם', 'Done', 'تم', 'Готово', 'Έτοιμο')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-center text-[11px] text-white/30">
          {tx(
            lang,
            'עמוד פרטי לצוות. הטיימרים נשמרים במכשיר הזה בלבד.',
            'Private staff page. Timers are saved on this device only.',
            'صفحة خاصة بالطاقم. تُحفظ المؤقتات على هذا الجهاز فقط.',
            'Приватная страница для персонала. Таймеры хранятся только на этом устройстве.',
            'Ιδιωτική σελίδα προσωπικού. Οι χρονομετρητές αποθηκεύονται μόνο σε αυτή τη συσκευή.'
          )}
        </p>
      </main>
    </div>
  );
}
