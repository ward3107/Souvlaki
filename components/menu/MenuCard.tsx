import { useEffect, useState } from 'react';
import { Sandwich, ChevronRight, Plus, RotateCcw, ZoomIn } from 'lucide-react';
import MenuImageLightbox from './MenuImageLightbox';
import { IMAGE_VIEW_LABEL } from './imageLightboxLabels';
import { motion } from 'framer-motion';
import { getLocalized, formatPrice, type Lang, type MenuItem } from '../../utils/menuData';
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
  const [imageOpen, setImageOpen] = useState(false);
  const name = getLocalized(item.name, lang);
  const desc = getLocalized(item.description, lang);
  const hasVariants = !!item.variants?.length;
  const basePrice = priceOverride ?? item.price;

  useEffect(() => {
    if (!isFlipped) return;
    const closeDetails = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFlipped(false);
    };
    window.addEventListener('keydown', closeDetails);
    return () => window.removeEventListener('keydown', closeDetails);
  }, [isFlipped]);

  // Adding also flips the card back to its front — a clean "added" confirmation
  // and it returns the deck to a tidy state.
  const handleAdd = (variantId?: string) => {
    if (soldOut) return;
    onAdd(item.id, variantId);
    setIsFlipped(false);
  };

  return (
    <div className="aspect-[4/5] sm:aspect-[3/4]">
      <div className="relative w-full h-full [perspective:1400px]">
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRONT — tap to flip to details */}
          <div
            className="group absolute inset-0 overflow-hidden rounded-3xl border border-brand-blue-900/10 bg-white text-start shadow-sm transition-shadow hover:shadow-soft dark:border-white/10 dark:bg-slate-800"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' as const }}
          >
            <button
              type="button"
              tabIndex={isFlipped ? -1 : 0}
              onClick={() => setIsFlipped(true)}
              aria-label={`${name} — ${getLocalized(DETAILS_HINT, lang)}`}
              className="absolute inset-0 z-0 cursor-pointer rounded-3xl focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-terracotta-400"
            />
            <div className="pointer-events-none relative z-[1] h-[62%] overflow-hidden bg-brand-cream-200 dark:bg-slate-700">
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.025] ${
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
                {item.badges?.slice(0, 2).map((b) => (
                  <Badge key={b} kind={b} lang={lang} />
                ))}
              </div>
              {item.image && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setImageOpen(true);
                  }}
                  aria-label={`${IMAGE_VIEW_LABEL[lang]} — ${name}`}
                  className="pointer-events-auto absolute bottom-2 start-2 z-10 inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-slate-950/80 px-2.5 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <ZoomIn className="h-4 w-4" aria-hidden="true" />
                  <span>{IMAGE_VIEW_LABEL[lang]}</span>
                </button>
              )}
              <div className="absolute bottom-2 end-2">
                <span className="rounded-xl bg-white/95 px-2.5 py-1.5 text-xs sm:text-sm font-bold text-brand-blue-800 shadow-sm whitespace-nowrap">
                  {hasVariants
                    ? `${getLocalized(FROM_LABEL, lang)} ${formatPrice(basePrice)}`
                    : formatPrice(basePrice)}
                </span>
              </div>
            </div>
            <div className="pointer-events-none relative z-[1] flex h-[38%] flex-col justify-between p-3.5 sm:p-4">
              <h4 className="font-display text-base sm:text-lg md:text-xl font-semibold text-brand-blue-900 dark:text-white tracking-tight leading-tight line-clamp-2">
                {name}
              </h4>
              <div className="text-xs sm:text-sm font-medium text-brand-terracotta-500 inline-flex items-center gap-1">
                <ChevronRight className="w-3 h-3 rtl:rotate-180" aria-hidden="true" />
                {getLocalized(DETAILS_HINT, lang)}
              </div>
            </div>
          </div>

          {/* BACK — dedicated back control keeps add buttons unambiguous. */}
          <div
            className="absolute inset-0 flex flex-col overflow-y-auto overscroll-contain rounded-3xl border border-brand-blue-900/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-800 sm:p-5"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden' as const,
              transform: 'rotateY(180deg)',
            }}
          >
            <button
              type="button"
              tabIndex={isFlipped ? 0 : -1}
              onClick={() => setIsFlipped(false)}
              aria-label={getLocalized(BACK_LABEL, lang)}
              className="absolute top-1.5 end-1.5 z-10 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-terracotta-400 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="flex items-baseline justify-between gap-2 pe-6 pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10">
              <h4 className="font-display text-sm sm:text-lg font-semibold text-gray-900 dark:text-white tracking-tight leading-tight line-clamp-2">
                {name}
              </h4>
              <span className="font-display text-sm sm:text-lg font-semibold text-brand-blue-500 whitespace-nowrap">
                {formatPrice(basePrice)}
              </span>
            </div>

            {desc && (
              <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-snug mb-2.5 line-clamp-3 sm:line-clamp-4">
                {desc}
              </p>
            )}

            {/* Actions don't flip the card — only add to cart */}
            <div className="mt-auto">
              {soldOut ? (
                <div className="w-full rounded-full bg-gray-100 dark:bg-slate-700 px-3.5 py-2 text-center text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {SOLD_OUT_LABEL[lang]}
                </div>
              ) : hasVariants ? (
                <>
                  <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                    {getLocalized(CHOOSE_HINT, lang)}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {item.variants!.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          handleAdd(v.id);
                        }}
                        className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 text-xs leading-tight text-center hover:bg-brand-terracotta-400 hover:text-white hover:border-brand-terracotta-400 transition-colors active:scale-95"
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
                  onClick={() => {
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
      <MenuImageLightbox
        open={imageOpen}
        src={item.image}
        name={name}
        lang={lang}
        onClose={() => setImageOpen(false)}
      />
    </div>
  );
}
