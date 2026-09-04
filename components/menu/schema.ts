// Menu/MenuItem schema.org JSON-LD (SEO / AI answer engines).
import { getLocalized, type MenuCategory } from '../../utils/menuData';
import type { MenuOverrides } from '../../utils/menuOverrides';

export function buildMenuSchema(categories: MenuCategory[], overrides: MenuOverrides) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.greeksouflaki.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Greek Souvlaki Kfar Yasif — Menu',
    url: `${origin}/menu`,
    inLanguage: ['en', 'he', 'ar', 'ru', 'el'],
    hasMenuSection: categories.map((cat) => ({
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
