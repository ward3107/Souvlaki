import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Language } from '../types';

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
      el: 'Πίτα',
    },
    icon: '🫓',
    items: [
      {
        name: {
          en: 'Souvlaki Pita Chicken',
          he: 'פיתה סובלקי עוף',
          ar: 'بيتا سوفلاكي دجاج',
          ru: 'Пита сувлаки курица',
          el: 'Πίτα σουβλάκι κοτόπουλο',
        },
        description: {
          en: 'Greek pita, chicken skewer, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה יוונית, שיפוד עוף, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا يونانية، سيخ دجاج، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Греческая пита, куриный шашлык, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Ελληνική πίτα, σουβλάκι κοτόπουλο, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια',
        },
        price: '30 ₪',
      },
      {
        name: {
          en: 'Souvlaki Pita White Meat',
          he: 'פיתה סובלקי בשר לבן',
          ar: 'بيتا سوفلاكي لحم أبيض',
          ru: 'Пита сувлаки белое мясо',
          el: 'Πίτα σοβλάνι λευκό κρέας',
        },
        description: {
          en: 'Greek pita, white meat skewer, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה יוונית, שיפוד בשר לבן, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا يونانية، سيخ لحم أبيض، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Греческая пита, шашлык из белого мяса, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Ελληνική πίτα, σοβλάνι λευκό κρέας, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια',
        },
        price: '30 ₪',
      },
      {
        name: {
          en: 'Souvlaki Pita Gyros',
          he: 'פיתה גירוס בשר לבן',
          ar: 'بيتا غيروس لحم أبيض',
          ru: 'Пита гирос белое мясо',
          el: 'Πίτα γύρος λευκό κρέας',
        },
        description: {
          en: 'Greek pita, gyros white meat (shawarma), tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה יוונית, גירוס בשר לבן (שווארמה), רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا يونانية، غيروس لحم أبيض (شاورما)، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Греческая пита, гирос из белого мяса (шаурма), соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Ελληνική πίτα, γύρος λευκό κρέας (σεβλάχι), σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια',
        },
        price: '35 ₪',
      },
      {
        name: {
          en: 'Souvlaki Pita Kebab',
          he: 'פיתה סובלקי קבב',
          ar: 'بيتا سوفلاكي كباب',
          ru: 'Пита сувлаки кебаб',
          el: 'Πίτα σουβλάκι κεμπάπ',
        },
        description: {
          en: 'Greek pita, lamb leg kebab, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה יוונית, קבב רגל טלה, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا يونانية، كباب ساق حمل، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Греческая пита, кебаб из ножки ягненка, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Ελληνική πίτα, κεμπάπ πόδι αρνιού, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια',
        },
        price: '30 ₪',
      },
      {
        name: {
          en: 'Souvlaki Pita Sausage',
          he: 'פיתה סובלקי נקניקיות',
          ar: 'بيتا سوفلاكي سجق',
          ru: 'Пита сувлаки сосиски',
          el: 'Πίτα σουβλάκι λουκάνικα',
        },
        description: {
          en: 'Greek pita, sausages, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה יוונית, נקניקיות, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا يونانية، سجق، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Греческая пита, сосиски, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Ελληνική πίτα, λουκάνικα, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια',
        },
        price: '30 ₪',
      },
      {
        name: {
          en: 'Souvlaki Pita Vegan',
          he: 'פיתה סובלקי טבעוני',
          ar: 'بيتا سوفلاكي نباتي',
          ru: 'Пита сувлаки веган',
          el: 'Πίτα σουβλάκι vegan',
        },
        description: {
          en: 'Greek pita, vegan skewer, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה יוונית, שיפוד טבעוני, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا يونانية، سيخ نباتي، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Греческая пита, веганский шашлык, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Ελληνική πίτα, vegan σουβλάκι, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια',
        },
        price: '30 ₪',
      },
      {
        name: {
          en: 'Souvlaki Pita Steak',
          he: 'פיתה סובלקי סטייק',
          ar: 'بيتا سوفلاكي ستيك',
          ru: 'Пита сувлаки стейк',
          el: 'Πίτα σουβλάκι μπριζόλα',
        },
        description: {
          en: 'Greek pita, white meat sirloin steak, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה יוונית, סטייק בשר לבן סינטה, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا يونانية، ستيك لحم أبيض، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Греческая пита, стейк из белого мяса, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Ελληνική πίτα, μπριζόλα λευκού κρέατος, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια',
        },
        price: '35 ₪',
      },
      {
        name: {
          en: 'Souvlaki Pita Gluten Free',
          he: 'פיתה סובלקי ללא גלוטן',
          ar: 'بيتا سوفلاكي خالية من الغلوتين',
          ru: 'Пита сувлаки без глютена',
          el: 'Πίτα σουβλάκι χωρίς γλουτένη',
        },
        description: {
          en: 'Gluten free pita, skewer of choice, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'פיתה ללא גלוטן, שיפוד לבחירה, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'بيتا خالية من الغلوتين، سيخ حسب الاختيار، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Пита без глютена, шашлык на выбор, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Πίτα χωρίς γλουτένη, σουβλάki επιλογής, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια',
        },
        price: '40 ₪',
        badge: 'GF',
      },
      {
        name: {
          en: 'Double Skewer',
          he: 'תוספת שיפוד נוסף',
          ar: 'سيخ إضافي',
          ru: 'Двойной шашлык',
          el: 'Διπλό σουβλάκι',
        },
        description: {
          en: 'Add an extra skewer to any pita',
          he: 'הוסף שיפוד נוסף לכל פיתה',
          ar: 'أضف سيخ إضافي لأي بيتا',
          ru: 'Добавьте дополнительный шашлык к любой пите',
          el: 'Προσθήκη επιπλέον σουβλακι σε οποιαδήποτε πίτα',
        },
        price: '+15 ₪',
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
      el: 'Πιάτα',
    },
    icon: '🍽️',
    items: [
      {
        name: {
          en: 'Souvlaki Plate',
          he: 'צלחת סובלקי',
          ar: 'طبق سوفلاكي',
          ru: 'Тарелка сувлаки',
          el: 'Πιάτο σουβλάκι',
        },
        description: {
          en: 'Skewers of choice, tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'שיפודים לבחירה, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'أسياخ حسب الاختيار، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Шашлык на выбор, соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Σουβλάκι επιλογής, σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια',
        },
        price: '40 ₪',
      },
      {
        name: {
          en: 'Souvlaki Plate Gyros',
          he: 'צלחת גירוס',
          ar: 'طبق غيروس',
          ru: 'Тарелка гирос',
          el: 'Πιάτο γύρος',
        },
        description: {
          en: 'White meat gyros (shawarma), tzatziki/spicy sauce, onion, tomato, lettuce, chips',
          he: 'שווארמה לבן, רוטב צזיקי/חריף, בצל, עגבנייה, חסה, צ׳יפס',
          ar: 'غيروس لحم أبيض (شاورما)، صلصة تزاتزيكي/حارة، بصل، طماطم، خس، بطاطس',
          ru: 'Гирос из белого мяса (шаурма), соус дзадзики/острый, лук, помидор, салат, чипсы',
          el: 'Γύρος λευκό κρέας (σεβλάχι), σως τζατζίκι/καυτερή, κρεμμύδι, ντομάτα, μαρούλι, πατατάκια',
        },
        price: '50 ₪',
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
      el: 'Μερίδες',
    },
    icon: '🍖',
    items: [
      {
        name: {
          en: 'Personal Platter',
          he: 'מגש שווארמה אישי',
          ar: 'صينية شاورما فردية',
          ru: 'Индивидуальный поднос',
          el: 'Μερίδα ατόμου',
        },
        description: {
          en: 'White meat gyros, chips, tzatziki sauce, fresh vegetables, Greek salad',
          he: 'שווארמה לבן, צ׳יפס, רוטב צזיקי, ירקות טריים, סלט יווני',
          ar: 'غيروس لحم أبيض، بطاطس، صلصة تزاتزيكي، خضروات طازجة، سلطة يونانية',
          ru: 'Гирос из белого мяса, чипсы, соус дзадзики, свежие овощи, греческий салат',
          el: 'Γύρος λευκό κρέας, πατατάκια, σως τζατζίκι, φρέσκα λαχανικά, ελληνική σαλάτα',
        },
        price: '50 ₪',
        badge: '1-2',
      },
      {
        name: {
          en: 'Couple Platter',
          he: 'מגש שווארמה זוגי',
          ar: 'صينية شاورما زوجية',
          ru: 'Парный поднос',
          el: 'Μερίδα ζευγαριού',
        },
        description: {
          en: 'White meat gyros, 2 types of skewers, chips, sauces, vegetables, salads',
          he: 'שווארמה לבן, 2 סוגי שיפודים, צ׳יפס, רטבים, ירקות, סלטים',
          ar: 'غيروس لحم أبيض، نوعان من الأسياخ، بطاطس، صلصات، خضروات، سلطات',
          ru: 'Гирос из белого мяса, 2 вида шашлыка, чипсы, соусы, овощи, салаты',
          el: 'Γύρος λευκό κρέας, 2 είδη σουβλακιών, πατατάκια, σως, λαχανικά, σαλάτες',
        },
        price: '120 ₪',
        badge: '2-3',
      },
      {
        name: {
          en: 'Family Platter',
          he: 'מגש שווארמה משפחתי',
          ar: 'صينية شاورما عائلية',
          ru: 'Семейный поднос',
          el: 'Μερίδα οικογένειας',
        },
        description: {
          en: 'White meat gyros, 3 types of skewers, chips, sauces, vegetables, salads, pitas',
          he: 'שווארמה לבן, 3 סוגי שיפודים, צ׳יפס, רטבים, ירקות, סלטים, פיתות',
          ar: 'غيروس لحم أبيض، 3 أنواع من الأسياخ، بطاطس، صلصات، خضروات، سلطات، بيتا',
          ru: 'Гирос из белого мяса, 3 вида шашлыка, чипсы, соусы, овощи, салаты, питы',
          el: 'Γύρος λευκό κρέας, 3 είδη σουβλακιών, πατατάκια, σως, λαχανικά, σαλάτες, πίτες',
        },
        price: '170 ₪',
        badge: '4-5',
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
      el: 'Πίτσα γύρος',
    },
    icon: '🍕',
    items: [
      {
        name: {
          en: 'Pizza Gyros (Small)',
          he: 'פיצה גירוס קטנה',
          ar: 'بيتزا غيروس صغيرة',
          ru: 'Пица гирос (маленькая)',
          el: 'Πίτσα γύρος (μικρή)',
        },
        description: {
          en: 'Pizza with white meat gyros and chips',
          he: 'פיצה עם שווארמה לבן וצ׳יפס',
          ar: 'بيتزا مع غيروس لحم أبيض وبطاطس',
          ru: 'Пица с гирос из белого мяса и чипсами',
          el: 'Πίτσα με γύρο λευκό κρέας και πατατάκια',
        },
        price: '40 ₪',
      },
      {
        name: {
          en: 'Pizza Gyros (Large)',
          he: 'פיצה גירוס גדולה',
          ar: 'بيتزا غيروس كبيرة',
          ru: 'Пица гирос (большая)',
          el: 'Πίτσα γύρος (μεγάλη)',
        },
        description: {
          en: 'Pizza with white meat gyros and chips',
          he: 'פיצה עם שווארמה לבן וצ׳יפס',
          ar: 'بيتزا مع غيروس لحم أبيض وبطاطس',
          ru: 'Пица с гирос из белого мяса и чипсами',
          el: 'Πίτσα με γύρο λευκό κρέας και πατατάκια',
        },
        price: '70 ₪',
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
      el: 'Σαλάτες',
    },
    icon: '🥗',
    items: [
      {
        name: {
          en: 'Greek Salad',
          he: 'סלט יווני',
          ar: 'سلطة يونانية',
          ru: 'Греческий салат',
          el: 'Ελληνική σαλάτα',
        },
        description: {
          en: 'Tomatoes, cucumber, bell pepper, onion, black kalamata olives, feta cheese',
          he: 'עגבניות, מלפפון, פלפל מחוק, בצל, זיתים שחורים קלמטה, גבינת פטה',
          ar: 'طماطم، خيار، فلفل حلو، بصل، زيتون كالاماتا أسود، جبنة فيتا',
          ru: 'Помидоры, огурец, болгарский перец, лук, черные оливки каламата, сыр фета',
          el: 'Ντομάτες, αγγούρι, γλυκό πιπέρι, κρεμμύδι, μαύρες ελιές καλαμών, φέτα',
        },
        price: '40 ₪',
        badge: '🌿',
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
    icon: '🍟',
    items: [
      {
        name: {
          en: 'Fries Chips',
          he: 'צ׳יפס',
          ar: 'بطاطس',
          ru: 'Картофель фри',
          el: 'Πατατάκια',
        },
        description: {
          en: 'Crispy and tasty chips',
          he: 'צלחת צ׳יפס פריך וטעים',
          ar: 'بطاطس مقرمشة ولذيذة',
          ru: 'Хрустящие и вкусные чипсы',
          el: 'Τραγανά και νόστιμα πατατάκια',
        },
        price: '15 ₪',
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
      el: 'Αναψυκτικά',
    },
    icon: '🥤',
    items: [
      {
        name: {
          en: 'Soft Drinks',
          he: 'משקאות קלים',
          ar: 'مشروبات غازية',
          ru: 'Безалкогольные напитки',
          el: 'Αναψυκτικά',
        },
        description: {
          en: 'Coca Cola, Cola Zero, Fanta, Sprite, Grape',
          he: 'קוקה קולה, קולה זירו, פנטה, ספרייט, ענבים',
          ar: 'كوكا كولا، كولا زيرو، فانتا، سبرايت، عنب',
          ru: 'Кока Кола, Кола Зеро, Фанта, Спрайт, Виноградный',
          el: 'Coca Cola, Cola Zero, Fanta, Sprite, Σταφυλάδα',
        },
        price: '7 ₪',
      },
      {
        name: {
          en: 'Water',
          he: 'מים',
          ar: 'مياه',
          ru: 'Вода',
          el: 'Νερό',
        },
        description: {
          en: 'Mineral water',
          he: 'מים מינרליים',
          ar: 'مياه معدنية',
          ru: 'Минеральная вода',
          el: 'Μεταλλικό νερό',
        },
        price: '5 ₪',
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
    icon: '🍷',
    items: [
      {
        name: {
          en: 'Drift Beer (1/3)',
          he: 'בירה דריפט',
          ar: 'بيرة دريفت',
          ru: 'Пиво Drift (1/3)',
          el: 'Μπύρα Drift (1/3)',
        },
        description: {
          en: 'Perfect house beer',
          he: 'בירה דריפט מושלמת',
          ar: 'بيرة البيت المثالية',
          ru: 'Идеальное домашнее пиво',
          el: 'Τέλεια μπύρα σπίτια',
        },
        price: '15 ₪',
      },
      {
        name: {
          en: 'Wine (Glass)',
          he: 'יין לכוס',
          ar: 'نبيذ بالكأس',
          ru: 'Вино (бокал)',
          el: 'Κρασί (ποτήρι)',
        },
        description: {
          en: 'Red/White/Rose wine',
          he: 'יין אדום/לבן/רוזה',
          ar: 'نبيذ أحمر/أبيض/وردي',
          ru: 'Красное/белое/розовое вино',
          el: 'Κόκκινο/Λευκό/Rose κρασί',
        },
        price: '15 ₪',
      },
      {
        name: {
          en: 'Wine Bottle',
          he: 'בקבוק יין',
          ar: 'زجاجة نبيذ',
          ru: 'Бутылка вина',
          el: 'Μπουκάλι κρασιού',
        },
        description: {
          en: 'Quality wine bottle',
          he: 'בקבוק יין איכותי',
          ar: 'زجاجة نبيذ عالي الجودة',
          ru: 'Бутылка качественного вина',
          el: 'Μπουκάλι ποιοτικού κρασιού',
        },
        price: '100 ₪',
      },
      {
        name: {
          en: 'Whiskey',
          he: 'וויסקי',
          ar: 'ويسكي',
          ru: 'Виски',
          el: 'Ουίσκι',
        },
        description: {
          en: 'Fine whiskey',
          he: 'וויסקי משובח',
          ar: 'ويسكي فاخر',
          ru: 'Отличное виски',
          el: 'Προσεγμένη ουίσκι',
        },
        price: '30 ₪',
      },
      {
        name: {
          en: 'Ouzo Plomari',
          he: 'אוזו פלומרי',
          ar: 'أوزو بلوماري',
          ru: 'Узо Пломари',
          el: 'Ούζο Πλομαριού',
        },
        description: {
          en: 'Ouzo Plomari bottle 200ml',
          he: 'בקבוק אוזו פלומרי 200 מ״ל',
          ar: 'زجاجة أوزو بلوماري 200 مل',
          ru: 'Бутылка узо Пломари 200мл',
          el: 'Μπουκάλι ούζο Πλομαρίου 200ml',
        },
        price: '70 ₪',
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

interface MenuProps {
  language: Language;
  id?: string;
}

export default function Menu({ language, id = 'menu' }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0].id);

  const currentCategory =
    MENU_CATEGORIES.find((cat) => cat.id === activeCategory) || MENU_CATEGORIES[0];
  const isRtl = language === 'he' || language === 'ar';

  const getLocalizedText = (textObj: { [key: string]: string }) => textObj[language] || textObj.en;

  return (
    <section
      id={id}
      className="relative py-20 px-4 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Floating background decorations */}
      <FloatingDecorations />

      <div className="relative max-w-7xl mx-auto">
        {/* Header - letters float in, subtitle fades in */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            <span className="inline-block bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shine_4s_linear_infinite]">
              {SECTION_TITLES[language as keyof typeof SECTION_TITLES]?.title}
            </span>
          </h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {SECTION_TITLES[language as keyof typeof SECTION_TITLES]?.subtitle}
          </motion.p>
          <motion.div
            className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
        </motion.div>

        {/* Category Tabs with animated pill indicator */}
        <div className="mb-10">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide sticky top-0 bg-amber-50/80 dark:bg-gray-900/80 backdrop-blur-md z-10 py-2 -mx-4 px-4">
            {MENU_CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`
                    relative flex items-center gap-2 px-5 py-3 rounded-full font-medium whitespace-nowrap transition-colors duration-300
                    ${
                      isActive
                        ? 'text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 shadow-lg shadow-orange-500/30"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative text-xl">{category.icon}</span>
                  <span className="relative">{getLocalizedText(category.name)}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Category Title */}
        <motion.div
          key={`title-${activeCategory}`}
          className="text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3 flex-wrap">
            <motion.span
              className="text-3xl md:text-4xl inline-block"
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              {currentCategory.icon}
            </motion.span>
            <span>{getLocalizedText(currentCategory.name)}</span>
          </h3>
        </motion.div>

        {/* Menu Items Grid - plates slide in alternating from sides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              show: { transition: { staggerChildren: 0.08 } },
              hidden: {},
              exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
            }}
          >
            {currentCategory.items.map((item, index) => (
              <MenuItemCard
                key={`${activeCategory}-${index}`}
                item={item}
                index={index}
                isRtl={isRtl}
                getLocalizedText={getLocalizedText}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Category Scroll Indicator */}
        <motion.div
          className="flex justify-center mt-10 text-gray-500 dark:text-gray-400 text-sm"
          animate={{ x: [0, 6, 0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span>{SCROLL_HINTS[language as keyof typeof SCROLL_HINTS] || SCROLL_HINTS.en}</span>
        </motion.div>
      </div>

      {/* Local keyframes (title shine) */}
      <style>{`
        @keyframes shine {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </section>
  );
}

/* ---------------- MenuItemCard: plate slides in + 3D tilt on hover ---------------- */

interface CardProps {
  item: MenuItem;
  index: number;
  isRtl: boolean;
  getLocalizedText: (obj: { [k: string]: string }) => string;
}

function MenuItemCard({ item, index, isRtl, getLocalizedText }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  // Alternate slide direction: odd items come from the "far" side, even from the "near" side.
  // Respect RTL so plates always appear to enter from outside the viewport.
  const fromLeft = index % 2 === 0;
  const xInitial = (fromLeft ? -120 : 120) * (isRtl ? -1 : 1);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      variants={{
        hidden: { opacity: 0, x: xInitial, rotate: fromLeft ? -4 : 4, scale: 0.9 },
        show: {
          opacity: 1,
          x: 0,
          rotate: 0,
          scale: 1,
          transition: { type: 'spring', stiffness: 120, damping: 18, mass: 0.8 },
        },
        exit: { opacity: 0, y: 24, scale: 0.95, transition: { duration: 0.2 } },
      }}
      whileHover={{ y: -6 }}
      style={{ perspective: 1000 }}
      className="group"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-md group-hover:shadow-2xl group-hover:shadow-amber-300/40 dark:group-hover:shadow-amber-900/40 transition-shadow duration-300 overflow-hidden border border-amber-200 dark:border-amber-900/30 group-hover:border-amber-400 dark:group-hover:border-amber-700"
      >
        {/* shine sweep on hover */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative p-5" style={{ transform: 'translateZ(20px)' }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h4 className="text-lg font-bold text-amber-950 dark:text-amber-100 leading-tight">
                {getLocalizedText(item.name)}
              </h4>
            </div>
            <div className="flex flex-col items-end gap-2">
              <motion.span
                whileHover={{ scale: 1.12, rotate: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-lg font-bold shadow-md shadow-amber-500/30"
              >
                {item.price}
              </motion.span>
              {item.badge && (
                <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full font-medium border border-amber-200 dark:border-amber-700">
                  {item.badge}
                </span>
              )}
            </div>
          </div>

          <p className="text-amber-900/80 dark:text-amber-100/80 text-sm leading-relaxed">
            {getLocalizedText(item.description)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- FloatingDecorations: drifting food emojis in the background ---------------- */

function FloatingDecorations() {
  const items = [
    { emoji: '🫒', top: '8%', left: '4%', size: 'text-5xl', delay: 0 },
    { emoji: '🍅', top: '18%', left: '88%', size: 'text-4xl', delay: 1.2 },
    { emoji: '🧄', top: '65%', left: '6%', size: 'text-4xl', delay: 0.6 },
    { emoji: '🌿', top: '78%', left: '92%', size: 'text-5xl', delay: 2 },
    { emoji: '🍋', top: '40%', left: '95%', size: 'text-4xl', delay: 1.6 },
    { emoji: '🫓', top: '50%', left: '2%', size: 'text-5xl', delay: 0.3 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20 dark:opacity-10 select-none">
      {items.map((it, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={`absolute ${it.size}`}
          style={{ top: it.top, left: it.left }}
          animate={{
            y: [0, -18, 0, 18, 0],
            rotate: [0, 8, -6, 4, 0],
          }}
          transition={{
            duration: 9 + (i % 3),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: it.delay,
          }}
        >
          {it.emoji}
        </motion.span>
      ))}
    </div>
  );
}
