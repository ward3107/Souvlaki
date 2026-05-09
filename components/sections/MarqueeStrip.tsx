import { Language } from '../../types';
import { isRtlLang } from '../../utils/i18n';
import Marquee from '../Marquee';

const ITEMS_BY_LANG: Record<Language, string[]> = {
  [Language.AR]: ['أصيل', 'طازج', 'يومياً', 'يوناني', 'سوفلاكي', 'جيروس', 'كفر ياسيف'],
  [Language.HE]: ['אותנטי', 'טרי', 'יומי', 'יווני', 'סובלקי', 'גירוס', 'כפר יאסיף'],
  [Language.EL]: ['ΑΥΘΕΝΤΙΚΟ', 'ΦΡΕΣΚΟ', 'ΚΑΘΗΜΕΡΙΝΑ', 'ΕΛΛΗΝΙΚΟ', 'ΣΟΥΒΛΑΚΙ', 'ΓΥΡΟΣ'],
  [Language.RU]: ['АУТЕНТИЧНО', 'СВЕЖО', 'ЕЖЕДНЕВНО', 'ГРЕЧЕСКИЙ', 'СУВЛАКИ', 'ГИРОС'],
  [Language.EN]: [
    'AUTHENTIC',
    'FRESH DAILY',
    'FAMILY RECIPES',
    'GREEK',
    'SOUVLAKI',
    'GYROS',
    'KFAR YASIF',
  ],
};

interface Props {
  lang: Language;
}

export default function MarqueeStrip({ lang }: Props) {
  // RTL/LTR doesn't matter for picking items — just for visual direction in Marquee itself
  void isRtlLang(lang);
  const items = ITEMS_BY_LANG[lang] ?? ITEMS_BY_LANG[Language.EN];

  return (
    <Marquee
      items={items}
      className="font-display text-2xl md:text-3xl tracking-wide font-medium"
    />
  );
}
