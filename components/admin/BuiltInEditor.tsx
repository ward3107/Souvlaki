import { Language } from '../../types';
import { tx } from '../../utils/i18n';
import { MENU_CATEGORIES, getLocalized, formatPrice, type Lang } from '../../utils/menuData';
import { type MenuOverrides } from '../../utils/menuOverrides';

export default function BuiltInEditor({
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
