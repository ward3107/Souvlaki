import { describe, it, expect, beforeEach } from 'vitest';
import { Sandwich } from 'lucide-react';
import {
  lineKey,
  loadCart,
  resolveLine,
  buildCartUrl,
  CART_STORAGE_KEY,
  type CartLine,
} from '../components/menu/cart';
import { WHATSAPP_NUMBER, type MenuCategory, type LocalizedString } from '../utils/menuData';

// Fill every language with the same string — enough for these logic tests.
const L = (s: string): LocalizedString => ({ en: s, he: s, ar: s, ru: s, el: s });

const categories: MenuCategory[] = [
  {
    id: 'cat1',
    name: L('Grill'),
    Icon: Sandwich,
    items: [
      {
        id: 'souvlaki',
        name: L('Souvlaki'),
        price: 40,
        variants: [{ id: 'lg', label: L('Large'), extra: 5 }],
      },
      { id: 'fries', name: L('Fries'), price: 15 },
    ],
  },
];

describe('lineKey', () => {
  it('encodes an item without a variant', () => {
    expect(lineKey('fries')).toBe('fries::');
  });
  it('encodes an item with a variant', () => {
    expect(lineKey('souvlaki', 'lg')).toBe('souvlaki::lg');
  });
});

describe('loadCart', () => {
  beforeEach(() => localStorage.clear());

  it('returns an empty array when nothing is stored', () => {
    expect(loadCart()).toEqual([]);
  });
  it('returns an empty array for malformed JSON', () => {
    localStorage.setItem(CART_STORAGE_KEY, '{not json');
    expect(loadCart()).toEqual([]);
  });
  it('returns an empty array when the stored value is not an array', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ nope: true }));
    expect(loadCart()).toEqual([]);
  });
  it('returns the stored lines when valid', () => {
    const lines: CartLine[] = [{ itemId: 'fries', qty: 2 }];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    expect(loadCart()).toEqual(lines);
  });
});

describe('resolveLine', () => {
  it('resolves a plain item at its base price', () => {
    const r = resolveLine({ itemId: 'fries', qty: 3 }, 'en', {}, categories);
    expect(r).toMatchObject({ name: 'Fries', unitPrice: 15, qty: 3, lineTotal: 45 });
  });

  it('adds the variant extra to the unit price', () => {
    const r = resolveLine({ itemId: 'souvlaki', variantId: 'lg', qty: 2 }, 'en', {}, categories);
    expect(r).toMatchObject({
      name: 'Souvlaki',
      variantLabel: 'Large',
      unitPrice: 45, // 40 base + 5 extra
      lineTotal: 90,
    });
  });

  it('applies an admin price override (plus any variant extra)', () => {
    const r = resolveLine(
      { itemId: 'souvlaki', variantId: 'lg', qty: 1 },
      'en',
      { souvlaki: { price: 30 } },
      categories
    );
    expect(r?.unitPrice).toBe(35); // 30 override + 5 extra
  });

  it('returns null for an unknown item', () => {
    expect(resolveLine({ itemId: 'ghost', qty: 1 }, 'en', {}, categories)).toBeNull();
  });
});

describe('buildCartUrl', () => {
  it('builds a WhatsApp link carrying the order, total and a ticket link', () => {
    const line = resolveLine(
      { itemId: 'souvlaki', variantId: 'lg', qty: 2 },
      'en',
      {},
      categories
    )!;
    const url = buildCartUrl('en', [line], 'Sam');

    expect(url.startsWith(`https://wa.me/${WHATSAPP_NUMBER}?text=`)).toBe(true);
    const text = decodeURIComponent(url.split('text=')[1]);
    expect(text).toContain('Sam'); // customer name
    expect(text).toContain('Souvlaki');
    expect(text).toContain('Large');
    expect(text).toContain('90'); // line total (45 × 2)
    expect(text).toContain('/ticket#'); // printable kitchen-ticket link
  });
});
