// Menu/MenuItem schema.org JSON-LD (SEO / AI answer engines).
import { getLocalized, type Lang, type MenuCategory } from '../../utils/menuData';
import type { MenuOverrides } from '../../utils/menuOverrides';

export function buildMenuSchema(categories: MenuCategory[], overrides: MenuOverrides, lang: Lang) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.greeksouflaki.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${origin}/menu#menu`,
    name: getLocalized(
      {
        en: 'Greek Souvlaki Kafr Yasif — Menu',
        he: 'תפריט סובלאקי יווני כפר יאסיף',
        ar: 'قائمة سوفلاكي يوناني كفر ياسيف',
        ru: 'Меню Greek Souvlaki Кафр-Ясиф',
        el: 'Μενού Greek Souvlaki Καφρ Γιασίφ',
      },
      lang
    ),
    url: `${origin}${lang === 'en' ? '/menu' : `/${lang}/menu`}`,
    inLanguage: lang,
    provider: { '@id': `${origin}/#restaurant` },
    hasMenuSection: categories.map((cat) => ({
      '@type': 'MenuSection',
      name: getLocalized(cat.name, lang),
      hasMenuItem: cat.items.map((item) => {
        const ov = overrides[item.id] ?? {};
        const price = ov.price ?? item.price;
        return {
          '@type': 'MenuItem',
          name: getLocalized(item.name, lang),
          ...(item.description ? { description: getLocalized(item.description, lang) } : {}),
          offers: {
            '@type': 'Offer',
            price: String(price),
            priceCurrency: 'ILS',
            availability: ov.soldOut ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
          },
          ...(item.badges?.some((badge) => badge === 'vegan' || badge === 'gf')
            ? {
                suitableForDiet: item.badges
                  .filter((badge) => badge === 'vegan' || badge === 'gf')
                  .map((badge) =>
                    badge === 'vegan'
                      ? 'https://schema.org/VeganDiet'
                      : 'https://schema.org/GlutenFreeDiet'
                  ),
              }
            : {}),
        };
      }),
    })),
  };
}
