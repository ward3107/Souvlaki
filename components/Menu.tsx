import { useEffect, useMemo, useState } from 'react';
import {
  Sandwich,
  Star,
  ChevronRight,
  Plus,
  Minus,
  ShoppingBag,
  X,
  Trash2,
  RotateCcw,
  Search,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Language } from '../types';
import Reveal from './Reveal';
import { useTilt3D } from './hooks/useTilt3D';
import { useBackClose } from './hooks/useBackClose';
import IngredientFloaters from './IngredientFloaters';
import { encodeTicket } from '../utils/ticket';
import { track } from '../utils/analytics';
import {
  MENU_CATEGORIES,
  BADGE_LABELS,
  FILTERABLE_BADGES,
  WHATSAPP_NUMBER,
  getLocalized,
  formatPrice,
  type Lang,
  type LocalizedString,
  type BadgeKey,
  type MenuItem,
  type MenuAddon,
} from '../utils/menuData';
import { getOverrides, MENU_OVERRIDES_EVENT, type MenuOverrides } from '../utils/menuOverrides';
import { recordOrder } from '../utils/orders';

// ============================================================================
// Static i18n
// ============================================================================

const SECTION_TITLES: Record<Lang, { title: string; subtitle: string }> = {
  en: { title: 'Our Menu', subtitle: 'Authentic Greek flavors made with love' },
  he: { title: 'התפריט שלנו', subtitle: 'טעמים יווניים אותנטיים עשויים באהבה' },
  ar: { title: 'قائمتنا', subtitle: 'نكهات يونانية أصلية مصنوعة بحب' },
  ru: { title: 'Наше меню', subtitle: 'Настоящие греческие вкусы, приготовленные с любовью' },
  el: { title: 'Το μενού μας', subtitle: 'Αυθεντικές ελληνικές γεύσεις φτιαγμένες με αγάπη' },
};

const SCROLL_HINT: LocalizedString = {
  en: 'Swipe for more categories',
  he: 'גלול לעוד קטגוריות',
  ar: 'مرّر للمزيد من الفئات',
  ru: 'Листайте для других категорий',
  el: 'Σαρώστε για περισσότερες κατηγορίες',
};

const CHOOSE_HINT: LocalizedString = {
  en: 'Tap a choice to order',
  he: 'הקש על אפשרות להזמין',
  ar: 'اضغط على اختيار للطلب',
  ru: 'Нажмите на вариант, чтобы заказать',
  el: 'Πατήστε επιλογή για παραγγελία',
};

const FROM_LABEL: LocalizedString = {
  en: 'from',
  he: 'מ-',
  ar: 'من',
  ru: 'от',
  el: 'από',
};

const ADDONS_LABEL: LocalizedString = {
  en: 'Add-ons',
  he: 'תוספות',
  ar: 'إضافات',
  ru: 'Дополнения',
  el: 'Προσθήκες',
};

const ORDER_INTRO: LocalizedString = {
  en: "Hi! I'd like to order:",
  he: 'היי, אשמח להזמין:',
  ar: 'مرحبًا، أود الطلب:',
  ru: 'Здравствуйте, хочу заказать:',
  el: 'Γεια, θα ήθελα να παραγγείλω:',
};

const ADD_LABEL: LocalizedString = {
  en: 'Add',
  he: 'הוסף',
  ar: 'أضف',
  ru: 'Добавить',
  el: 'Προσθήκη',
};

const DETAILS_HINT: LocalizedString = {
  en: 'Tap for details',
  he: 'הקש לפרטים',
  ar: 'اضغط للتفاصيل',
  ru: 'Нажмите для деталей',
  el: 'Πατήστε για λεπτομέρειες',
};

const BACK_LABEL: LocalizedString = {
  en: 'Back',
  he: 'חזור',
  ar: 'رجوع',
  ru: 'Назад',
  el: 'Πίσω',
};

const YOUR_ORDER_LABEL: LocalizedString = {
  en: 'Your order',
  he: 'ההזמנה שלך',
  ar: 'طلبك',
  ru: 'Ваш заказ',
  el: 'Η παραγγελία σας',
};

const ITEM_LABEL: LocalizedString = {
  en: 'item',
  he: 'פריט',
  ar: 'عنصر',
  ru: 'позиция',
  el: 'είδος',
};

const ITEMS_LABEL: LocalizedString = {
  en: 'items',
  he: 'פריטים',
  ar: 'عناصر',
  ru: 'позиций',
  el: 'είδη',
};

const TOTAL_LABEL: LocalizedString = {
  en: 'Total',
  he: 'סה״כ',
  ar: 'الإجمالي',
  ru: 'Итого',
  el: 'Σύνολο',
};

const SEND_ORDER_LABEL: LocalizedString = {
  en: 'Send via WhatsApp',
  he: 'שלח בוואטסאפ',
  ar: 'إرسال عبر واتساب',
  ru: 'Отправить в WhatsApp',
  el: 'Αποστολή στο WhatsApp',
};

const CLEAR_CART_LABEL: LocalizedString = {
  en: 'Clear',
  he: 'נקה',
  ar: 'مسح',
  ru: 'Очистить',
  el: 'Εκκαθάριση',
};

const CLOSE_LABEL: LocalizedString = {
  en: 'Close',
  he: 'סגור',
  ar: 'إغلاق',
  ru: 'Закрыть',
  el: 'Κλείσιμο',
};

const VIEW_ORDER_LABEL: LocalizedString = {
  en: 'View order',
  he: 'הצג הזמנה',
  ar: 'عرض الطلب',
  ru: 'Посмотреть заказ',
  el: 'Δείτε παραγγελία',
};

const EMPTY_CART_LABEL: LocalizedString = {
  en: 'Your order is empty.',
  he: 'ההזמנה שלך ריקה.',
  ar: 'طلبك فارغ.',
  ru: 'Ваш заказ пуст.',
  el: 'Η παραγγελία σας είναι κενή.',
};

const REMOVE_ARIA: LocalizedString = {
  en: 'Remove',
  he: 'הסר',
  ar: 'إزالة',
  ru: 'Удалить',
  el: 'Αφαίρεση',
};

const INCREASE_ARIA: LocalizedString = {
  en: 'Increase quantity',
  he: 'הגדל כמות',
  ar: 'زيادة الكمية',
  ru: 'Увеличить количество',
  el: 'Αύξηση ποσότητας',
};

const DECREASE_ARIA: LocalizedString = {
  en: 'Decrease quantity',
  he: 'הקטן כמות',
  ar: 'إنقاص الكمية',
  ru: 'Уменьшить количество',
  el: 'Μείωση ποσότητας',
};

const SEARCH_PLACEHOLDER: LocalizedString = {
  en: 'Search the menu…',
  he: 'חיפוש בתפריט…',
  ar: 'ابحث في القائمة…',
  ru: 'Поиск по меню…',
  el: 'Αναζήτηση στο μενού…',
};

const NO_RESULTS: LocalizedString = {
  en: 'No dishes match your search.',
  he: 'לא נמצאו מנות התואמות לחיפוש.',
  ar: 'لا توجد أطباق تطابق بحثك.',
  ru: 'Ничего не найдено.',
  el: 'Δεν βρέθηκαν πιάτα.',
};

const RESULTS_LABEL: LocalizedString = {
  en: 'results',
  he: 'תוצאות',
  ar: 'نتائج',
  ru: 'результатов',
  el: 'αποτελέσματα',
};

const CLEAR_FILTERS_LABEL: LocalizedString = {
  en: 'Clear',
  he: 'נקה',
  ar: 'مسح',
  ru: 'Сбросить',
  el: 'Καθαρισμός',
};

const SOLD_OUT_LABEL: LocalizedString = {
  en: 'Sold out',
  he: 'אזל מהמלאי',
  ar: 'نفد',
  ru: 'Нет в наличии',
  el: 'Εξαντλήθηκε',
};

// ============================================================================
// Cart helpers
// ============================================================================

const CART_STORAGE_KEY = 'souvlaki-cart-v1';

interface CartLine {
  itemId: string;
  variantId?: string;
  qty: number;
}

interface ResolvedLine {
  key: string;
  itemId: string;
  variantId?: string;
  name: string;
  variantLabel?: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

const lineKey = (itemId: string, variantId?: string) => `${itemId}::${variantId ?? ''}`;

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function resolveLine(line: CartLine, lang: Lang, overrides: MenuOverrides): ResolvedLine | null {
  for (const cat of MENU_CATEGORIES) {
    const item = cat.items.find((i) => i.id === line.itemId);
    if (!item) continue;
    const variant = line.variantId
      ? item.variants?.find((v) => v.id === line.variantId)
      : undefined;
    const basePrice = overrides[item.id]?.price ?? item.price;
    const unitPrice = basePrice + (variant?.extra ?? 0);
    return {
      key: lineKey(line.itemId, line.variantId),
      itemId: line.itemId,
      variantId: line.variantId,
      name: getLocalized(item.name, lang),
      variantLabel: variant ? getLocalized(variant.label, lang) : undefined,
      unitPrice,
      qty: line.qty,
      lineTotal: unitPrice * line.qty,
    };
  }
  return null;
}

const NAME_LABEL: LocalizedString = {
  he: 'שם',
  en: 'Name',
  ar: 'الاسم',
  ru: 'Имя',
  el: 'Όνομα',
};

const NAME_PLACEHOLDER: LocalizedString = {
  he: 'השם שלך (חובה)',
  en: 'Your name (required)',
  ar: 'اسمك (مطلوب)',
  ru: 'Ваше имя (обязательно)',
  el: 'Το όνομά σας (απαιτείται)',
};

const TICKET_HINT: LocalizedString = {
  he: '🖨️ כרטיס מטבח (הקש להדפסה):',
  en: '🖨️ Kitchen ticket (tap to print):',
  ar: '🖨️ تذكرة المطبخ (اضغط للطباعة):',
  ru: '🖨️ Кухонный чек (нажмите, чтобы напечатать):',
  el: '🖨️ Δελτίο κουζίνας (πατήστε για εκτύπωση):',
};

// A no-backend /ticket link carrying the whole order in its hash, appended to
// the WhatsApp message so the owner can open + print an itemized kitchen ticket.
function buildTicketUrl(lines: ResolvedLine[], name: string): string {
  const order = {
    n: name,
    t: lines.reduce((sum, l) => sum + l.lineTotal, 0),
    at: Date.now(),
    items: lines.map((l) => ({ q: l.qty, n: l.name, v: l.variantLabel, p: l.lineTotal })),
  };
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://souvlaki.pages.dev';
  return `${origin}/ticket#${encodeTicket(order)}`;
}

function buildCartUrl(lang: Lang, lines: ResolvedLine[], name: string): string {
  const header = ORDER_INTRO[lang];
  const nameLine = `${NAME_LABEL[lang]}: ${name}`;
  const body = lines
    .map((l) => {
      const variant = l.variantLabel ? ` — ${l.variantLabel}` : '';
      return `• ${l.qty}× ${l.name}${variant} (${formatPrice(l.lineTotal)})`;
    })
    .join('\n');
  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const footer = `${TOTAL_LABEL[lang]}: ${formatPrice(total)}`;
  const ticket = `${TICKET_HINT[lang]}\n${buildTicketUrl(lines, name)}`;
  const text = `${header}\n\n${nameLine}\n\n${body}\n\n${footer}\n\n${ticket}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// Inline WhatsApp glyph (Lucide doesn't ship one)
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

// ============================================================================
// Menu/MenuItem schema.org JSON-LD (SEO / AI answer engines)
// ============================================================================

function buildMenuSchema(overrides: MenuOverrides) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://souvlaki.pages.dev';
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Greek Souvlaki Kfar Yasif — Menu',
    url: `${origin}/menu`,
    inLanguage: ['en', 'he', 'ar', 'ru', 'el'],
    hasMenuSection: MENU_CATEGORIES.map((cat) => ({
      '@type': 'MenuSection',
      name: getLocalized(cat.name, 'en'),
      hasMenuItem: cat.items.map((item) => {
        const ov = overrides[item.id] ?? {};
        const price = ov.price ?? item.price;
        return {
          '@type': 'MenuItem',
          name: getLocalized(item.name, 'en'),
          ...(item.description ? { description: getLocalized(item.description, 'en') } : {}),
          offers: {
            '@type': 'Offer',
            price: String(price),
            priceCurrency: 'ILS',
            availability: ov.soldOut ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
          },
          ...(item.badges?.includes('vegan')
            ? { suitableForDiet: 'https://schema.org/VeganDiet' }
            : {}),
          ...(item.badges?.includes('gf')
            ? { suitableForDiet: 'https://schema.org/GlutenFreeDiet' }
            : {}),
        };
      }),
    })),
  };
}

// ============================================================================
// Subcomponents
// ============================================================================

function Badge({ kind, lang }: { kind: BadgeKey; lang: Lang }) {
  const styles: Record<BadgeKey, string> = {
    popular:
      'bg-brand-terracotta-50 text-brand-terracotta-500 dark:bg-brand-terracotta-400/15 dark:text-brand-terracotta-200',
    gf: 'bg-brand-blue-50 text-brand-blue-500 dark:bg-brand-blue-900/30 dark:text-brand-blue-300',
    vegan: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    spicy: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300',
    new: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  };
  const showStar = kind === 'popular';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${styles[kind]}`}
    >
      {showStar && <Star className="w-3 h-3 fill-current" aria-hidden="true" />}
      {BADGE_LABELS[kind][lang]}
    </span>
  );
}

function MenuCard({
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

function CartBar({
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

function CartSheet({
  lines,
  total,
  lang,
  isRtl,
  onClose,
  onInc,
  onDec,
  onRemove,
  onClear,
  onSend,
  customerName,
  onNameChange,
}: {
  lines: ResolvedLine[];
  total: number;
  lang: Lang;
  isRtl: boolean;
  onClose: () => void;
  onInc: (key: string) => void;
  onDec: (key: string) => void;
  onRemove: (key: string) => void;
  onClear: () => void;
  onSend: () => void;
  customerName: string;
  onNameChange: (v: string) => void;
}) {
  // Mobile Back button closes the cart instead of navigating away.
  useBackClose(true, onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={getLocalized(YOUR_ORDER_LABEL, lang)}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full md:w-[28rem] max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-t-2xl md:rounded-2xl shadow-lift">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
            {YOUR_ORDER_LABEL[lang]}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={getLocalized(CLOSE_LABEL, lang)}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              {EMPTY_CART_LABEL[lang]}
            </p>
          ) : (
            <ul className="space-y-3">
              {lines.map((l) => (
                <li key={l.key} className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {l.name}
                    </div>
                    {l.variantLabel && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {l.variantLabel}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 tabular-nums">
                      {formatPrice(l.unitPrice)} × {l.qty} ={' '}
                      <span className="font-semibold text-brand-blue-500">
                        {formatPrice(l.lineTotal)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onDec(l.key)}
                      aria-label={getLocalized(DECREASE_ARIA, lang)}
                      className="p-1.5 rounded-full border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                      <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold tabular-nums">
                      {l.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onInc(l.key)}
                      aria-label={getLocalized(INCREASE_ARIA, lang)}
                      className="p-1.5 rounded-full border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(l.key)}
                      aria-label={getLocalized(REMOVE_ARIA, lang)}
                      className="ms-1 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-gray-200 dark:border-slate-700 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                {TOTAL_LABEL[lang]}
              </span>
              <span className="font-display text-2xl font-semibold text-brand-blue-500 tabular-nums">
                {formatPrice(total)}
              </span>
            </div>
            <input
              type="text"
              value={customerName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={NAME_PLACEHOLDER[lang]}
              aria-label={NAME_LABEL[lang]}
              autoComplete="name"
              required
              className="w-full px-4 py-2.5 rounded-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta-300"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClear}
                className="px-3 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                {CLEAR_CART_LABEL[lang]}
              </button>
              <button
                type="button"
                onClick={onSend}
                disabled={!customerName.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-brand-terracotta-400 hover:bg-brand-terracotta-500 text-white text-sm font-semibold shadow-soft transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <WhatsAppGlyph className="w-4 h-4" />
                <span>{SEND_ORDER_LABEL[lang]}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AddOnsList({ addons, lang }: { addons: MenuAddon[]; lang: Lang }) {
  return (
    <div className="mt-6 pt-5 border-t border-dashed border-gray-300 dark:border-slate-700">
      <div className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 mb-2">
        {ADDONS_LABEL[lang]}
      </div>
      <ul className="space-y-1">
        {addons.map((a) => (
          <li
            key={a.id}
            className="flex items-baseline justify-between gap-3 text-sm text-gray-600 dark:text-gray-300"
          >
            <span>{getLocalized(a.name, lang)}</span>
            <span className="font-semibold text-brand-terracotta-500 whitespace-nowrap">
              {a.price}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// Main component
// ============================================================================

interface MenuProps {
  language: Language;
  id?: string;
}

export default function Menu({ language, id = 'menu' }: MenuProps) {
  const [activeId, setActiveId] = useState<string>(MENU_CATEGORIES[0].id);
  const [cart, setCart] = useState<CartLine[]>(() => loadCart());
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [query, setQuery] = useState('');
  const [activeBadges, setActiveBadges] = useState<BadgeKey[]>([]);
  const [overrides, setOverrides] = useState<MenuOverrides>({});
  const lang = language as Lang;
  const isRtl = lang === 'he' || lang === 'ar';
  const titles = SECTION_TITLES[lang] ?? SECTION_TITLES.en;
  const active = MENU_CATEGORIES.find((c) => c.id === activeId) ?? MENU_CATEGORIES[0];

  // Keep menu availability/prices in sync with the /admin editor. With Supabase
  // that means all visitors; the localStorage fallback syncs across tabs. We
  // refresh on mount, when the tab regains focus (so a returning customer sees
  // current availability), and on the local change events.
  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      getOverrides().then((o) => {
        if (!cancelled) setOverrides(o);
      });
    };
    refresh();
    window.addEventListener(MENU_OVERRIDES_EVENT, refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      cancelled = true;
      window.removeEventListener(MENU_OVERRIDES_EVENT, refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  // Persist the cart so a refresh (or accidental navigation) never loses an
  // order in progress.
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore quota / private-mode failures
    }
  }, [cart]);

  // Inject Menu/MenuItem JSON-LD for SEO while the menu page is mounted.
  useEffect(() => {
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'menu-schema';
    el.textContent = JSON.stringify(buildMenuSchema(overrides));
    document.head.appendChild(el);
    return () => {
      el.remove();
    };
  }, [overrides]);

  const resolvedLines = useMemo(
    () =>
      cart.map((l) => resolveLine(l, lang, overrides)).filter((l): l is ResolvedLine => l !== null),
    [cart, lang, overrides]
  );
  const itemCount = resolvedLines.reduce((sum, l) => sum + l.qty, 0);
  const cartTotal = resolvedLines.reduce((sum, l) => sum + l.lineTotal, 0);

  const isFiltering = query.trim().length > 0 || activeBadges.length > 0;

  // Flat, cross-category result set when the visitor is searching or filtering.
  const filteredItems = useMemo(() => {
    if (!isFiltering) return [];
    const q = query.trim().toLowerCase();
    const results: MenuItem[] = [];
    for (const cat of MENU_CATEGORIES) {
      for (const item of cat.items) {
        if (activeBadges.length > 0 && !activeBadges.every((b) => item.badges?.includes(b))) {
          continue;
        }
        if (q) {
          const haystack = `${getLocalized(item.name, lang)} ${getLocalized(
            item.description,
            lang
          )} ${getLocalized(item.name, 'en')}`.toLowerCase();
          if (!haystack.includes(q)) continue;
        }
        results.push(item);
      }
    }
    return results;
  }, [isFiltering, query, activeBadges, lang]);

  const toggleBadge = (b: BadgeKey) =>
    setActiveBadges((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  const clearFilters = () => {
    setQuery('');
    setActiveBadges([]);
  };

  const handleAdd = (itemId: string, variantId?: string) => {
    track('menu_add_to_cart', { item_id: itemId, variant: variantId ?? '' });
    setCart((prev) => {
      const idx = prev.findIndex((l) => l.itemId === itemId && l.variantId === variantId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { itemId, variantId, qty: 1 }];
    });
  };

  const adjustQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) => (lineKey(l.itemId, l.variantId) === key ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0)
    );
  };

  const removeLine = (key: string) => {
    setCart((prev) => prev.filter((l) => lineKey(l.itemId, l.variantId) !== key));
  };

  const clearCart = () => {
    setCart([]);
    setCartOpen(false);
  };

  const sendOrder = () => {
    if (resolvedLines.length === 0) return;
    if (!customerName.trim()) return;
    const name = customerName.trim();
    track('order_whatsapp', {
      value: cartTotal,
      currency: 'ILS',
      items: itemCount,
    });
    // Persist to order history (no-op unless Supabase is configured); never let
    // it block or delay the WhatsApp handoff.
    void recordOrder({
      customerName: name,
      total: cartTotal,
      items: resolvedLines.map((l) => ({
        q: l.qty,
        n: l.name,
        v: l.variantLabel,
        p: l.lineTotal,
      })),
      lang,
    });
    const url = buildCartUrl(lang, resolvedLines, name);
    window.open(url, '_blank', 'noopener,noreferrer');
    // The order handed off to WhatsApp — reset so returning to the tab doesn't
    // show a stale cart the customer might re-send as a duplicate.
    setCart([]);
    setCustomerName('');
    setCartOpen(false);
  };

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCartOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [cartOpen]);

  // Signal to other floating widgets (share, rating) to step aside so the
  // checkout CTA owns the bottom of the screen while the cart has items.
  useEffect(() => {
    if (itemCount === 0) return;
    document.body.classList.add('cart-active');
    return () => document.body.classList.remove('cart-active');
  }, [itemCount]);

  const renderCard = (item: MenuItem, key: string, delay: number) => {
    const ov = overrides[item.id] ?? {};
    return (
      <Reveal key={key} delay={delay} y={20}>
        <MenuCard
          item={item}
          lang={lang}
          onAdd={handleAdd}
          soldOut={!!ov.soldOut}
          priceOverride={ov.price}
        />
      </Reveal>
    );
  };

  return (
    <section
      id={id}
      className="relative py-20 px-4 bg-brand-cream-100 dark:bg-slate-900 overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <IngredientFloaters />
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">
              {titles.title}
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              {titles.subtitle}
            </p>
          </div>
        </Reveal>

        {/* Search + dietary filters */}
        <div className="mb-4 max-w-2xl mx-auto">
          <div className="relative">
            <Search
              className="absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={SEARCH_PLACEHOLDER[lang]}
              aria-label={SEARCH_PLACEHOLDER[lang]}
              className="w-full ps-11 pe-4 py-2.5 rounded-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta-300"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {FILTERABLE_BADGES.map((b) => {
              const on = activeBadges.includes(b);
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBadge(b)}
                  aria-pressed={on}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    on
                      ? 'bg-brand-blue-500 text-white'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-brand-blue-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {BADGE_LABELS[b][lang]}
                </button>
              );
            })}
            {isFiltering && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-brand-terracotta-500 hover:underline"
              >
                {CLEAR_FILTERS_LABEL[lang]} ✕
              </button>
            )}
          </div>
        </div>

        {isFiltering ? (
          /* Flat, cross-category results */
          <div className="mt-4 pb-24">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-5">
              {filteredItems.length} {RESULTS_LABEL[lang]}
            </p>
            {filteredItems.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-16">
                {NO_RESULTS[lang]}
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {filteredItems.map((item, idx) =>
                  renderCard(item, `search-${item.id}`, idx * 0.03)
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Category tabs (sticky) */}
            <div className="mb-2 sticky top-20 z-20 -mx-4 px-4 py-3 bg-brand-cream-100/90 dark:bg-slate-900/90 backdrop-blur-sm">
              <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
                {MENU_CATEGORIES.map((cat) => {
                  const Icon = cat.Icon;
                  const activeTab = activeId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveId(cat.id)}
                      aria-pressed={activeTab}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95
                        ${
                          activeTab
                            ? 'bg-brand-blue-500 text-white shadow-soft'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-brand-blue-50 dark:hover:bg-slate-700'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span>{getLocalized(cat.name, lang)}</span>
                    </button>
                  );
                })}
              </div>
              <div className="md:hidden text-center text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
                {SCROLL_HINT[lang]}
              </div>
            </div>

            {/* Items grid — 3D flip cards */}
            <div className="mt-6 pb-24">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {active.items.map((item, idx) =>
                  renderCard(item, `${active.id}-${item.id}`, idx * 0.05)
                )}
              </div>
              {active.addons && active.addons.length > 0 && (
                <div className="mt-6 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-slate-700/60 px-6 md:px-8 py-2">
                  <AddOnsList addons={active.addons} lang={lang} />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {itemCount > 0 && !cartOpen && (
        <CartBar
          count={itemCount}
          total={cartTotal}
          lang={lang}
          isRtl={isRtl}
          onOpen={() => setCartOpen(true)}
        />
      )}

      {cartOpen && (
        <CartSheet
          lines={resolvedLines}
          total={cartTotal}
          lang={lang}
          isRtl={isRtl}
          onClose={() => setCartOpen(false)}
          onInc={(k) => adjustQty(k, 1)}
          onDec={(k) => adjustQty(k, -1)}
          onRemove={removeLine}
          onClear={clearCart}
          onSend={sendOrder}
          customerName={customerName}
          onNameChange={setCustomerName}
        />
      )}
    </section>
  );
}
