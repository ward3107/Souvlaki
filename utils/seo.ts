import { Language } from '../types';

export const SITE_ORIGIN = 'https://www.greeksouflaki.com';
const LANGUAGE_PREFIX = /^\/(he|ar|ru|el)(?=\/|$)/;

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
  const page = stripLanguagePrefix(pathname);
  const suffix = page === '/' ? '/' : page;
  if (language === Language.EN) return suffix;
  return suffix === '/' ? `/${language}` : `/${language}${suffix}`;
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
