import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  Lock,
  ArrowLeft,
  RotateCcw,
  LogOut,
  UtensilsCrossed,
  ClipboardList,
  LayoutDashboard,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  ImagePlus,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';
import { navigate } from '../utils/router';
import {
  MENU_CATEGORIES,
  CATEGORIES,
  BADGE_LABELS,
  FILTERABLE_BADGES,
  getLocalized,
  formatPrice,
  flattenItems,
  type Lang,
  type LocalizedString,
  type BadgeKey,
} from '../utils/menuData';
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
import {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadMenuImage,
  type MenuItemRecord,
} from '../utils/menuStore';
import {
  fetchActiveSpecial,
  saveSpecial,
  unpublishSpecial,
  type WeeklySpecial,
} from '../utils/weeklySpecial';

// Owner console at /admin — unlinked from the customer site.
//   • With Supabase configured: an owner dashboard (overview, full menu manager,
//     order history), behind an email+password login.
//   • Without it: a device-local PIN + localStorage editor (fallback).
const ADMIN_PIN = (import.meta.env.VITE_ADMIN_PIN as string | undefined) || '1234';

const LANGS: Lang[] = ['en', 'he', 'ar', 'ru', 'el'];
const emptyLoc = (): LocalizedString => ({ en: '', he: '', ar: '', ru: '', el: '' });

export default function Admin({ lang }: { lang: Language }) {
  return isSupabaseConfigured ? <SupabaseAdmin lang={lang} /> : <LocalAdmin lang={lang} />;
}

// ============================================================================
// Shared shell
// ============================================================================

function AdminShell({
  lang,
  children,
  right,
}: {
  lang: Language;
  children: React.ReactNode;
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
          <div className="flex items-center gap-2">{right}</div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-5">{children}</main>
    </div>
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

// ============================================================================
// Built-in dish editor (price + sold-out overrides on the coded menu)
// ============================================================================

function BuiltInEditor({
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
      {MENU_CATEGORIES.map((cat) => (
        <section key={cat.id} className="mb-6">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-white/50">
            {getLocalized(cat.name, l)}
          </h3>
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
                      ? tx(lang, 'אזל', 'Sold out', 'نفد', 'Нет', 'Εξαντλήθηκε')
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

// ============================================================================
// Owner-added dish manager (full CRUD, Supabase)
// ============================================================================

interface DraftDish {
  id?: string;
  category: string;
  name: LocalizedString;
  description: LocalizedString;
  price: string;
  image_url: string | null;
  badges: BadgeKey[];
  available: boolean;
}

function recordToDraft(r: MenuItemRecord): DraftDish {
  return {
    id: r.id,
    category: r.category,
    name: { ...emptyLoc(), ...r.name },
    description: { ...emptyLoc(), ...(r.description ?? {}) },
    price: String(r.price),
    image_url: r.image_url,
    badges: r.badges ?? [],
    available: r.available,
  };
}

function DishForm({
  lang,
  draft,
  onSave,
  onCancel,
}: {
  lang: Language;
  draft: DraftDish;
  onSave: (d: DraftDish) => Promise<void>;
  onCancel: () => void;
}) {
  const [d, setD] = useState<DraftDish>(draft);
  const [editLang, setEditLang] = useState<Lang>('en');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setName = (v: string) => setD((p) => ({ ...p, name: { ...p.name, [editLang]: v } }));
  const setDesc = (v: string) =>
    setD((p) => ({ ...p, description: { ...p.description, [editLang]: v } }));
  const toggleBadge = (b: BadgeKey) =>
    setD((p) => ({
      ...p,
      badges: p.badges.includes(b) ? p.badges.filter((x) => x !== b) : [...p.badges, b],
    }));

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadMenuImage(file);
      setD((p) => ({ ...p, image_url: url }));
    } catch {
      setError(
        tx(
          lang,
          'העלאת התמונה נכשלה',
          'Image upload failed',
          'فشل رفع الصورة',
          'Ошибка загрузки',
          'Αποτυχία μεταφόρτωσης'
        )
      );
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!d.name.en.trim()) {
      setEditLang('en');
      setError(
        tx(
          lang,
          'נדרש שם באנגלית',
          'English name is required',
          'الاسم بالإنجليزية مطلوب',
          'Нужно название на англ.',
          'Απαιτείται αγγλικό όνομα'
        )
      );
      return;
    }
    if (!(Number(d.price) > 0)) {
      setError(
        tx(lang, 'נדרש מחיר', 'A price is required', 'السعر مطلوب', 'Нужна цена', 'Απαιτείται τιμή')
      );
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(d);
    } catch {
      setError(
        tx(
          lang,
          'השמירה נכשלה',
          'Save failed',
          'فشل الحفظ',
          'Ошибка сохранения',
          'Αποτυχία αποθήκευσης'
        )
      );
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-slate-900 p-5 shadow-lift sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">
            {d.id
              ? tx(
                  lang,
                  'עריכת מנה',
                  'Edit dish',
                  'تعديل طبق',
                  'Изменить блюдо',
                  'Επεξεργασία πιάτου'
                )
              : tx(lang, 'מנה חדשה', 'New dish', 'طبق جديد', 'Новое блюдо', 'Νέο πιάτο')}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="rounded-full p-1.5 text-white/60 hover:bg-white/10"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Category */}
        <label className="mb-1 block text-xs text-white/50">
          {tx(lang, 'קטגוריה', 'Category', 'الفئة', 'Категория', 'Κατηγορία')}
        </label>
        <select
          value={d.category}
          onChange={(e) => setD((p) => ({ ...p, category: e.target.value }))}
          className="mb-3 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {getLocalized(c.name, lang as Lang)}
            </option>
          ))}
        </select>

        {/* Language switch for name/description */}
        <div className="mb-2 flex gap-1">
          {LANGS.map((lc) => (
            <button
              key={lc}
              type="button"
              onClick={() => setEditLang(lc)}
              className={`rounded-md px-2 py-1 text-xs font-semibold uppercase ${
                editLang === lc ? 'bg-brand-blue-500 text-white' : 'bg-white/10 text-white/60'
              }`}
            >
              {lc}
            </button>
          ))}
        </div>
        <input
          value={d.name[editLang]}
          onChange={(e) => setName(e.target.value)}
          placeholder={
            tx(lang, 'שם המנה', 'Dish name', 'اسم الطبق', 'Название', 'Όνομα') + ` (${editLang})`
          }
          className="mb-2 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
        />
        <textarea
          value={d.description[editLang]}
          onChange={(e) => setDesc(e.target.value)}
          rows={2}
          placeholder={
            tx(lang, 'תיאור', 'Description', 'الوصف', 'Описание', 'Περιγραφή') + ` (${editLang})`
          }
          className="mb-3 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
        />

        {/* Price */}
        <label className="mb-1 block text-xs text-white/50">
          {tx(lang, 'מחיר (₪)', 'Price (₪)', 'السعر (₪)', 'Цена (₪)', 'Τιμή (₪)')}
        </label>
        <input
          type="number"
          min={0}
          value={d.price}
          onChange={(e) => setD((p) => ({ ...p, price: e.target.value }))}
          className="mb-3 w-32 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
        />

        {/* Badges */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {FILTERABLE_BADGES.map((b) => {
            const on = d.badges.includes(b);
            return (
              <button
                key={b}
                type="button"
                onClick={() => toggleBadge(b)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  on ? 'bg-brand-terracotta-400 text-white' : 'bg-white/10 text-white/60'
                }`}
              >
                {BADGE_LABELS[b][lang as Lang]}
              </button>
            );
          })}
        </div>

        {/* Image */}
        <div className="mb-3 flex items-center gap-3">
          {d.image_url ? (
            <img src={d.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/5 text-white/30">
              <ImagePlus className="h-6 w-6" aria-hidden="true" />
            </div>
          )}
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
            )}
            {tx(lang, 'תמונה', 'Photo', 'صورة', 'Фото', 'Φωτό')}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>
        </div>

        {/* Availability */}
        <label className="mb-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={d.available}
            onChange={(e) => setD((p) => ({ ...p, available: e.target.checked }))}
            className="h-4 w-4"
          />
          {tx(lang, 'זמין להזמנה', 'Available to order', 'متاح للطلب', 'Доступно', 'Διαθέσιμο')}
        </label>

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={saving || uploading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-terracotta-400 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-terracotta-500 active:scale-95 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {tx(lang, 'שמירה', 'Save', 'حفظ', 'Сохранить', 'Αποθήκευση')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/15"
          >
            {tx(lang, 'ביטול', 'Cancel', 'إلغاء', 'Отмена', 'Άκυρο')}
          </button>
        </div>
      </div>
    </div>
  );
}

function DishManager({ lang }: { lang: Language }) {
  const [items, setItems] = useState<MenuItemRecord[] | null>(null);
  const [editing, setEditing] = useState<DraftDish | null>(null);

  const load = () => fetchMenuItems().then(setItems);
  useEffect(() => {
    load();
  }, []);

  const newDish = (): DraftDish => ({
    category: CATEGORIES[0].id,
    name: emptyLoc(),
    description: emptyLoc(),
    price: '',
    image_url: null,
    badges: [],
    available: true,
  });

  const save = async (d: DraftDish) => {
    const rec = {
      category: d.category,
      name: d.name,
      description: Object.values(d.description).some((v) => v.trim()) ? d.description : null,
      price: Number(d.price),
      image_url: d.image_url,
      badges: d.badges,
      available: d.available,
      sort_order: 0,
    };
    if (d.id) await updateMenuItem(d.id, rec);
    else await createMenuItem(rec);
    setEditing(null);
    await load();
  };

  const remove = async (id: string) => {
    await deleteMenuItem(id);
    await load();
  };

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">
          {tx(lang, 'המנות שלך', 'Your dishes', 'أطباقك', 'Ваши блюда', 'Τα πιάτα σας')}
        </h3>
        <button
          type="button"
          onClick={() => setEditing(newDish())}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-terracotta-400 px-3 py-2 text-xs font-bold text-white hover:bg-brand-terracotta-500"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          {tx(lang, 'הוספת מנה', 'Add dish', 'إضافة طبق', 'Добавить', 'Προσθήκη')}
        </button>
      </div>

      {items === null ? (
        <div className="flex justify-center py-8 text-white/40">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/15 py-6 text-center text-sm text-white/40">
          {tx(
            lang,
            'עדיין לא הוספת מנות. הקש "הוספת מנה".',
            'No added dishes yet. Tap "Add dish".',
            'لا أطباق مضافة بعد. اضغط "إضافة طبق".',
            'Пока нет добавленных блюд.',
            'Δεν έχετε προσθέσει πιάτα ακόμη.'
          )}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li
              key={it.id}
              className={`flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900 p-3 ${
                it.available ? '' : 'opacity-60'
              }`}
            >
              {it.image_url ? (
                <img
                  src={it.image_url}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="h-10 w-10 shrink-0 rounded-lg bg-white/5" />
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                  {getLocalized(it.name, lang as Lang)}
                </div>
                <div className="text-xs text-white/40">
                  {getLocalized(CATEGORIES.find((c) => c.id === it.category)?.name, lang as Lang)} ·{' '}
                  {formatPrice(it.price)}
                  {!it.available &&
                    ` · ${tx(lang, 'אזל', 'sold out', 'نفد', 'нет', 'εξαντλήθηκε')}`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditing(recordToDraft(it))}
                aria-label={tx(lang, 'עריכה', 'Edit', 'تعديل', 'Изменить', 'Επεξεργασία')}
                className="rounded-full p-2 text-white/60 hover:bg-white/10"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => remove(it.id)}
                aria-label={tx(lang, 'מחיקה', 'Delete', 'حذف', 'Удалить', 'Διαγραφή')}
                className="rounded-full p-2 text-white/60 hover:bg-red-500/20 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <DishForm lang={lang} draft={editing} onSave={save} onCancel={() => setEditing(null)} />
      )}
    </div>
  );
}

// ============================================================================
// Overview (KPIs)
// ============================================================================

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function daysAgo(n: number): number {
  return new Date().getTime() - n * 24 * 60 * 60 * 1000;
}

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

function Overview({ lang }: { lang: Language }) {
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

// ============================================================================
// Orders report
// ============================================================================

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
// Weekly board editor ("Board of the week" — the 3D-plate special)
// ============================================================================

function SpecialEditor({ lang }: { lang: Language }) {
  const [current, setCurrent] = useState<WeeklySpecial | null | undefined>(undefined);
  const [editLang, setEditLang] = useState<Lang>('en');
  const [title, setTitle] = useState<LocalizedString>(emptyLoc());
  const [description, setDescription] = useState<LocalizedString>(emptyLoc());
  const [badge, setBadge] = useState<LocalizedString>(emptyLoc());
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const load = () =>
    fetchActiveSpecial().then((s) => {
      setCurrent(s);
      if (s) {
        setTitle({ ...emptyLoc(), ...s.title });
        setDescription({ ...emptyLoc(), ...(s.description ?? {}) });
        setBadge({ ...emptyLoc(), ...(s.badge ?? {}) });
        setPrice(s.price != null ? String(s.price) : '');
        setImageUrl(s.image_url);
      }
    });

  useEffect(() => {
    load();
  }, []);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      setImageUrl(await uploadMenuImage(file));
    } catch {
      setError(
        tx(
          lang,
          'העלאת התמונה נכשלה',
          'Image upload failed',
          'فشل رفع الصورة',
          'Ошибка загрузки',
          'Αποτυχία μεταφόρτωσης'
        )
      );
    } finally {
      setUploading(false);
    }
  };

  const persist = async (active: boolean) => {
    if (!title.en.trim()) {
      setEditLang('en');
      setError(
        tx(
          lang,
          'נדרשת כותרת באנגלית',
          'English title is required',
          'العنوان بالإنجليزية مطلوب',
          'Нужен заголовок на англ.',
          'Απαιτείται αγγλικός τίτλος'
        )
      );
      return;
    }
    setSaving(true);
    setError(null);
    setDone(false);
    try {
      const has = (o: LocalizedString) => Object.values(o).some((v) => v.trim());
      await saveSpecial({
        id: current?.id,
        title,
        description: has(description) ? description : null,
        badge: has(badge) ? badge : null,
        price: price.trim() && Number(price) > 0 ? Number(price) : null,
        image_url: imageUrl,
        active,
      });
      await load();
      setDone(true);
    } catch {
      setError(
        tx(
          lang,
          'השמירה נכשלה',
          'Save failed',
          'فشل الحفظ',
          'Ошибка сохранения',
          'Αποτυχία αποθήκευσης'
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const takeDown = async () => {
    if (!current) return;
    setSaving(true);
    try {
      await unpublishSpecial(current.id);
      await load();
    } finally {
      setSaving(false);
    }
  };

  if (current === undefined) {
    return (
      <div className="flex justify-center py-16 text-white/40">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  const live = !!current?.active;

  return (
    <div className="mx-auto max-w-lg">
      <div
        className={`mb-4 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${
          live
            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
            : 'border-white/10 bg-slate-900 text-white/60'
        }`}
      >
        {live ? (
          <Eye className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        )}
        {live
          ? tx(
              lang,
              'המנה מוצגת עכשיו באתר',
              'This board is live on the site',
              'الطبق معروض الآن في الموقع',
              'Блюдо сейчас на сайте',
              'Το πιάτο εμφανίζεται τώρα'
            )
          : tx(
              lang,
              'אין מנה מוצגת כעת',
              'No board is live right now',
              'لا يوجد طبق معروض حالياً',
              'Сейчас ничего не опубликовано',
              'Κανένα πιάτο σε προβολή'
            )}
      </div>

      {/* Language switch for title/description/badge */}
      <div className="mb-2 flex gap-1">
        {LANGS.map((lc) => (
          <button
            key={lc}
            type="button"
            onClick={() => setEditLang(lc)}
            className={`rounded-md px-2 py-1 text-xs font-semibold uppercase ${
              editLang === lc ? 'bg-brand-blue-500 text-white' : 'bg-white/10 text-white/60'
            }`}
          >
            {lc}
          </button>
        ))}
      </div>

      <input
        value={title[editLang]}
        onChange={(e) => setTitle((p) => ({ ...p, [editLang]: e.target.value }))}
        placeholder={
          tx(lang, 'כותרת המנה', 'Dish title', 'عنوان الطبق', 'Заголовок', 'Τίτλος') +
          ` (${editLang})`
        }
        className="mb-2 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
      />
      <textarea
        value={description[editLang]}
        onChange={(e) => setDescription((p) => ({ ...p, [editLang]: e.target.value }))}
        rows={2}
        placeholder={
          tx(lang, 'תיאור', 'Description', 'الوصف', 'Описание', 'Περιγραφή') + ` (${editLang})`
        }
        className="mb-2 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
      />
      <input
        value={badge[editLang]}
        onChange={(e) => setBadge((p) => ({ ...p, [editLang]: e.target.value }))}
        placeholder={
          tx(lang, 'תווית (למשל "חדש")', 'Ribbon (e.g. "New")', 'شارة', 'Метка', 'Ετικέτα') +
          ` (${editLang})`
        }
        className="mb-3 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
      />

      <label className="mb-1 block text-xs text-white/50">
        {tx(
          lang,
          'מחיר (₪, לא חובה)',
          'Price (₪, optional)',
          'السعر (اختياري)',
          'Цена (необяз.)',
          'Τιμή (προαιρετικά)'
        )}
      </label>
      <input
        type="number"
        min={0}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="mb-3 w-32 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
      />

      {/* Photo */}
      <div className="mb-4 flex items-center gap-3">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-white/30">
            <ImagePlus className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
          )}
          {tx(lang, 'תמונת המנה', 'Dish photo', 'صورة الطبق', 'Фото', 'Φωτό')}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
      </div>

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      {done && !error && (
        <p className="mb-3 text-sm text-emerald-300">
          {tx(lang, 'נשמר!', 'Saved!', 'تم الحفظ!', 'Сохранено!', 'Αποθηκεύτηκε!')}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => persist(true)}
          disabled={saving || uploading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-terracotta-400 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-terracotta-500 active:scale-95 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {tx(lang, 'פרסום לאתר', 'Publish to site', 'نشر في الموقع', 'Опубликовать', 'Δημοσίευση')}
        </button>
        <button
          type="button"
          onClick={() => persist(false)}
          disabled={saving || uploading}
          className="rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/15 disabled:opacity-60"
        >
          {tx(lang, 'שמירת טיוטה', 'Save draft', 'حفظ مسودة', 'Черновик', 'Πρόχειρο')}
        </button>
        {live && (
          <button
            type="button"
            onClick={takeDown}
            disabled={saving}
            className="rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-60"
          >
            {tx(lang, 'הורדה מהאתר', 'Take down', 'إزالة', 'Снять', 'Απόσυρση')}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Supabase-backed dashboard
// ============================================================================

function SupabaseAdmin({ lang }: { lang: Language }) {
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
