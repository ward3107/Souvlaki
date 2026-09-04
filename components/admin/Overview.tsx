import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Language } from '../../types';
import { tx } from '../../utils/i18n';
import { flattenItems } from '../../utils/menuData';
import { fetchRecentOrders, type OrderRow } from '../../utils/orders';
import { fetchMenuItems, type MenuItemRecord } from '../../utils/menuStore';
import { getOverrides, type MenuOverrides } from '../../utils/menuOverrides';
import { startOfToday, daysAgo } from './dates';

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
      <div
        className={`font-display text-2xl font-bold ${accent ? 'text-emerald-300' : 'text-white'}`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-xs text-white/50">{label}</div>
    </div>
  );
}

export default function Overview({ lang }: { lang: Language }) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [dbItems, setDbItems] = useState<MenuItemRecord[]>([]);
  const [overrides, setOverrides] = useState<MenuOverrides>({});

  useEffect(() => {
    Promise.all([fetchRecentOrders(200), fetchMenuItems(), getOverrides()]).then(([o, d, ov]) => {
      setOrders(o);
      setDbItems(d);
      setOverrides(ov);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-white/40">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  const since = startOfToday();
  const week = daysAgo(7);
  const today = orders.filter((o) => new Date(o.created_at).getTime() >= since);
  const todayRevenue = today.reduce((s, o) => s + (o.total ?? 0), 0);
  const weekRevenue = orders
    .filter((o) => new Date(o.created_at).getTime() >= week)
    .reduce((s, o) => s + (o.total ?? 0), 0);
  const dishCount = flattenItems().length + dbItems.length;
  const soldOut =
    Object.values(overrides).filter((o) => o.soldOut).length +
    dbItems.filter((d) => !d.available).length;

  return (
    <div className="grid grid-cols-2 gap-3">
      <Stat
        label={tx(
          lang,
          'הזמנות היום',
          "Today's orders",
          'طلبات اليوم',
          'Заказы сегодня',
          'Παραγγελίες σήμερα'
        )}
        value={String(today.length)}
      />
      <Stat
        label={tx(
          lang,
          'מכירות היום',
          "Today's sales",
          'مبيعات اليوم',
          'Продажи сегодня',
          'Πωλήσεις σήμερα'
        )}
        value={`${todayRevenue} ₪`}
        accent
      />
      <Stat
        label={tx(
          lang,
          'מכירות (7 ימים)',
          'Sales (7 days)',
          'مبيعات (7 أيام)',
          'Продажи (7 дней)',
          'Πωλήσεις (7 ημέρες)'
        )}
        value={`${weekRevenue} ₪`}
        accent
      />
      <Stat
        label={tx(
          lang,
          'מנות בתפריט',
          'Dishes on menu',
          'أطباق القائمة',
          'Блюд в меню',
          'Πιάτα στο μενού'
        )}
        value={String(dishCount)}
      />
      <Stat
        label={tx(lang, 'אזלו מהמלאי', 'Sold out', 'نفدت', 'Нет в наличии', 'Εξαντλημένα')}
        value={String(soldOut)}
      />
    </div>
  );
}
