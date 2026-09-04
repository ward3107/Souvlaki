import { ShoppingBag } from 'lucide-react';
import { formatPrice, type Lang } from '../../utils/menuData';
import { ITEM_LABEL, ITEMS_LABEL, VIEW_ORDER_LABEL } from './labels';

export default function CartBar({
  count,
  total,
  lang,
  onOpen,
  isRtl,
}: {
  count: number;
  total: number;
  lang: Lang;
  onOpen: () => void;
  isRtl: boolean;
}) {
  const itemWord = count === 1 ? ITEM_LABEL[lang] : ITEMS_LABEL[lang];
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] w-[min(92vw,28rem)]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <button
        type="button"
        onClick={onOpen}
        className="w-full flex items-center justify-between gap-3 px-5 py-3 rounded-full bg-brand-terracotta-400 hover:bg-brand-terracotta-500 text-white shadow-lift transition-all active:scale-[0.98]"
      >
        <span className="inline-flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" aria-hidden="true" />
          <span className="font-semibold text-sm">
            {count} {itemWord}
          </span>
        </span>
        <span className="font-semibold text-sm">{VIEW_ORDER_LABEL[lang]}</span>
        <span className="font-display text-base font-semibold tabular-nums">
          {formatPrice(total)}
        </span>
      </button>
    </div>
  );
}
