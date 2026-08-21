import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Check, Bell, BellRing, BellOff, ChefHat, Zap } from 'lucide-react';
import { Language } from '../types';
import { tx } from '../utils/i18n';
import { getAutoPrint, setStoredAutoPrint } from '../utils/autoprint';

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
  items?: string[]; // optional dish lines, when started from a WhatsApp ticket
  total?: number; // optional order total in shekels
};

const STORAGE_KEY = 'kitchen-orders-v1';
const STATS_KEY = 'kitchen-stats-v1';
const PRESETS = [10, 12, 15, 20, 25];
const DEFAULT_MIN = 12;

// A completed order's actual start-to-served time — the raw material for the
// "average handoff time" the owner uses to find their real ideal.
type Completion = { at: number; elapsedSec: number };

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

function loadStats(): Completion[] {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStats(stats: Completion[]) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// Short WebAudio tones — no asset needed. The owner's tap gestures (New order /
// Start / enabling alerts) unlock the audio context so later cues can play.
function tones(
  notes: Array<[number, number, number]>,
  opts?: { type?: OscillatorType; gain?: number }
) {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const type = opts?.type ?? 'sine';
    const peak = opts?.gain ?? 0.25;
    for (const [freq, start, dur] of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(peak, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    }
    const total = notes.reduce((m, [, s, d]) => Math.max(m, s + d), 0);
    setTimeout(() => ctx.close().catch(() => {}), (total + 0.1) * 1000);
  } catch {
    // audio unavailable — the visual alert still fires
  }
}

// Gentle rising two-note "a new order is on" cue.
const startChime = () =>
  tones([
    [660, 0, 0.14],
    [990, 0.12, 0.2],
  ]);

// Loud, urgent, repeating siren-style alarm when an order is ready — square
// wave at high gain so it carries across a busy kitchen.
const readyAlarm = () =>
  tones(
    [
      [988, 0.0, 0.16],
      [740, 0.2, 0.16],
      [988, 0.4, 0.16],
      [740, 0.6, 0.16],
      [988, 0.8, 0.16],
      [740, 1.0, 0.16],
      [988, 1.2, 0.16],
      [740, 1.4, 0.16],
      [988, 1.6, 0.16],
      [740, 1.8, 0.16],
    ],
    { type: 'square', gain: 0.6 }
  );

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
  const [stats, setStats] = useState<Completion[]>(() => loadStats());
  const [notifPerm, setNotifPerm] = useState<NotificationPermission | 'unsupported'>(() =>
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  // Whether this device auto-prints order tickets (shared with the /ticket page
  // via localStorage) — the owner can arm the kitchen tablet right from here.
  const [autoPrint, setAutoPrint] = useState(getAutoPrint);
  const toggleAutoPrint = () =>
    setAutoPrint((prev) => {
      const next = !prev;
      setStoredAutoPrint(next);
      return next;
    });

  // Refs so the once-a-second ticker always sees the latest orders + language
  // without being torn down and recreated each render.
  const ordersRef = useRef(orders);
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);
  const langRef = useRef(lang);
  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  // A system notification on the owner's phone/tablet (via the service worker so
  // it also shows when the tab is backgrounded on that device). Requires the
  // owner to have granted permission with the bell toggle.
  const notify = useCallback((label: string) => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    const title = tx(
      langRef.current,
      'הזמנה מוכנה!',
      'Order ready!',
      'الطلب جاهز!',
      'Заказ готов!',
      'Έτοιμη παραγγελία!'
    );
    const opts: NotificationOptions = {
      body: label,
      tag: `kitchen-${label}`,
      icon: '/favicon.png',
    };
    navigator.serviceWorker
      ?.getRegistration()
      .then((reg) => {
        if (reg && 'showNotification' in reg) reg.showNotification(title, opts);
        else new Notification(title, opts);
      })
      .catch(() => {
        try {
          new Notification(title, opts);
        } catch {
          // notifications unavailable
        }
      });
  }, []);

  const enableNotifications = async () => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'granted') {
      notify(
        tx(
          langRef.current,
          'התראות פעילות',
          'Alerts on',
          'التنبيهات مفعّلة',
          'Уведомления включены',
          'Ειδοποιήσεις ενεργές'
        )
      );
      return;
    }
    try {
      const p = await Notification.requestPermission();
      setNotifPerm(p);
    } catch {
      // permission request failed
    }
  };

  // One ticker drives every countdown. Ready-detection reads the live orders via
  // ref, fires the cue + notification once, then marks the order alerted — side
  // effects stay out of the setState updater so they never double-fire.
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      const newlyReady = ordersRef.current.filter(
        (o) => !o.alerted && o.durationSec - (t - o.startAt) / 1000 <= 0
      );
      if (newlyReady.length === 0) return;
      readyAlarm();
      try {
        navigator.vibrate?.([400, 150, 400, 150, 400]);
      } catch {
        // vibration unsupported
      }
      newlyReady.forEach((o) => notify(o.label));
      const readyIds = new Set(newlyReady.map((o) => o.id));
      setOrders((prev) => prev.map((o) => (readyIds.has(o.id) ? { ...o, alerted: true } : o)));
    }, 1000);
    return () => clearInterval(id);
  }, [notify]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  // Cross-tab sync: if a WhatsApp ticket adds an order from another tab, pick it
  // up here without a manual refresh.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setOrders(loadOrders());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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
    startChime(); // audible "a new order is on" cue for the kitchen
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

  // Marking Done records the order's actual start-to-served time, then removes
  // it. That history powers the average below.
  const completeOrder = (id: string) => {
    const done = ordersRef.current.find((o) => o.id === id);
    if (done) {
      const elapsedSec = Math.max(0, (Date.now() - done.startAt) / 1000);
      setStats((s) => [...s, { at: Date.now(), elapsedSec }]);
    }
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const todayStats = useMemo(() => {
    const since = startOfToday();
    const today = stats.filter((c) => c.at >= since);
    if (today.length === 0) return { count: 0, avgSec: 0 };
    const avgSec = today.reduce((sum, c) => sum + c.elapsedSec, 0) / today.length;
    return { count: today.length, avgSec };
  }, [stats]);

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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleAutoPrint}
              aria-pressed={autoPrint}
              aria-label={tx(
                lang,
                'הדפסה אוטומטית',
                'Auto-print',
                'طباعة تلقائية',
                'Автопечать',
                'Αυτόματη εκτύπωση'
              )}
              title={
                autoPrint
                  ? tx(
                      lang,
                      'הדפסה אוטומטית פועלת במכשיר הזה',
                      'Auto-print ON for this device',
                      'الطباعة التلقائية مفعّلة على هذا الجهاز',
                      'Автопечать вкл. на этом устройстве',
                      'Αυτόματη εκτύπωση ενεργή σε αυτή τη συσκευή'
                    )
                  : tx(
                      lang,
                      'הדפסה אוטומטית כבויה',
                      'Auto-print off',
                      'الطباعة التلقائية متوقفة',
                      'Автопечать выкл.',
                      'Αυτόματη εκτύπωση ανενεργή'
                    )
              }
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors active:scale-95 ${
                autoPrint
                  ? 'bg-brand-blue-500/25 text-brand-blue-200'
                  : 'bg-white/10 text-white/80 hover:bg-white/15'
              }`}
            >
              <Zap className="w-5 h-5" aria-hidden="true" />
            </button>
            {notifPerm !== 'unsupported' && (
              <button
                type="button"
                onClick={enableNotifications}
                aria-label={tx(
                  lang,
                  'הפעל התראות',
                  'Enable alerts',
                  'تفعيل التنبيهات',
                  'Включить уведомления',
                  'Ενεργοποίηση ειδοποιήσεων'
                )}
                title={
                  notifPerm === 'granted'
                    ? tx(
                        lang,
                        'התראות פעילות',
                        'Alerts on',
                        'التنبيهات مفعّلة',
                        'Уведомления включены',
                        'Ειδοποιήσεις ενεργές'
                      )
                    : notifPerm === 'denied'
                      ? tx(
                          lang,
                          'התראות חסומות',
                          'Alerts blocked',
                          'التنبيهات محظورة',
                          'Уведомления заблокированы',
                          'Ειδοποιήσεις αποκλεισμένες'
                        )
                      : tx(
                          lang,
                          'הפעל התראות',
                          'Enable alerts',
                          'تفعيل التنبيهات',
                          'Включить уведомления',
                          'Ενεργοποίηση ειδοποιήσεων'
                        )
                }
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors active:scale-95 ${
                  notifPerm === 'granted'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : notifPerm === 'denied'
                      ? 'bg-white/5 text-white/40'
                      : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                {notifPerm === 'granted' ? (
                  <BellRing className="w-5 h-5" aria-hidden="true" />
                ) : notifPerm === 'denied' ? (
                  <BellOff className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Bell className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => setCreating((c) => !c)}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-terracotta-400 hover:bg-brand-terracotta-500 px-4 py-2.5 text-sm font-bold shadow-lift transition-colors active:scale-95"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              {tx(lang, 'הזמנה חדשה', 'New order', 'طلب جديد', 'Новый заказ', 'Νέα παραγγελία')}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5">
        {/* Today's handoff average — the owner's real "ideal time" signal */}
        {todayStats.count > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-slate-900 border border-white/10 px-4 py-2.5 text-sm">
            <span className="text-white/50">
              {tx(lang, 'היום', 'Today', 'اليوم', 'Сегодня', 'Σήμερα')}
            </span>
            <span className="font-semibold">
              {todayStats.count}{' '}
              {tx(lang, 'הושלמו', 'served', 'قُدِّمت', 'подано', 'σερβιρίστηκαν')}
            </span>
            <span className="text-white/25">·</span>
            <span className="text-white/50">
              {tx(lang, 'זמן ממוצע', 'avg handoff', 'متوسط الوقت', 'ср. время', 'μέσος χρόνος')}
            </span>
            <span className="font-mono font-bold text-emerald-300">{fmt(todayStats.avgSec)}</span>
          </div>
        )}

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
                      {o.items && o.items.length > 0 && (
                        <ul className="mt-1.5 space-y-0.5">
                          {o.items.map((line, i) => (
                            <li key={i} className="text-xs text-white/70 leading-snug">
                              {line}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {o.total != null && (
                        <span className="text-sm font-bold text-emerald-300 tabular-nums whitespace-nowrap">
                          {o.total} ₪
                        </span>
                      )}
                      {overdue && <Bell className="w-5 h-5 text-red-400" aria-hidden="true" />}
                    </div>
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
                      onClick={() => completeOrder(o.id)}
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
