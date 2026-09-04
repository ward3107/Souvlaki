import { useEffect, useState } from 'react';
import { Loader2, ImagePlus, Eye, EyeOff } from 'lucide-react';
import { Language } from '../../types';
import { tx } from '../../utils/i18n';
import { type Lang, type LocalizedString } from '../../utils/menuData';
import { uploadMenuImage } from '../../utils/menuStore';
import {
  fetchActiveSpecial,
  saveSpecial,
  unpublishSpecial,
  type WeeklySpecial,
} from '../../utils/weeklySpecial';
import { LANGS, emptyLoc } from './constants';

export default function SpecialEditor({ lang }: { lang: Language }) {
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
