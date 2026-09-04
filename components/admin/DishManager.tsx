import { useEffect, useState } from 'react';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { Language } from '../../types';
import { tx } from '../../utils/i18n';
import { CATEGORIES, getLocalized, formatPrice, type Lang } from '../../utils/menuData';
import {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuItemRecord,
} from '../../utils/menuStore';
import { emptyLoc } from './constants';
import { type DraftDish, recordToDraft } from './dish';
import DishForm from './DishForm';

export default function DishManager({ lang }: { lang: Language }) {
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
