import { useState } from 'react';
import { Sandwich, ChevronRight, Plus, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { getLocalized, formatPrice, type Lang, type MenuItem } from '../../utils/menuData';
import { useTilt3D } from '../hooks/useTilt3D';
import Badge from './Badge';
import {
  DETAILS_HINT,
  SOLD_OUT_LABEL,
  FROM_LABEL,
  BACK_LABEL,
  CHOOSE_HINT,
  ADD_LABEL,
} from './labels';

export default function MenuCard({
  item,
  lang,
  onAdd,
  soldOut,
  priceOverride,
}: {
  item: MenuItem;
  lang: Lang;
  onAdd: (itemId: string, variantId?: string) => void;
  soldOut: boolean;
  priceOverride?: number;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const {
    ref: tiltRef,
    innerRef: tiltInnerRef,
    style: tiltOuterStyle,
    innerStyle: tiltInnerStyle,
    handlers: tiltHandlers,
  } = useTilt3D<HTMLDivElement>({ max: 6, scale: 1.02, perspective: 1400 });
  const name = getLocalized(item.name, lang);
  const desc = getLocalized(item.description, lang);
  const hasVariants = !!item.variants?.length;
  const basePrice = priceOverride ?? item.price;

  // Adding also flips the card back to its front — a clean "added" confirmation
  // and it returns the deck to a tidy state.
  const handleAdd = (variantId?: string) => {
    if (soldOut) return;
    onAdd(item.id, variantId);
    setIsFlipped(false);
  };

  return (
    <div
      ref={tiltRef}
      style={tiltOuterStyle}
      {...tiltHandlers}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && isFlipped) setIsFlipped(false);
      }}
      className="aspect-[3/4]"
    >
      <div ref={tiltInnerRef} style={tiltInnerStyle} className="relative w-full h-full">
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRONT — tap to flip to details */}
          <button
            type="button"
            onClick={() => setIsFlipped(true)}
            aria-label={`${name} — ${getLocalized(DETAILS_HINT, lang)}`}
            className="absolute inset-0 rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10 shadow-soft hover:shadow-pop overflow-hidden text-start transition-shadow group"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' as const }}
          >
            <div className="relative h-[62%] overflow-hidden bg-brand-cream-200 dark:bg-slate-700">
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    soldOut ? 'grayscale opacity-60' : ''
                  }`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Sandwich
                    className="w-12 h-12 text-brand-blue-200 dark:text-slate-500"
                    aria-hidden="true"
                  />
                </div>
              )}
              {/* Legibility scrim so the price pill always reads on busy photos */}
              <div
                className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent pointer-events-none"
                aria-hidden="true"
              />
              {soldOut && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    {SOLD_OUT_LABEL[lang]}
                  </span>
                </div>
              )}
              <div className="absolute top-2 end-2 flex flex-col items-end gap-1">
                {item.badges?.map((b) => (
                  <Badge key={b} kind={b} lang={lang} />
                ))}
              </div>
              <div className="absolute bottom-2 end-2">
                <span className="bg-brand-terracotta-400 text-white px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold shadow-soft whitespace-nowrap">
                  {hasVariants
                    ? `${getLocalized(FROM_LABEL, lang)} ${formatPrice(basePrice)}`
                    : formatPrice(basePrice)}
                </span>
              </div>
            </div>
            <div className="p-2.5 sm:p-4 h-[38%] flex flex-col justify-between">
              <h4 className="font-display text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white tracking-tight leading-tight line-clamp-2">
                {name}
              </h4>
              <div className="text-[10px] sm:text-[11px] font-medium text-brand-terracotta-500 inline-flex items-center gap-1">
                <ChevronRight className="w-3 h-3 rtl:rotate-180" aria-hidden="true" />
                {getLocalized(DETAILS_HINT, lang)}
              </div>
            </div>
          </button>

          {/* BACK — tap anywhere (outside the add controls) to flip back */}
          <div
            role="button"
            tabIndex={-1}
            onClick={() => setIsFlipped(false)}
            aria-label={getLocalized(BACK_LABEL, lang)}
            className="absolute inset-0 rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10 shadow-pop p-3 sm:p-5 flex flex-col cursor-pointer overflow-y-auto overscroll-contain"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden' as const,
              transform: 'rotateY(180deg)',
            }}
          >
            <div
              className="absolute top-2 end-2 text-gray-300 dark:text-slate-600"
              aria-hidden="true"
            >
              <RotateCcw className="w-4 h-4" />
            </div>

            <div className="flex items-baseline justify-between gap-2 pe-6 pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10">
              <h4 className="font-display text-sm sm:text-lg font-semibold text-gray-900 dark:text-white tracking-tight leading-tight line-clamp-2">
                {name}
              </h4>
              <span className="font-display text-sm sm:text-lg font-semibold text-brand-blue-500 whitespace-nowrap">
                {formatPrice(basePrice)}
              </span>
            </div>

            {desc && (
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 italic leading-snug mb-2.5 line-clamp-3 sm:line-clamp-4">
                {desc}
              </p>
            )}

            {/* Actions don't flip the card — only add to cart */}
            <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
              {soldOut ? (
                <div className="w-full rounded-full bg-gray-100 dark:bg-slate-700 px-3.5 py-2 text-center text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {SOLD_OUT_LABEL[lang]}
                </div>
              ) : hasVariants ? (
                <>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                    {getLocalized(CHOOSE_HINT, lang)}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {item.variants!.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(v.id);
                        }}
                        className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 text-[11px] leading-tight text-center hover:bg-brand-terracotta-400 hover:text-white hover:border-brand-terracotta-400 transition-colors active:scale-95"
                      >
                        <Plus className="w-3 h-3 shrink-0" aria-hidden="true" />
                        <span>{v.label[lang]}</span>
                        {v.extra ? (
                          <span className="text-[10px] opacity-70">+{v.extra}</span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd();
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-brand-terracotta-400 hover:bg-brand-terracotta-500 text-white text-xs sm:text-sm font-semibold shadow-soft transition-all active:scale-[0.97]"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>{getLocalized(ADD_LABEL, lang)}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
