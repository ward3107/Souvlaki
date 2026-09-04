// Cart model + pure helpers: persistence, line resolution, and building the
// WhatsApp order + kitchen-ticket URLs.
import { encodeTicket } from '../../utils/ticket';
import {
  WHATSAPP_NUMBER,
  getLocalized,
  formatPrice,
  type Lang,
  type MenuCategory,
} from '../../utils/menuData';
import type { MenuOverrides } from '../../utils/menuOverrides';
import { ORDER_INTRO, NAME_LABEL, TOTAL_LABEL, TICKET_HINT } from './labels';

export const CART_STORAGE_KEY = 'souvlaki-cart-v1';

export interface CartLine {
  itemId: string;
  variantId?: string;
  qty: number;
}

export interface ResolvedLine {
  key: string;
  itemId: string;
  variantId?: string;
  name: string;
  variantLabel?: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

export const lineKey = (itemId: string, variantId?: string) => `${itemId}::${variantId ?? ''}`;

export function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function resolveLine(
  line: CartLine,
  lang: Lang,
  overrides: MenuOverrides,
  categories: MenuCategory[]
): ResolvedLine | null {
  for (const cat of categories) {
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
    typeof window !== 'undefined' ? window.location.origin : 'https://www.greeksouflaki.com';
  return `${origin}/ticket#${encodeTicket(order)}`;
}

export function buildCartUrl(lang: Lang, lines: ResolvedLine[], name: string): string {
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
