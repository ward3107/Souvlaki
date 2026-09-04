import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Language } from '../../types';
import { tx } from '../../utils/i18n';
import { fetchRecentOrders, type OrderRow } from '../../utils/orders';
import { startOfToday } from './dates';

export default function OrdersReport({ lang }: { lang: Language }) {
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
