import { useState } from 'react';
import { Language } from '../App';
import { Share2, Facebook, Instagram, Twitter, Link2 } from 'lucide-react';

interface MenuItem {
  name: { en: string; he: string; ar: string; ru: string; el: string };
  description: { en: string; he: string; ar: string; ru: string; el: string };
  price: string;
  badge?: string;
}

interface MenuCategory {
  id: string;
  name: { en: string; he: string; ar: string; ru: string; el: string };
  icon: string;
  items: MenuItem[];
}

const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'pita',
    name: {
      en: 'Pita',
      he: 'פיתה',
      ar: 'بيتا',
      ru: 'Пита',
      el: 'Πίτα'
    },
    icon: '🫓',
    items: [
      {
        name: {
          en: 'Souvlaki Pita Chicken',
          he: 'פיתה סובלקי עוף',
          ar: 'بيتا سوفلاكي دجاج',
          ru: 'Пита сувлаки курица',
          el: 'Πίτα σουβλάκι κοτόπουλο'
        },
        description: {
          en: 'Greek pita, chicken skewer, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה יוונית, שיפוד עוף, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا يونانية، سيخ دجاج، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Греческая пита, куриный шашлык, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Ελληνική πίτα, σουβλάκι κοτόπουλο, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια'
        },
        price: '30 ₪'
      },
      {
        name: {
          en: 'Souvlaki Pita White Meat',
          he: 'פיתה סובלקי בשר לבן',
          ar: 'بيتا سوفلاكي لحم أبيض',
          ru: 'Пита сувлаки белое мясо',
          el: 'Πίτα σοβλάνι λευκό κρέας'
        },
        description: {
          en: 'Greek pita, white meat skewer, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה יוונית, שיפוד בשר לבן, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا يونانية، سيخ لحم أبيض، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Греческая пита, шашлык из белого мяса, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Ελληνική πίτα, σοβλάνι λευκό κρέας, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια'
        },
        price: '30 ₪'
      },
      {
        name: {
          en: 'Souvlaki Pita Gyros',
          he: 'פיתה גירוס בשר לבן',
          ar: 'بيتا غيروس لحم أبيض',
          ru: 'Пита гирос белое мясо',
          el: 'Πίτα γύρος λευκό κρέας'
        },
        description: {
          en: 'Greek pita, gyros white meat (shawarma), tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה יוונית, גירוס בשר לבן (שווארמה), רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا يونانية، غيروس لحم أبيض (شاورما)، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Греческая пита, гирос из белого мяса (шаурма), соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Ελληνική πίτα, γύρος λευκό κρέας (σεβλάχι), σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια'
        },
        price: '35 ₪'
      },
      {
        name: {
          en: 'Souvlaki Pita Kebab',
          he: 'פיתה סובלקי קבב',
          ar: 'بيتا سوفلاكي كباب',
          ru: 'Пита сувлаки кебаб',
          el: 'Πίτα σουβλάκι κεμπάπ'
        },
        description: {
          en: 'Greek pita, lamb leg kebab, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה יוונית, קבב רגל טלה, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا يونانية، كباب ساق حمل، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Греческая пита, кебаб из ножки ягненка, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Ελληνική πίτα, κεμπάπ πόδι αρνιού, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια'
        },
        price: '30 ₪'
      },
      {
        name: {
          en: 'Souvlaki Pita Sausage',
          he: 'פיתה סובלקי נקניקיות',
          ar: 'بيتا سوفلاكي سجق',
          ru: 'Пита сувлаки сосиски',
          el: 'Πίτα σουβλάκι λουκάνικα'
        },
        description: {
          en: 'Greek pita, sausages, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה יוונית, נקניקיות, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا يونانية، سجق، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Греческая пита, сосиски, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Ελληνική πίτα, λουκάνικα, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια'
        },
        price: '30 ₪'
      },
      {
        name: {
          en: 'Souvlaki Pita Vegan',
          he: 'פיתה סובלקי טבעוני',
          ar: 'بيتا سوفلاكي نباتي',
          ru: 'Пита сувлаки веган',
          el: 'Πίτα σουβλάκι vegan'
        },
        description: {
          en: 'Greek pita, vegan skewer, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה יוונית, שיפוד טבעוני, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا يونانية، سيخ نباتي، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Греческая пита, веганский шашлык, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Ελληνική πίτα, vegan σουβλάκι, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια'
        },
        price: '30 ₪'
      },
      {
        name: {
          en: 'Souvlaki Pita Steak',
          he: 'פיתה סובלקי סטייק',
          ar: 'بيتا سوفلاكي ستيك',
          ru: 'Пита сувлаки стейк',
          el: 'Πίτα σουβλάκι μπριζόλα'
        },
        description: {
          en: 'Greek pita, white meat sirloin steak, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה יוונית, סטייק בשר לבן סינטה, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا يونانية، ستيك لحم أبيض، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Греческая пита, стейк из белого мяса, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Ελληνική πίτα, μπριζόλα λευκού κρέατος, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια'
        },
        price: '35 ₪'
      },
      {
        name: {
          en: 'Souvlaki Pita Gluten Free',
          he: 'פיתה סובלקי ללא גלוטן',
          ar: 'بيتا سوفلاكي خالية من الغلوتين',
          ru: 'Пита сувлаки без глютена',
          el: 'Πίτα σουβλάκι χωρίς γλουτένη'
        },
        description: {
          en: 'Gluten free pita, skewer of choice, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה ללא גלוטן, שיפוד לבחירה, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا خالية من الغلوتين، سيخ حسب الاختيار، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Пита без глютена, шашлык на выбор, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Πίτα χωρίς γλουτένη, σουβλάki επιλογής, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια'
        },
        price: '40 ₪',
        badge: 'GF'
      },
      {
        name: {
          en: 'Double Skewer',
          he: 'תוספת שיפוד נוסף',
          ar: 'سيخ إضافي',
          ru: 'Двойной шашлык',
          el: 'Διπλό σουβλάκι'
        },
        description: {
          en: 'Add an extra skewer to any pita',
          he: 'הוסף שיפוד נוסף לכל פיתה',
          ar: 'أضف سيخ إضافي لأي بيتا',
          ru: 'Добавьте дополнительный шашлык к любой пите',
          el: 'Προσθήκη επιπλέον σουβλακι σε οποιαδήποτε πίτα'
        },
        price: '+15 ₪'
      },
    ],
  },
  {
    id: 'plates',
    name: {
      en: 'Plates',
      he: 'צלחות',
      ar: 'أطباق',
      ru: 'Тарелки',
      el: 'Πιάτα'
    },
    icon: '🍽️',
    items: [
      {
        name: {
          en: 'Souvlaki Plate',
          he: 'צלחת סובלקי',
          ar: 'طبق سوفلاكي',
          ru: 'Тарелка сувлаки',
          el: 'Πιάτο σουβλάκι'
        },
        description: {
          en: 'Skewers of choice, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'שיפודים לבחירה, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'أسياخ حسب الاختيار، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Шашлык на выбор, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Σουβλάκι επιλογής, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια'
        },
        price: '40 ₪'
      },
      {
        name: {
          en: 'Souvlaki Plate Gyros',
          he: 'צלחת גירוס',
          ar: 'طبق غيروس',
          ru: 'Тарелка гирос',
          el: 'Πιάτο γύρος'
        },
        description: {
          en: 'White meat gyros (shawarma), tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'שווארמה לבן, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'غيروس لحم أبيض (شاورما)، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Гирос из белого мяса (шаурма), соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Γύρος λευκό κρέας (σεβλάχι), σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια'
        },
        price: '50 ₪'
      },
    ],
  },
  {
    id: 'platters',
    name: {
      en: 'Platters',
      he: 'מגשים',
      ar: 'صواني',
      ru: 'Подносы',
      el: 'Μερίδες'
    },
    icon: '🍖',
    items: [
      {
        name: {
          en: 'Personal Platter',
          he: 'מגש שווארמה אישי',
          ar: 'صينية شاورما فردية',
          ru: 'Индивидуальный поднос',
          el: 'Μερίδα ατόμου'
        },
        description: {
          en: 'White meat gyros, chips, tzatziki sauce, fresh vegetables, Greek salad',
          he: 'שווארמה לבן, צ׳יפס, רוטב צזיקי, ירקות טריים, סלט יווני',
          ar: 'غيروس لحم أبيض، بطاطس، صلصة تزاتزيكي، خضروات طازجة، سلطة يونانية',
          ru: 'Гирос из белого мяса, чипсы, соус дзадзики, свежие овощи, греческий салат',
          el: 'Γύρος λευκό κρέας, πατατάκια, σως τζατζίκι, φρέσκα λαχανικά, ελληνική σαλάτα'
        },
        price: '50 ₪',
        badge: '1-2'
      },
      {
        name: {
          en: 'Couple Platter',
          he: 'מגש שווארמה זוגי',
          ar: 'صينية شاورما زوجية',
          ru: 'Парный поднос',
          el: 'Μερίδα ζευγαριού'
        },
        description: {
          en: 'White meat gyros, 2 types of skewers, chips, sauces, vegetables, salads',
          he: 'שווארמה לבן, 2 סוגי שיפודים, צ׳יפס, רטבים, ירקות, סלטים',
          ar: 'غيروس لحم أبيض، نوعان من الأسياخ، بطاطس، صلصات، خضروات، سلطات',
          ru: 'Гирос из белого мяса, 2 вида шашлыка, чипсы, соусы, овощи, салаты',
          el: 'Γύρος λευκό κρέας, 2 είδη σουβλακιών, πατατάκια, σως, λαχανικά, σαλάτες'
        },
        price: '120 ₪',
        badge: '2-3'
      },
      {
        name: {
          en: 'Family Platter',
          he: 'מגש שווארמה משפחתי',
          ar: 'صينية شاورما عائلية',
          ru: 'Семейный поднос',
          el: 'Μερίδα οικογένειας'
        },
        description: {
          en: 'White meat gyros, 3 types of skewers, chips, sauces, vegetables, salads, pitas',
          he: 'שווארמה לבן, 3 סוגי שיפודים, צ׳יפס, רטבים, ירקות, סלטים, פיתות',
          ar: 'غيروس لحم أبيض، 3 أنواع من الأسياخ، بطاطس، صلصات، خضروات، سلطات، بيتا',
          ru: 'Гирос из белого мяса, 3 вида шашлыка, чипсы, соусы, овощи, салаты, питы',
          el: 'Γύρος λευκό κρέας, 3 είδη σουβλακιών, πατατάκια, σως, λαχανικά, σαλάτες, πίτες'
        },
        price: '170 ₪',
        badge: '4-5'
      },
    ],
  },
  {
    id: 'pizza',
    name: {
      en: 'Pizza Gyros',
      he: 'פיצה גירוס',
      ar: 'بيتزا غيروس',
      ru: 'Пица гирос',
      el: 'Πίτσα γύρος'
    },
    icon: '🍕',
    items: [
      {
        name: {
          en: 'Pizza Gyros (Small)',
          he: 'פיצה גירוס קטנה',
          ar: 'بيتزا غيروس صغيرة',
          ru: 'Пица гирос (маленькая)',
          el: 'Πίτσα γύρος (μικρή)'
        },
        description: {
          en: 'Pizza with white meat gyros and chips',
          he: 'פיצה עם שווארמה לבן וצ׳יפס',
          ar: 'بيتزا مع غيروس لحم أبيض وبطاطس',
          ru: 'Пица с гирос из белого мяса и чипсами',
          el: 'Πίτσα με γύρο λευκό κρέας και πατατάκια'
        },
        price: '40 ₪'
      },
      {
        name: {
          en: 'Pizza Gyros (Large)',
          he: 'פיצה גירוס גדולה',
          ar: 'بيتزا غيروس كبيرة',
          ru: 'Пица гирос (большая)',
          el: 'Πίτσα γύρος (μεγάλη)'
        },
        description: {
          en: 'Pizza with white meat gyros and chips',
          he: 'פיצה עם שווארמה לבן וצ׳יפס',
          ar: 'بيتزا مع غيروس لحم أبيض وبطاطس',
          ru: 'Пица с гирос из белого мяса и чипсами',
          el: 'Πίτσα με γύρο λευκό κρέας και πατατάκια'
        },
        price: '70 ₪'
      },
    ],
  },
  {
    id: 'salads',
    name: {
      en: 'Salads',
      he: 'סלטים',
      ar: 'سلطات',
      ru: 'Салаты',
      el: 'Σαλάτες'
    },
    icon: '🥗',
    items: [
      {
        name: {
          en: 'Greek Salad',
          he: 'סלט יווני',
          ar: 'سلطة يونانية',
          ru: 'Греческий салат',
          el: 'Ελληνική σαλάτα'
        },
        description: {
          en: 'Tomatoes, cucumber, bell pepper, onion, black kalamata olives, feta cheese',
          he: 'עגבניות, מלפפון, פלפל מחוק, בצל, זיתים שחורים קלמטה, גבינת פטה',
          ar: 'طماطم، خيار، فلفل حلو، بصل، زيتون كالاماتا أسود، جبنة فيتا',
          ru: 'Помидоры, огурец, болгарский перец, лук, черные оливки каламата, сыр фета',
          el: 'Ντομάτες, αγγούρι, γλυκό πιπέρι, κρεμμύδι, μαύρες ελιές καλαμών, φέτα'
        },
        price: '40 ₪',
        badge: '🌿'
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
      el: 'Συνοδευτικά'
    },
    icon: '🍟',
    items: [
      {
        name: {
          en: 'Fries Chips',
          he: 'צ׳יפס',
          ar: 'بطاطس',
          ru: 'Картофель фри',
          el: 'Πατατάκια'
        },
        description: {
          en: 'Crispy and tasty chips',
          he: 'צלחת צ׳יפס פריך וטעים',
          ar: 'بطاطس مقرمشة ولذيذة',
          ru: 'Хрустящие и вкусные чипсы',
          el: 'Τραγανά και νόστιμα πατατάκια'
        },
        price: '15 ₪'
      },
    ],
  },
  {
    id: 'drinks',
    name: {
      en: 'Soft Drinks',
      he: 'משקאות',
      ar: 'مشروبات',
      ru: 'Безалкогольные напитки',
      el: 'Αναψυκτικά'
    },
    icon: '🥤',
    items: [
      {
        name: {
          en: 'Soft Drinks',
          he: 'משקאות קלים',
          ar: 'مشروبات غازية',
          ru: 'Безалкогольные напитки',
          el: 'Αναψυκτικά'
        },
        description: {
          en: 'Coca Cola, Cola Zero, Fanta, Sprite, Grape',
          he: 'קוקה קולה, קולה זירו, פנטה, ספרייט, ענבים',
          ar: 'كوكا كولا، كولا زيرو، فانتا، سبرايت، عنب',
          ru: 'Кока Кола, Кола Зеро, Фанта, Спрайт, Виноградный',
          el: 'Coca Cola, Cola Zero, Fanta, Sprite, Σταφυλάδα'
        },
        price: '7 ₪'
      },
      {
        name: {
          en: 'Water',
          he: 'מים',
          ar: 'مياه',
          ru: 'Вода',
          el: 'Νερό'
        },
        description: {
          en: 'Mineral water',
          he: 'מים מינרליים',
          ar: 'مياه معدنية',
          ru: 'Минеральная вода',
          el: 'Μεταλλικό νερό'
        },
        price: '5 ₪'
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
      el: 'Αλκοόλ'
    },
    icon: '🍷',
    items: [
      {
        name: {
          en: 'Drift Beer (1/3)',
          he: 'בירה דריפט',
          ar: 'بيرة دريفت',
          ru: 'Пиво Drift (1/3)',
          el: 'Μπύρα Drift (1/3)'
        },
        description: {
          en: 'Perfect house beer',
          he: 'בירה דריפט מושלמת',
          ar: 'بيرة البيت المثالية',
          ru: 'Идеальное домашнее пиво',
          el: 'Τέλεια μπύρα σπίτια'
        },
        price: '15 ₪'
      },
      {
        name: {
          en: 'Wine (Glass)',
          he: 'יין לכוס',
          ar: 'نبيذ بالكأس',
          ru: 'Вино (бокал)',
          el: 'Κρασί (ποτήρι)'
        },
        description: {
          en: 'Red/White/Rose wine',
          he: 'יין אדום/לבן/רוזה',
          ar: 'نبيذ أحمر/أبيض/وردي',
          ru: 'Красное/белое/розовое вино',
          el: 'Κόκκινο/Λευκό/Rose κρασί'
        },
        price: '15 ₪'
      },
      {
        name: {
          en: 'Wine Bottle',
          he: 'בקבוק יין',
          ar: 'زجاجة نبيذ',
          ru: 'Бутылка вина',
          el: 'Μπουκάλι κρασιού'
        },
        description: {
          en: 'Quality wine bottle',
          he: 'בקבוק יין איכותי',
          ar: 'زجاجة نبيذ عالي الجودة',
          ru: 'Бутылка качественного вина',
          el: 'Μπουκάλι ποιοτικού κρασιού'
        },
        price: '100 ₪'
      },
      {
        name: {
          en: 'Whiskey',
          he: 'וויסקי',
          ar: 'ويسكي',
          ru: 'Виски',
          el: 'Ουίσκι'
        },
        description: {
          en: 'Fine whiskey',
          he: 'וויסקי משובח',
          ar: 'ويسكي فاخر',
          ru: 'Отличное виски',
          el: 'Προσεγμένη ουίσκι'
        },
        price: '30 ₪'
      },
      {
        name: {
          en: 'Ouzo Plomari',
          he: 'אוזו פלומרי',
          ar: 'أوزو بلوماري',
          ru: 'Узо Пломари',
          el: 'Ούζο Πλομαριού'
        },
        description: {
          en: 'Ouzo Plomari bottle 200ml',
          he: 'בקבוק אוזו פלומרי 200 מ״ל',
          ar: 'زجاجة أوزو بلوماري 200 مل',
          ru: 'Бутылка узо Пломари 200мл',
          el: 'Μπουκάλι ούζο Πλομαρίου 200ml'
        },
        price: '70 ₪'
      },
    ],
  },
];

// Translation helper for section titles
const SECTION_TITLES = {
  en: { title: 'Our Menu', subtitle: 'Authentic Greek flavors made with love' },
  he: { title: 'התפריט שלנו', subtitle: 'טעמים יווניים אותנטיים עשויים באהבה' },
  ar: { title: 'قائمتنا', subtitle: 'نكهات يونانية أصلية مصنوعة بحب' },
  ru: { title: 'Наше меню', subtitle: 'Настоящие греческие вкусы, приготовленные с любовью' },
  el: { title: 'Το μενού μας', subtitle: 'Αυθεντικές ελληνικές γεύσεις φτιαγμένες με αγάπη' },
};

const SCROLL_HINTS = {
  en: '← Swipe tabs for more categories →',
  he: '← גלול ימינה לעוד קטגוריות →',
  ar: '← مرر لليمين للمزيد من الفئات →',
  ru: '← Листайте вкладки для большего количества категорий →',
  el: '← Σαρώνετε τις καρτέλες για περισσότερες κατηγορίες →',
};

const SHARE_TEXTS = {
  en: { share: 'Share', copied: 'Link copied!' },
  he: { share: 'שתף', copied: 'הקישור הועתק!' },
  ar: { share: 'مشاركة', copied: 'تم نسخ الرابط!' },
  ru: { share: 'Поделиться', copied: 'Ссылка скопирована!' },
  el: { share: 'Μοιραστείτε', copied: 'Ο σύνδεσμος αντιγράφηκε!' },
};

interface MenuProps {
  language: Language;
}

// Social Share Button Component
const SocialShareButtons = ({ itemName, language }: { itemName: string; language: Language }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareTexts = SHARE_TEXTS[language as keyof typeof SHARE_TEXTS] || SHARE_TEXTS.en;

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href.split('#')[0] + '#menu');
    const text = encodeURIComponent(`Check out this delicious dish at Greek Souvlaki Kfar Yasif: ${itemName}`);

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href.split('#')[0] + '#menu');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 text-sm font-medium transition-colors"
        title={shareTexts.share}
      >
        <Share2 className="w-4 h-4" />
      </button>

      {showShareMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
          <div className="absolute bottom-full right-0 rtl:right-auto rtl:left-0 mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-2 z-20 min-w-[160px]">
            <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 border-b border-gray-200 dark:border-gray-600 mb-1">
              {shareTexts.share}
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Facebook</span>
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-sky-50 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
              >
                <Twitter className="w-4 h-4 text-sky-500" />
                <span className="text-sm">X / Twitter</span>
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
              >
                <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="text-sm">WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
              >
                <Link2 className="w-4 h-4" />
                <span className="text-sm">{copied ? shareTexts.copied : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function Menu({ language }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0].id);

  const currentCategory = MENU_CATEGORIES.find(cat => cat.id === activeCategory) || MENU_CATEGORIES[0];
  const isRtl = language === 'he' || language === 'ar';

  const getLocalizedText = (textObj: { [key: string]: string }) => textObj[language] || textObj.en;

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {SECTION_TITLES[language as keyof typeof SECTION_TITLES]?.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {SECTION_TITLES[language as keyof typeof SECTION_TITLES]?.subtitle}
          </p>
        </div>

        {/* Category Tabs - Horizontal Scroll on Mobile */}
        <div className="mb-8">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide sticky top-0 bg-amber-50 dark:bg-gray-900 z-10 py-2 -mx-4 px-4">
            {MENU_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-full font-medium whitespace-nowrap transition-all duration-300
                  ${activeCategory === category.id
                    ? 'bg-orange-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{getLocalizedText(category.name)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Title */}
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3 flex-wrap">
            <span>{currentCategory.icon}</span>
            <span>{getLocalizedText(currentCategory.name)}</span>
          </h3>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {currentCategory.items.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-xl shadow-md hover:shadow-amber-200/50 dark:hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 border border-amber-200 dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700"
            >
              <div className="p-5">
                {/* Item Header - Name, Price, and Share */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-amber-950 dark:text-amber-100 leading-tight">
                      {getLocalizedText(item.name)}
                    </h4>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-lg font-bold shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform">
                        {item.price}
                      </span>
                      <SocialShareButtons itemName={getLocalizedText(item.name)} language={language} />
                    </div>
                    {item.badge && (
                      <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full font-medium border border-amber-200 dark:border-amber-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-amber-900/80 dark:text-amber-100/80 text-sm leading-relaxed">
                  {getLocalizedText(item.description)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Category Scroll Indicator */}
        <div className="flex justify-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
          <span>{SCROLL_HINTS[language as keyof typeof SCROLL_HINTS] || SCROLL_HINTS.en}</span>
        </div>
      </div>
    </section>
  );
}
