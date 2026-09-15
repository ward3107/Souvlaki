import { Language } from '../types';

export const SITE_ORIGIN = 'https://www.greeksouflaki.com';
const LANGUAGE_PREFIX = /^\/(he|ar|ru|el)(?=\/|$)/;
type PublicPage = 'home' | 'menu';

// Security boundary for client navigation. Every value is a same-origin,
// compile-time constant; URL input is only used to select home or menu and is
// never copied into a navigation target.
const PUBLIC_PATHS: Record<Language, Record<PublicPage, string>> = {
  [Language.EN]: { home: '/', menu: '/menu' },
  [Language.HE]: { home: '/he', menu: '/he/menu' },
  [Language.AR]: { home: '/ar', menu: '/ar/menu' },
  [Language.RU]: { home: '/ru', menu: '/ru/menu' },
  [Language.EL]: { home: '/el', menu: '/el/menu' },
};

export const MENU_SEO: Record<Language, { title: string; description: string }> = {
  [Language.EN]: {
    title: 'Greek Souvlaki Menu | Kafr Yasif',
    description:
      'View the Greek Souvlaki Kafr Yasif menu: pita souvlaki from ₪30, gyros, platters, salads, vegan and gluten-free options. Order via WhatsApp.',
  },
  [Language.HE]: {
    title: 'תפריט סובלאקי יווני | כפר יאסיף',
    description:
      'צפו בתפריט סובלאקי יווני כפר יאסיף: סובלאקי בפיתה החל מ־30 ₪, גירוס, מגשים, סלטים ואפשרויות טבעוניות וללא גלוטן. הזמנה בוואטסאפ.',
  },
  [Language.AR]: {
    title: 'قائمة سوفلاكي يوناني | كفر ياسيف',
    description:
      'تصفّحوا قائمة سوفلاكي يوناني كفر ياسيف: سوفلاكي في بيتا من 30 شيكل، جيروس، صوانٍ، سلطات وخيارات نباتية وخالية من الغلوتين. الطلب عبر واتساب.',
  },
  [Language.RU]: {
    title: 'Меню Greek Souvlaki | Кафр-Ясиф',
    description:
      'Меню Greek Souvlaki в Кафр-Ясифе: сувлаки в пите от ₪30, гирос, блюда на компанию, салаты, веганские и безглютеновые варианты. Заказ в WhatsApp.',
  },
  [Language.EL]: {
    title: 'Μενού Greek Souvlaki | Καφρ Γιασίφ',
    description:
      'Δείτε το μενού του Greek Souvlaki στο Καφρ Γιασίφ: σουβλάκι σε πίτα από ₪30, γύρος, ποικιλίες, σαλάτες, βίγκαν και χωρίς γλουτένη επιλογές. Παραγγελία στο WhatsApp.',
  },
};

export function stripLanguagePrefix(pathname: string): string {
  const stripped = pathname.replace(LANGUAGE_PREFIX, '');
  if (!stripped || stripped === '/') return '/';
  return stripped.replace(/\/+$/, '') || '/';
}

export function localizedPublicPath(language: Language, pathname: string): string {
  const page: PublicPage = stripLanguagePrefix(pathname) === '/menu' ? 'menu' : 'home';
  return PUBLIC_PATHS[language]?.[page] ?? PUBLIC_PATHS[Language.EN][page];
}

export function canonicalUrl(language: Language, pathname: string): string {
  return `${SITE_ORIGIN}${localizedPublicPath(language, pathname)}`;
}

export function languageAlternates(pathname: string): Record<Language | 'x-default', string> {
  return {
    [Language.EN]: canonicalUrl(Language.EN, pathname),
    [Language.HE]: canonicalUrl(Language.HE, pathname),
    [Language.AR]: canonicalUrl(Language.AR, pathname),
    [Language.RU]: canonicalUrl(Language.RU, pathname),
    [Language.EL]: canonicalUrl(Language.EL, pathname),
    'x-default': canonicalUrl(Language.EN, pathname),
  };
}
