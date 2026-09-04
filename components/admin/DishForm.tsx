import { useState } from 'react';
import { Loader2, X, ImagePlus } from 'lucide-react';
import { Language } from '../../types';
import { tx } from '../../utils/i18n';
import {
  CATEGORIES,
  BADGE_LABELS,
  FILTERABLE_BADGES,
  getLocalized,
  type Lang,
  type BadgeKey,
} from '../../utils/menuData';
import { uploadMenuImage } from '../../utils/menuStore';
import { LANGS } from './constants';
import { type DraftDish } from './dish';

export default function DishForm({
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
