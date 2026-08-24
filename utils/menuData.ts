import {
  Sandwich,
  UtensilsCrossed,
  Beef,
  Pizza,
  Salad,
  Cookie,
  CupSoda,
  Wine,
  type LucideIcon,
} from 'lucide-react';

// ============================================================================
// Single source of truth for the menu.
//
// Extracted from the Menu component so the same data drives: the interactive
// menu, the /admin availability + price editor, and the Menu/MenuItem
// schema.org JSON-LD for SEO. Nothing here touches the DOM or React state.
// ============================================================================

export type Lang = 'en' | 'he' | 'ar' | 'ru' | 'el';
export type LocalizedString = Record<Lang, string>;
export type BadgeKey = 'popular' | 'gf' | 'vegan' | 'spicy' | 'new';

export interface Variant {
  id: string;
  label: LocalizedString;
  extra?: number; // additional shekels on top of base price
}

export interface MenuItem {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  price: number; // shekels
  image?: string; // optional dish photo (front face of 3D card)
  variants?: Variant[];
  badges?: BadgeKey[];
}

export interface MenuAddon {
  id: string;
  name: LocalizedString;
  price: string;
}

export interface MenuCategory {
  id: string;
  name: LocalizedString;
  Icon: LucideIcon;
  items: MenuItem[];
  addons?: MenuAddon[];
}

export const WHATSAPP_NUMBER = '972542001235';

export const BADGE_LABELS: Record<BadgeKey, LocalizedString> = {
  popular: {
    en: 'Popular',
    he: 'פופולרי',
    ar: 'الأكثر طلباً',
    ru: 'Популярно',
    el: 'Δημοφιλές',
  },
  gf: {
    en: 'Gluten-free',
    he: 'ללא גלוטן',
    ar: 'بدون غلوتين',
    ru: 'Без глютена',
    el: 'Χωρίς γλουτένη',
  },
  vegan: { en: 'Vegan', he: 'טבעוני', ar: 'نباتي', ru: 'Веган', el: 'Vegan' },
  spicy: { en: 'Spicy', he: 'חריף', ar: 'حار', ru: 'Острый', el: 'Καυτερό' },
  new: { en: 'New', he: 'חדש', ar: 'جديد', ru: 'Новинка', el: 'Νέο' },
};

// Dietary/attribute badges customers can filter by (excludes "popular", which
// is a promo flag rather than a filterable attribute — handled separately).
export const FILTERABLE_BADGES: BadgeKey[] = ['popular', 'vegan', 'gf', 'spicy', 'new'];

const PITA_VARIANTS: Variant[] = [
  {
    id: 'chicken',
    label: { en: 'Chicken', he: 'עוף', ar: 'دجاج', ru: 'Курица', el: 'Κοτόπουλο' },
  },
  {
    id: 'white-meat',
    label: { en: 'White meat', he: 'בשר לבן', ar: 'لحم أبيض', ru: 'Белое мясо', el: 'Λευκό κρέας' },
  },
  {
    id: 'kebab',
    label: {
      en: 'Lamb kebab',
      he: 'קבב טלה',
      ar: 'كباب حمل',
      ru: 'Кебаб из ягнёнка',
      el: 'Κεμπάπ αρνί',
    },
  },
  {
    id: 'sausage',
    label: { en: 'Sausage', he: 'נקניקיות', ar: 'سجق', ru: 'Сосиски', el: 'Λουκάνικα' },
  },
  {
    id: 'vegan',
    label: { en: 'Vegan', he: 'טבעוני', ar: 'نباتي', ru: 'Веган', el: 'Vegan' },
  },
  {
    id: 'gyros',
    label: { en: 'Gyros', he: 'גירוס', ar: 'غيروس', ru: 'Гирос', el: 'Γύρος' },
    extra: 5,
  },
  {
    id: 'steak',
    label: { en: 'Steak', he: 'סטייק', ar: 'ستيك', ru: 'Стейк', el: 'Μπριζόλα' },
    extra: 5,
  },
];

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'pita',
    name: { en: 'Pita', he: 'פיתה', ar: 'بيتا', ru: 'Пита', el: 'Πίτα' },
    Icon: Sandwich,
    items: [
      {
        id: 'pita-souvlaki',
        image: '/gallery/IMG-20251205-WA0032-400.webp',
        name: {
          en: 'Souvlaki Pita',
          he: 'פיתה סובלקי',
          ar: 'بيتا سوفلاكي',
          ru: 'Пита сувлаки',
          el: 'Πίτα σουβλάκι',
        },
        description: {
          en: 'Charcoal-grilled skewer in fresh Greek pita, our house tzatziki or spicy sauce, ripe tomato, crisp lettuce, onion, golden chips.',
          he: 'שיפוד צלוי על האש בפיתה יוונית טרייה, צזיקי הבית או רוטב חריף, עגבנייה, חסה, בצל, צ׳יפס זהוב.',
          ar: 'سيخ مشوي على الفحم في بيتا يونانية طازجة، تزاتزيكي البيت أو الصلصة الحارة، طماطم، خس، بصل، بطاطس مقرمشة.',
          ru: 'Шашлык на углях в свежей греческой пите, наш домашний дзадзики или острый соус, помидор, салат, лук, золотистые чипсы.',
          el: 'Σουβλάκι ψημένο στα κάρβουνα σε φρέσκια ελληνική πίτα, τζατζίκι σπιτικό ή καυτερή σάλτσα, ντομάτα, μαρούλι, κρεμμύδι, χρυσές πατάτες.',
        },
        price: 30,
        badges: ['popular'],
        variants: PITA_VARIANTS,
      },
      {
        id: 'pita-gf',
        image: '/gallery/IMG-20251205-WA0033-400.webp',
        name: {
          en: 'Souvlaki Pita — Gluten-Free',
          he: 'פיתה סובלקי ללא גלוטן',
          ar: 'بيتا سوفلاكي خالية من الغلوتين',
          ru: 'Пита сувлаки без глютена',
          el: 'Πίτα σουβλάκι χωρίς γλουτένη',
        },
        description: {
          en: 'Gluten-free pita with skewer of choice, house tzatziki or spicy, fresh vegetables and chips.',
          he: 'פיתה ללא גלוטן עם שיפוד לבחירה, צזיקי או חריף, ירקות טריים וצ׳יפס.',
          ar: 'بيتا خالية من الغلوتين مع سيخ حسب الاختيار، تزاتزيكي أو حار، خضروات طازجة وبطاطس.',
          ru: 'Пита без глютена с шашлыком на выбор, дзадзики или острый соус, свежие овощи и чипсы.',
          el: 'Πίτα χωρίς γλουτένη με σουβλάκι επιλογής, τζατζίκι ή καυτερό, φρέσκα λαχανικά και πατάτες.',
        },
        price: 40,
        badges: ['gf'],
      },
    ],
    addons: [
      {
        id: 'double-skewer',
        name: {
          en: 'Add an extra skewer',
          he: 'תוספת שיפוד נוסף',
          ar: 'سيخ إضافي',
          ru: 'Дополнительный шашлык',
          el: 'Επιπλέον σουβλάκι',
        },
        price: '+15 ₪',
      },
    ],
  },
  {
    id: 'plates',
    name: { en: 'Plates', he: 'צלחות', ar: 'أطباق', ru: 'Тарелки', el: 'Πιάτα' },
    Icon: UtensilsCrossed,
    items: [
      {
        id: 'plate-souvlaki',
        image: '/gallery/IMG-20251205-WA0034-400.webp',
        name: {
          en: 'Souvlaki Plate',
          he: 'צלחת סובלקי',
          ar: 'طبق سوفلاكي',
          ru: 'Тарелка сувлаки',
          el: 'Πιάτο σουβλάκι',
        },
        description: {
          en: 'Skewers of your choice, house tzatziki and spicy sauce, fresh tomato, onion, lettuce, golden chips.',
          he: 'שיפודים לבחירתכם, צזיקי וחריף הבית, עגבנייה, בצל, חסה, צ׳יפס זהוב.',
          ar: 'أسياخ من اختيارك، تزاتزيكي وصلصة حارة، طماطم، بصل، خس، بطاطس مقرمشة.',
          ru: 'Шашлык на выбор, домашний дзадзики и острый соус, помидор, лук, салат, золотистые чипсы.',
          el: 'Σουβλάκια της επιλογής σας, τζατζίκι και καυτερή σάλτσα, ντομάτα, κρεμμύδι, μαρούλι, χρυσές πατάτες.',
        },
        price: 40,
      },
      {
        id: 'plate-gyros',
        image: '/gallery/IMG-20251205-WA0035-400.webp',
        name: {
          en: 'Gyros Plate',
          he: 'צלחת גירוס',
          ar: 'طبق غيروس',
          ru: 'Тарелка гирос',
          el: 'Πιάτο γύρος',
        },
        description: {
          en: 'Slow-roasted white-meat gyros, house tzatziki or spicy, fresh tomato, onion, lettuce, chips.',
          he: 'גירוס בשר לבן צלוי לאט, צזיקי או חריף, עגבנייה, בצל, חסה, צ׳יפס.',
          ar: 'غيروس لحم أبيض مشوي ببطء، تزاتزيكي أو حار، طماطم، بصل، خس، بطاطس.',
          ru: 'Гирос из белого мяса медленного приготовления, дзадзики или острый, помидор, лук, салат, чипсы.',
          el: 'Γύρος λευκού κρέατος αργής ψήσης, τζατζίκι ή καυτερό, ντομάτα, κρεμμύδι, μαρούλι, πατάτες.',
        },
        price: 50,
      },
    ],
  },
  {
    id: 'platters',
    name: { en: 'Platters', he: 'מגשים', ar: 'صواني', ru: 'Подносы', el: 'Μερίδες' },
    Icon: Beef,
    items: [
      {
        id: 'platter-personal',
        image: '/gallery/IMG-20251205-WA0036-400.webp',
        name: {
          en: 'Personal Platter',
          he: 'מגש אישי',
          ar: 'صينية فردية',
          ru: 'Индивидуальный поднос',
          el: 'Μερίδα ατόμου',
        },
        description: {
          en: 'Generous serving of white-meat gyros, golden chips, house tzatziki, fresh vegetables, traditional Greek salad. Serves 1-2.',
          he: 'מנה נדיבה של גירוס בשר לבן, צ׳יפס זהוב, צזיקי הבית, ירקות טריים וסלט יווני. ל-1-2 סועדים.',
          ar: 'حصة سخية من غيروس اللحم الأبيض، بطاطس مقرمشة، تزاتزيكي البيت، خضروات طازجة وسلطة يونانية تقليدية. لـ 1-2.',
          ru: 'Щедрая порция гироса из белого мяса, золотистые чипсы, домашний дзадзики, свежие овощи и греческий салат. На 1-2 человек.',
          el: 'Γενναιόδωρη μερίδα γύρου λευκού κρέατος, χρυσές πατάτες, τζατζίκι, φρέσκα λαχανικά και ελληνική σαλάτα. Για 1-2.',
        },
        price: 50,
      },
      {
        id: 'platter-couple',
        image: '/gallery/IMG-20251205-WA0037-400.webp',
        name: {
          en: 'Couple Platter',
          he: 'מגש זוגי',
          ar: 'صينية زوجية',
          ru: 'Парный поднос',
          el: 'Μερίδα ζευγαριού',
        },
        description: {
          en: 'White-meat gyros + 2 skewers of your choice, chips, sauces, fresh vegetables and salads. Perfect for two.',
          he: 'גירוס בשר לבן + 2 שיפודים לבחירה, צ׳יפס, רטבים, ירקות טריים וסלטים. מושלם לזוג.',
          ar: 'غيروس لحم أبيض + سيخان من اختيارك، بطاطس، صلصات، خضروات وسلطات. مثالي لشخصين.',
          ru: 'Гирос из белого мяса + 2 шашлыка на выбор, чипсы, соусы, свежие овощи и салаты. Идеально для двоих.',
          el: 'Γύρος λευκού κρέατος + 2 σουβλάκια της επιλογής σας, πατάτες, σάλτσες, φρέσκα λαχανικά και σαλάτες. Τέλειο για δύο.',
        },
        price: 120,
        badges: ['popular'],
      },
      {
        id: 'platter-family',
        image: '/gallery/IMG-20251205-WA0038-400.webp',
        name: {
          en: 'Family Platter',
          he: 'מגש משפחתי',
          ar: 'صينية عائلية',
          ru: 'Семейный поднос',
          el: 'Μερίδα οικογένειας',
        },
        description: {
          en: 'White-meat gyros + 3 skewers, chips, sauces, fresh vegetables, salads, warm pitas. Feeds 4-5.',
          he: 'גירוס בשר לבן + 3 שיפודים, צ׳יפס, רטבים, ירקות, סלטים ופיתות חמות. ל-4-5 סועדים.',
          ar: 'غيروس لحم أبيض + 3 أسياخ، بطاطس، صلصات، خضروات، سلطات وبيتا دافئة. لـ 4-5 أشخاص.',
          ru: 'Гирос из белого мяса + 3 шашлыка, чипсы, соусы, овощи, салаты и тёплые питы. На 4-5 человек.',
          el: 'Γύρος λευκού κρέατος + 3 σουβλάκια, πατάτες, σάλτσες, λαχανικά, σαλάτες και ζεστές πίτες. Για 4-5.',
        },
        price: 170,
      },
    ],
  },
  {
    id: 'pizza',
    name: {
      en: 'Pizza Gyros',
      he: 'פיצה גירוס',
      ar: 'بيتزا غيروس',
      ru: 'Пицца гирос',
      el: 'Πίτσα γύρος',
    },
    Icon: Pizza,
    items: [
      {
        id: 'pizza-small',
        image: '/gallery/IMG-20251205-WA0039-400.webp',
        name: {
          en: 'Pizza Gyros — Small',
          he: 'פיצה גירוס קטנה',
          ar: 'بيتزا غيروس صغيرة',
          ru: 'Пицца гирос (маленькая)',
          el: 'Πίτσα γύρος (μικρή)',
        },
        description: {
          en: 'Personal pizza topped with white-meat gyros and golden chips.',
          he: 'פיצה אישית בתוספת גירוס בשר לבן וצ׳יפס זהוב.',
          ar: 'بيتزا فردية مع غيروس لحم أبيض وبطاطس مقرمشة.',
          ru: 'Личная пицца с гиросом из белого мяса и золотистыми чипсами.',
          el: 'Ατομική πίτσα με γύρο λευκού κρέατος και χρυσές πατάτες.',
        },
        price: 40,
      },
      {
        id: 'pizza-large',
        image: '/gallery/IMG-20251205-WA0040-400.webp',
        name: {
          en: 'Pizza Gyros — Large',
          he: 'פיצה גירוס גדולה',
          ar: 'بيتزا غيروس كبيرة',
          ru: 'Пицца гирос (большая)',
          el: 'Πίτσα γύρος (μεγάλη)',
        },
        description: {
          en: 'Sharing-size pizza topped with white-meat gyros and golden chips.',
          he: 'פיצה גדולה לשיתוף בתוספת גירוס בשר לבן וצ׳יפס זהוב.',
          ar: 'بيتزا كبيرة للمشاركة مع غيروس لحم أبيض وبطاطس مقرمشة.',
          ru: 'Большая пицца для компании с гиросом из белого мяса и золотистыми чипсами.',
          el: 'Μεγάλη πίτσα για μοίρασμα με γύρο λευκού κρέατος και χρυσές πατάτες.',
        },
        price: 70,
      },
    ],
  },
  {
    id: 'salads',
    name: { en: 'Salads', he: 'סלטים', ar: 'سلطات', ru: 'Салаты', el: 'Σαλάτες' },
    Icon: Salad,
    items: [
      {
        id: 'greek-salad',
        image: '/gallery/IMG-20251205-WA0041-400.webp',
        name: {
          en: 'Greek Salad',
          he: 'סלט יווני',
          ar: 'سلطة يونانية',
          ru: 'Греческий салат',
          el: 'Ελληνική σαλάτα',
        },
        description: {
          en: 'Tomato, cucumber, bell pepper, onion, Kalamata olives, creamy feta — drizzled with olive oil.',
          he: 'עגבנייה, מלפפון, פלפל, בצל, זיתי קלמטה ופטה קרמית — בלימון ושמן זית.',
          ar: 'طماطم، خيار، فلفل، بصل، زيتون كالاماتا وجبنة فيتا كريمية — مع زيت زيتون.',
          ru: 'Помидоры, огурец, перец, лук, оливки каламата и сливочная фета — с оливковым маслом.',
          el: 'Ντομάτα, αγγούρι, πιπεριά, κρεμμύδι, ελιές Καλαμών και κρεμώδης φέτα — με ελαιόλαδο.',
        },
        price: 40,
      },
    ],
  },
  {
    id: 'sides',
    name: {
      en: 'Sides',
      he: 'תוספות',
      ar: 'إضافات',
      ru: 'Гарниры',
      el: 'Συνοδευτικά',
    },
    Icon: Cookie,
    items: [
      {
        id: 'fries',
        image: '/gallery/IMG-20251205-WA0042-400.webp',
        name: {
          en: 'Greek Chips',
          he: 'צ׳יפס',
          ar: 'بطاطس',
          ru: 'Картофель фри',
          el: 'Πατάτες',
        },
        description: {
          en: 'Hand-cut, crispy, salted just right.',
          he: 'פרוס ביד, פריך ומלוח בדיוק כמו שצריך.',
          ar: 'مقطعة باليد، مقرمشة ومملحة بالقدر المناسب.',
          ru: 'Нарезанные вручную, хрустящие, идеально посоленные.',
          el: 'Κομμένες στο χέρι, τραγανές, αλατισμένες στην εντέλεια.',
        },
        price: 15,
      },
    ],
  },
  {
    id: 'drinks',
    name: {
      en: 'Drinks',
      he: 'משקאות',
      ar: 'مشروبات',
      ru: 'Напитки',
      el: 'Αναψυκτικά',
    },
    Icon: CupSoda,
    items: [
      {
        id: 'soft-drinks',
        name: {
          en: 'Soft Drinks',
          he: 'משקאות קלים',
          ar: 'مشروبات غازية',
          ru: 'Безалкогольные',
          el: 'Αναψυκτικά',
        },
        description: {
          en: 'Coca-Cola, Cola Zero, Fanta, Sprite, Grape.',
          he: 'קוקה קולה, קולה זירו, פנטה, ספרייט, ענבים.',
          ar: 'كوكا كولا، كولا زيرو، فانتا، سبرايت، عنب.',
          ru: 'Кока-Кола, Кола Зеро, Фанта, Спрайт, Виноградный.',
          el: 'Coca-Cola, Cola Zero, Fanta, Sprite, Σταφύλι.',
        },
        price: 7,
      },
      {
        id: 'water',
        name: {
          en: 'Mineral Water',
          he: 'מים מינרליים',
          ar: 'مياه معدنية',
          ru: 'Минеральная вода',
          el: 'Μεταλλικό νερό',
        },
        price: 5,
      },
    ],
  },
  {
    id: 'alcohol',
    name: {
      en: 'Alcohol',
      he: 'אלכוהול',
      ar: 'كحول',
      ru: 'Алкоголь',
      el: 'Αλκοόλ',
    },
    Icon: Wine,
    items: [
      {
        id: 'beer',
        name: {
          en: 'Drift Draft Beer',
          he: 'בירה דריפט מהחבית',
          ar: 'بيرة دريفت من البرميل',
          ru: 'Разливное пиво Drift',
          el: 'Μπύρα Drift από βαρέλι',
        },
        description: {
          en: 'Our house draft, light and refreshing.',
          he: 'הבירה של הבית, קלה ומרעננת.',
          ar: 'بيرة البيت، خفيفة ومنعشة.',
          ru: 'Наше домашнее пиво — лёгкое и освежающее.',
          el: 'Η μπύρα του σπιτιού, ελαφριά και δροσιστική.',
        },
        price: 15,
      },
      {
        id: 'wine-glass',
        name: {
          en: 'Wine — Glass',
          he: 'יין בכוס',
          ar: 'نبيذ بالكأس',
          ru: 'Вино — бокал',
          el: 'Κρασί — ποτήρι',
        },
        description: {
          en: 'Red, white, or rosé.',
          he: 'אדום, לבן או רוזה.',
          ar: 'أحمر، أبيض، أو وردي.',
          ru: 'Красное, белое или розовое.',
          el: 'Κόκκινο, λευκό, ή ροζέ.',
        },
        price: 15,
      },
      {
        id: 'wine-bottle',
        name: {
          en: 'Wine — Bottle',
          he: 'בקבוק יין',
          ar: 'زجاجة نبيذ',
          ru: 'Бутылка вина',
          el: 'Μπουκάλι κρασιού',
        },
        description: {
          en: 'House selection — ask your server.',
          he: 'בחירת הבית — שאלו את המלצר.',
          ar: 'اختيار البيت — اسأل النادل.',
          ru: 'Выбор шефа — спросите официанта.',
          el: 'Επιλογή σπιτιού — ρωτήστε τον σερβιτόρο.',
        },
        price: 100,
      },
      {
        id: 'whiskey',
        name: { en: 'Whiskey', he: 'וויסקי', ar: 'ويسكي', ru: 'Виски', el: 'Ουίσκι' },
        price: 30,
      },
      {
        id: 'ouzo',
        name: {
          en: 'Ouzo Plomari',
          he: 'אוזו פלומרי',
          ar: 'أوزو بلوماري',
          ru: 'Узо Пломари',
          el: 'Ούζο Πλωμαρίου',
        },
        description: {
          en: 'Traditional anise-flavoured Greek spirit. 200 ml bottle.',
          he: 'משקה יווני מסורתי בטעם אניס. בקבוק 200 מ״ל.',
          ar: 'مشروب يوناني تقليدي بنكهة اليانسون. زجاجة 200 مل.',
          ru: 'Традиционный греческий напиток с анисом. Бутылка 200 мл.',
          el: 'Παραδοσιακό ελληνικό ποτό γλυκάνισου. Μπουκάλι 200 ml.',
        },
        price: 70,
      },
    ],
  },
];

export function getLocalized(s: LocalizedString | undefined, lang: Lang): string {
  if (!s) return '';
  return s[lang] ?? s.en;
}

export function formatPrice(shekels: number): string {
  return `${shekels} ₪`;
}

/** Flat list of every item with its category id — handy for admin + schema. */
export function flattenItems(): Array<{ categoryId: string; item: MenuItem }> {
  return MENU_CATEGORIES.flatMap((cat) => cat.items.map((item) => ({ categoryId: cat.id, item })));
}

/** Category meta (id + localized name + icon) — the fixed set owner-added
 *  dishes slot into. Derived from the built-in menu so it stays in sync. */
export const CATEGORIES: Array<{ id: string; name: LocalizedString; Icon: LucideIcon }> =
  MENU_CATEGORIES.map((c) => ({ id: c.id, name: c.name, Icon: c.Icon }));
