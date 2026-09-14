import { Language, FAQItem, TranslationKey, Review } from './types';

export const TRANSLATIONS: Record<Language, Record<TranslationKey, string>> = {
  [Language.HE]: {
    nav_home: 'בית',
    nav_menu: 'תפריט',
    nav_gallery: 'גלריה',
    nav_about: 'אודות',
    nav_reviews: 'ביקורות',
    nav_faq: 'שאלות',
    nav_contact: 'צור קשר',
    hero_title: 'סובלאקי יווני כפר יאסיף',
    hero_subtitle: 'מסעדה יוונית אותנטית באווירה משפחתית',
    hero_cta_order: 'הזמן עכשיו',
    hero_cta_menu: 'לצפייה בתפריט',
    about_title: 'הסיפור שלנו',
    about_content_1:
      'אנחנו מביאים את הטעמים האותנטיים של יוון היישר לכפר יאסיף. מתכונים שעברו מדור לדור עם חומרי גלם טריים ואיכותיים.',
    about_content_2:
      'האווירה במסעדה משלבת אירוח חם עם מוזיקה יוונית שמחה, היוצרת חוויה קולינרית בלתי נשכחת.',
    gallery_title: 'גלריה',
    menu_title: 'התפריט שלנו',
    reviews_title: 'לקוחות מספרים',
    reviews_subtitle: 'תודה ללקוחות המדהימים שלנו על המילים החמות',
    faq_title: 'שאלות נפוצות',
    contact_title: 'יצירת קשר',
    footer_copyright: '© 2026 סובלאקי יווני כפר יאסיף. כל הזכויות שמורות.',
    footer_terms: 'תנאי שימוש',
    footer_privacy: 'מדיניות פרטיות',
    footer_accessibility: 'הצהרת נגישות',
    footer_follow_us: 'עקבו אחרינו',
    category_pita: 'בפיתה',
    category_plate: 'בצלחת',
    category_sides: 'תוספות',
    open_status_open: 'פתוח עכשיו',
    open_status_closed: 'סגור כעת',
    cookie_text:
      'אתר זה משתמש בעוגיות (Cookies) על מנת לשפר את חווית הגלישה ולהתאים את התוכן עבורך, בהתאם להוראות החוק.',
    cookie_accept: 'אני מסכים/ה',
    cookie_decline: 'לא תודה',
    form_title: 'כתבו ביקורת',
    form_name: 'שם מלא',
    form_rating: 'דירוג כללי',
    form_time_rating: 'דרגו את זמן הביקור',
    form_comment: 'ספר לנו על החוויה שלך',
    form_submit: 'שלח ביקורת',
    form_success: 'תודה על המשוב שלך!',
  },
  [Language.EN]: {
    nav_home: 'Home',
    nav_menu: 'Menu',
    nav_gallery: 'Gallery',
    nav_about: 'About',
    nav_reviews: 'Reviews',
    nav_faq: 'FAQ',
    nav_contact: 'Contact',
    hero_title: 'Greek Souvlaki Kafr Yasif',
    hero_subtitle: 'Authentic Greek Restaurant with Family Atmosphere',
    hero_cta_order: 'Order Now',
    hero_cta_menu: 'View Menu',
    about_title: 'Our Story',
    about_content_1:
      'We bring the authentic flavors of Greece straight to Kafr Yasif. Recipes passed down through generations with fresh, high-quality ingredients.',
    about_content_2:
      'The restaurant atmosphere combines warm hospitality with joyful Greek music, creating an unforgettable culinary experience.',
    gallery_title: 'Gallery',
    menu_title: 'Our Menu',
    reviews_title: 'What Customers Say',
    reviews_subtitle: 'Thanks to our amazing customers for the kind words',
    faq_title: 'FAQ',
    contact_title: 'Contact Us',
    footer_copyright: '© 2026 Greek Souvlaki Kafr Yasif. All rights reserved.',
    footer_terms: 'Terms of Use',
    footer_privacy: 'Privacy Policy',
    footer_accessibility: 'Accessibility Statement',
    footer_follow_us: 'Follow Us',
    category_pita: 'Pita',
    category_plate: 'Plate',
    category_sides: 'Sides',
    open_status_open: 'Open Now',
    open_status_closed: 'Closed Now',
    cookie_text:
      'This website uses cookies to improve the browsing experience and customize content for you, in accordance with the law.',
    cookie_accept: 'I Accept',
    cookie_decline: 'Decline',
    form_title: 'Leave a Review',
    form_name: 'Full Name',
    form_rating: 'Overall Rating',
    form_time_rating: 'Rate Time Spent',
    form_comment: 'Tell us about your experience',
    form_submit: 'Submit Review',
    form_success: 'Thank you for your feedback!',
  },
  [Language.AR]: {
    nav_home: 'الرئيسية',
    nav_menu: 'القائمة',
    nav_gallery: 'المعرض',
    nav_about: 'من نحن',
    nav_reviews: 'التقييمات',
    nav_faq: 'أسئلة شائعة',
    nav_contact: 'اتصل بنا',
    hero_title: 'سوفلاكي يوناني كفر ياسيف',
    hero_subtitle: 'مطعم يوناني أصيل بجو عائلي',
    hero_cta_order: 'اطلب الآن',
    hero_cta_menu: 'شاهد القائمة',
    about_title: 'قصتنا',
    about_content_1:
      'نحضر النكهات اليونانية الأصيلة مباشرة إلى كفر ياسيف. وصفات متوارثة عبر الأجيال بمكونات طازجة وعالية الجودة.',
    about_content_2:
      'يجمع جو المطعم بين الضيافة الدافئة والموسيقى اليونانية المبهجة، مما يخلق تجربة طهي لا تُنسى.',
    gallery_title: 'معرض الصور',
    menu_title: 'قائمتنا',
    reviews_title: 'ماذا يقول عملاؤنا',
    reviews_subtitle: 'شكرًا لعملائنا الرائعين على كلماتهم الطيبة',
    faq_title: 'أسئلة شائعة',
    contact_title: 'اتصل بنا',
    footer_copyright: '© 2026 سوفلاكي يوناني كفر ياسيف. جميع الحقوق محفوظة.',
    footer_terms: 'شروط الاستخدام',
    footer_privacy: 'سياسة الخصوصية',
    footer_accessibility: 'بيان إمكانية الوصول',
    footer_follow_us: 'تابعنا',
    category_pita: 'في خبز بيتا',
    category_plate: 'في طبق',
    category_sides: 'إضافات',
    open_status_open: 'مفتوح الآن',
    open_status_closed: 'مغلق الآن',
    cookie_text:
      'يستخدم هذا الموقع ملفات تعريف الارتباط (Cookies) لتحسين تجربة التصفح وتخصيص المحتوى لك، وفقًا للقانون.',
    cookie_accept: 'أوافق',
    cookie_decline: 'لا شكرًا',
    form_title: 'اترك تقييمًا',
    form_name: 'الاسم الكامل',
    form_rating: 'التقييم العام',
    form_time_rating: 'قيّم مدة زيارتك',
    form_comment: 'أخبرنا عن تجربتك',
    form_submit: 'إرسال التقييم',
    form_success: 'شكرًا لملاحظاتك!',
  },
  [Language.RU]: {
    nav_home: 'Главная',
    nav_menu: 'Меню',
    nav_gallery: 'Галерея',
    nav_about: 'О нас',
    nav_reviews: 'Отзывы',
    nav_faq: 'Вопросы',
    nav_contact: 'Контакты',
    hero_title: 'Греческий Сувлаки Кафр-Ясиф',
    hero_subtitle: 'Аутентичный греческий ресторан с семейной атмосферой',
    hero_cta_order: 'Заказать',
    hero_cta_menu: 'Меню',
    about_title: 'Наша история',
    about_content_1:
      'Мы привозим аутентичные вкусы Греции прямо в Кафр-Ясиф. Рецепты, передаваемые из поколения в поколение, и свежие ингредиенты.',
    about_content_2:
      'Атмосфера ресторана сочетает в себе теплое гостеприимство и веселую греческую музыку.',
    gallery_title: 'Галерея',
    menu_title: 'Наше меню',
    reviews_title: 'Отзывы клиентов',
    reviews_subtitle: 'Спасибо нашим замечательным клиентам за тёплые слова',
    faq_title: 'Частые вопросы',
    contact_title: 'Связаться с нами',
    footer_copyright: '© 2026 Greek Souvlaki Kafr Yasif. Все права защищены.',
    footer_terms: 'Условия',
    footer_privacy: 'Конфиденциальность',
    footer_accessibility: 'Доступность',
    footer_follow_us: 'Подписывайтесь',
    category_pita: 'В пите',
    category_plate: 'На тарелке',
    category_sides: 'Гарниры',
    open_status_open: 'Открыто',
    open_status_closed: 'Закрыто',
    cookie_text:
      'Этот сайт использует файлы cookie для улучшения просмотра и персонализации контента в соответствии с законом.',
    cookie_accept: 'Принять',
    cookie_decline: 'Отклонить',
    form_title: 'Оставить отзыв',
    form_name: 'Полное имя',
    form_rating: 'Общая оценка',
    form_time_rating: 'Оцените проведенное время',
    form_comment: 'Расскажите о вашем опыте',
    form_submit: 'Отправить отзыв',
    form_success: 'Спасибо за ваш отзыв!',
  },
  [Language.EL]: {
    nav_home: 'Αρχική',
    nav_menu: 'Μενού',
    nav_gallery: 'Συλλογή',
    nav_about: 'Σχετικά',
    nav_reviews: 'Κριτικές',
    nav_faq: 'Συχνές Ερωτήσεις',
    nav_contact: 'Επικοινωνία',
    hero_title: 'Ελληνικό Σουβλάκι Καφρ Γιασίφ',
    hero_subtitle: 'Αυθεντικό Ελληνικό Εστιατόριο',
    hero_cta_order: 'Παραγγελία',
    hero_cta_menu: 'Δείτε το μενού',
    about_title: 'Η ιστορία μας',
    about_content_1:
      'Φέρνουμε τις αυθεντικές γεύσεις της Ελλάδας απευθείας στο Καφρ Γιασίφ, με οικογενειακές συνταγές και φρέσκα, ποιοτικά υλικά.',
    about_content_2:
      'Η ατμόσφαιρα του εστιατορίου συνδυάζει ζεστή φιλοξενία με χαρούμενη ελληνική μουσική.',
    gallery_title: 'Συλλογή',
    menu_title: 'Το Μενού μας',
    reviews_title: 'Τι λένε οι πελάτες',
    reviews_subtitle: 'Ευχαριστούμε τους υπέροχους πελάτες μας',
    faq_title: 'Συχνές Ερωτήσεις',
    contact_title: 'Επικοινωνία',
    footer_copyright: '© 2026 Greek Souvlaki Kafr Yasif. Με επιφύλαξη παντός δικαιώματος.',
    footer_terms: 'Όροι',
    footer_privacy: 'Απόρρητο',
    footer_accessibility: 'Προσβασιμότητα',
    footer_follow_us: 'Ακολουθήστε μας',
    category_pita: 'Πίτα',
    category_plate: 'Μερίδα',
    category_sides: 'Συνοδευτικά',
    open_status_open: 'Ανοιχτά',
    open_status_closed: 'Κλειστό',
    cookie_text:
      'Αυτός ο ιστότοπος χρησιμοποιεί cookies για τη βελτίωση της εμπειρίας περιήγησης, σύμφωνα με τη νομοθεσία.',
    cookie_accept: 'Αποδοχή',
    cookie_decline: 'Απόρριψη',
    form_title: 'Αφήστε μια κριτική',
    form_name: 'Ονοματεπώνυμο',
    form_rating: 'Γενική βαθμολογία',
    form_time_rating: 'Αξιολογήστε τον χρόνο',
    form_comment: 'Πείτε μας για την εμπειρία σας',
    form_submit: 'Υποβολή',
    form_success: 'Ευχαριστούμε για τα σχόλιά σας!',
  },
};

// SEO Metadata for multi-language optimization
export const SEO_METADATA: Record<
  Language,
  {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    ogLocale: string;
  }
> = {
  [Language.HE]: {
    title: 'סובלאקי יווני כפר יאסיף | Greek Souvlaki Kfar Yasif - מסעדה יוונית אותנטית',
    description:
      'סובלאקי יווני אותנטי בכפר יאסיף. פיתה טרייה, גירוס, שיפודים ועוד. הזמינו עכשיו! פתוח רביעי–שבת 13:00–00:00. טלפון 04-812-2980.',
    keywords:
      'סובלאקי, גירוס, מסעדה יוונית, אוכל יווני, פיתה יוונית, שווארמה יוונית, כפר יאסיף, מסעדה בגליל, אוכל בצפון, סובלאקי בפיתה, גירוס בפיתה',
    ogTitle: 'סובלאקי יווני כפר יאסיף | מסעדה יוונית אותנטית',
    ogDescription:
      'סובלאקי יווני בכפר יאסיף עם פיתה טרייה, גירוס עסיסי ושיפודים על האש. פתוח רביעי–שבת 13:00–00:00.',
    ogLocale: 'he_IL',
  },
  [Language.AR]: {
    title: 'سوفلاكي يوناني كفر ياسيف | Greek Souvlaki Kafr Yasif - مطعم يوناني أصيل',
    description:
      'سوفلاكي يوناني أصيل في كفر ياسيف. خبز بيتا طازج، جيروس، أسياخ والمزيد. اطلب الآن! مفتوح الأربعاء-السبت 13:00-00:00. اتصل 04-812-2980. مطعم يوناني محلي',
    keywords:
      'سوفلاكي, جيروس, مطعم يوناني, طعام يوناني, خبز بيتا يوناني, شاورما يونانية, كفر ياسيف, مطعم في الجليل, طعام في الشمال, سوفلاكي في بيتا, جيروس في بيتا',
    ogTitle: 'سوفلاكي يوناني كفر ياسيف | مطعم يوناني أصيل',
    ogDescription:
      'أفضل سوفلاكي يوناني في كفر ياسيف! خبز بيتا طازج، جيروس طري، أسياخ مشوية. مفتوح الأربعاء-السبت 13:00-00:00. اطلب الآن!',
    ogLocale: 'ar_IL',
  },
  [Language.RU]: {
    title: 'Греческий сувлаки Кафр Ясиф | Greek Souvlaki Kfar Yasif - Греческий ресторан',
    description:
      'Аутентичный греческий сувлаки в Кафр Ясиф. Свежая пита, гирос, шашлыки и многое другое. Закажите сейчас! Открыто ср-сб 13:00-00:00. Тел 04-812-2980. Греческий ресторан',
    keywords:
      'сувлаки, гирос, греческий ресторан, греческая кухня, греческая пита, греческая шаурма, Кафр Ясиф, ресторан в Галилее, еда на севере, сувлаки в пите, гирос в пите',
    ogTitle: 'Греческий сувлаки Кафр Ясиф | Аутентичный греческий ресторан',
    ogDescription:
      'Лучший греческий сувлаки в Кафр Ясиф! Свежая пита, сочный гирос, шашлыки на углях. Открыто ср-сб 13:00-00:00. Закажите сейчас!',
    ogLocale: 'ru_IL',
  },
  [Language.EL]: {
    title: 'Ελληνικό σουβλάκι Καφρ Γιασίφ | Greek Souvlaki Kfar Yasif - Ελληνικό εστιατόριο',
    description:
      'Αυθεντικό ελληνικό σουβλάκι στο Καφρ Γιασίφ. Φρέσκες πίτες, γύρος, σουβλάκια και άλλα. Ανοιχτά Τετάρτη–Σάββατο 13:00–00:00. Τηλ. 04-812-2980.',
    keywords:
      'σουβλάκι, γύρος, ελληνικό εστιατόριο, ελληνική κουζίνα, ελληνική πίτα, ελληνική σούβλα, Καφρ Γιασίφ, εστιατόριο στη Γαλιλαία, φαγητό στον βορρά, σουβλάκι στην πίτα, γύρος στην πίτα',
    ogTitle: 'Ελληνικό σουβλάκι Καφρ Γιασίφ | Αυθεντικό ελληνικό εστιατόριο',
    ogDescription:
      'Αυθεντικό ελληνικό σουβλάκι στο Καφρ Γιασίφ, με φρέσκες πίτες, ζουμερό γύρο και σουβλάκια στα κάρβουνα. Ανοιχτά Τετάρτη–Σάββατο 13:00–00:00.',
    ogLocale: 'el_IL',
  },
  [Language.EN]: {
    title: 'Greek Souvlaki Kafr Yasif | סובלאקי יווני כפר יאסיף - Authentic Greek Restaurant',
    description:
      'Authentic Greek souvlaki in Kafr Yasif. Fresh pita, gyros, skewers & more. Order now! Open Wed-Sat 13:00-00:00. Call 04-812-2980. Local Greek restaurant',
    keywords:
      'souvlaki, gyros, greek restaurant, greek food, greek pita, greek shawarma, kafr yasif, galilee restaurant, northern israel food, souvlaki in pita, gyros in pita',
    ogTitle: 'Greek Souvlaki Kafr Yasif | Authentic Greek Restaurant',
    ogDescription:
      'Best Greek souvlaki in Kafr Yasif! Fresh pita, juicy gyros, grilled skewers. Open Wed-Sat 13:00-00:00. Order now!',
    ogLocale: 'en_IL',
  },
};

export const REVIEWS: Review[] = [
  // No fake reviews - waiting for real customer reviews!
];

export const FAQS: FAQItem[] = [
  {
    id: '1',
    question: {
      he: 'מה שעות הפעילות של המסעדה?',
      en: "What are the restaurant's opening hours?",
      ar: 'ما هي ساعات عمل المطعم؟',
      ru: 'Каковы часы работы ресторана?',
      el: 'Ποιες είναι οι ώρες λειτουργίας του εστιατορίου;',
    },
    answer: {
      he: 'המסעדה פתוחה בימים רביעי עד שבת, בשעות 13:00–00:00. בימים ראשון עד שלישי המסעדה סגורה.',
      en: 'The restaurant is open Wednesday to Saturday, 13:00–00:00, and closed Sunday to Tuesday.',
      ar: 'المطعم مفتوح من الأربعاء إلى السبت، من الساعة 13:00 حتى 00:00، ومغلق من الأحد إلى الثلاثاء.',
      ru: 'Ресторан открыт со среды по субботу, с 13:00 до 00:00. Воскресенье-вторник ресторан закрыт.',
      el: 'Το εστιατόριο είναι ανοιχτό Τετάρτη έως Σάββατο, 13:00–00:00, και κλειστό Κυριακή έως Τρίτη.',
    },
  },
  {
    id: '2',
    question: {
      he: 'איפה נמצאת המסעדה?',
      en: 'Where is the restaurant located?',
      ar: 'أين يقع المطعم؟',
      ru: 'Где находится ресторан?',
      el: 'Πού βρίσκεται το εστιατόριο;',
    },
    answer: {
      he: 'המסעדה ממוקמת בכביש 70, כפר יאסיף בגליל המערבי. ניתן להגיע בקלות עם Waze או Google Maps.',
      en: 'The restaurant is located on Route 70, Kafr Yasif in the Western Galilee. Easy to reach with Waze or Google Maps.',
      ar: 'يقع المطعم على طريق 70، كفر ياسيف في الجليل الغربي. يمكن الوصول بسهولة عبر Waze أو Google Maps.',
      ru: 'Ресторан находится на шоссе 70, Кафр-Ясиф в Западной Галилее. Легко добраться с Waze или Google Картами.',
      el: 'Το εστιατόριο βρίσκεται στην Οδό 70, στο Καφρ Γιασίφ της Δυτικής Γαλιλαίας. Θα μας βρείτε εύκολα μέσω Waze ή Google Maps.',
    },
  },
  {
    id: '3',
    question: {
      he: 'מה המחיר של סובלאקי בפיתה?',
      en: 'What is the price of a pita souvlaki?',
      ar: 'ما هو سعر سوفلاكي في خبز بيتا؟',
      ru: 'Какова цена сувлаки в пите?',
      el: 'Πόσο κοστίζει το σουβλάκι στην πίτα;',
    },
    answer: {
      he: 'סובלאקי בפיתה מתחיל ב־30 ₪ וכולל פיתה יוונית, שיפוד לבחירה, צזיקי או רוטב חריף, ירקות טריים וצ׳יפס.',
      en: 'Pita souvlaki starts at ₪30 and includes Greek pita, your choice of skewer, tzatziki or spicy sauce, fresh vegetables and fries.',
      ar: 'يبدأ سعر سوفلاكي في خبز بيتا من 30 شيكل، ويشمل سيخًا حسب الاختيار، تزاتزيكي أو صلصة حارة، خضروات طازجة وبطاطا مقلية.',
      ru: 'Сувлаки в пите стоит от 30 ₪ и включает греческую питу, шашлычок на выбор, соус цацики/острый, свежие овощи и картофель фри.',
      el: 'Το σουβλάκι στην πίτα ξεκινά από 30 ₪ και περιλαμβάνει σουβλάκι επιλογής, τζατζίκι ή καυτερή σάλτσα, φρέσκα λαχανικά και πατάτες.',
    },
  },
  {
    id: '4',
    question: {
      he: 'האם יש אפשרויות טבעוניות או ללא גלוטן?',
      en: 'Are there vegan or gluten-free options?',
      ar: 'هل هناك خيارات نباتية أو خالية من الغلوتين؟',
      ru: 'Есть ли веганские или безглютеновые опции?',
      el: 'Υπάρχουν βίγκαν επιλογές ή επιλογές χωρίς γλουτένη;',
    },
    answer: {
      he: 'כן! יש לנו סובלאקי טבעוני בפיתה (30₪) וגם אפשרות לפיתה ללא גלוטן (40₪) עם כל סוגי השיפודים.',
      en: 'Yes! We have vegan souvlaki in pita (₪30) and also gluten-free pita option (₪40) with all types of skewers.',
      ar: 'نعم. لدينا سوفلاكي نباتي بالكامل في خبز بيتا (30 شيكل)، وخيار بيتا خالٍ من الغلوتين (40 شيكل) مع جميع أنواع الأسياخ.',
      ru: 'Да! У нас есть веганский сувлаки в пите (30 ₪) и также безглютеновая пита (40 ₪) со всеми видами шашлычков.',
      el: 'Ναι. Προσφέρουμε βίγκαν σουβλάκι στην πίτα (30 ₪) και πίτα χωρίς γλουτένη (40 ₪) με επιλογή από όλα τα σουβλάκια.',
    },
  },
  {
    id: '5',
    question: {
      he: 'איך אפשר להזמין מקום?',
      en: 'How can I reserve a table?',
      ar: 'كيف يمكنني حجز طاولة؟',
      ru: 'Как забронировать столик?',
      el: 'Πώς μπορώ να κάνω κράτηση;',
    },
    answer: {
      he: 'ניתן להתקשר למספר 04-812-2980 או לשלוח הודעת WhatsApp. מומלץ להזמין מקום מראש לימי שישי ושבת.',
      en: 'Call 04-812-2980 or send us a WhatsApp message. We recommend reserving in advance for Friday and Saturday.',
      ar: 'يمكنك الاتصال على 04-812-2980 أو إرسال رسالة عبر WhatsApp. ننصح بالحجز مسبقًا ليومي الجمعة والسبت.',
      ru: 'Позвоните по номеру 04-812-2980 или отправьте сообщение в WhatsApp. На пятницу и субботу рекомендуем бронировать столик заранее.',
      el: 'Καλέστε στο 04-812-2980 ή στείλτε μας μήνυμα στο WhatsApp. Για Παρασκευή και Σάββατο συνιστούμε κράτηση εκ των προτέρων.',
    },
  },
  {
    id: '6',
    question: {
      he: 'מה ההבדל בין סובלאקי לגירוס?',
      en: "What's the difference between souvlaki and gyros?",
      ar: 'ما الفرق بين السوفلاكي والجيروس؟',
      ru: 'В чем разница между сувлаки и гирос?',
      el: 'Ποια είναι η διαφορά ανάμεσα στο σουβλάκι και τον γύρο;',
    },
    answer: {
      he: 'סובלאקי הוא שיפוד בשר צלוי על האש, בעוד גירוס (שווארמה יוונית) הוא בשר שנחתך משיפוד מסתובב. שניהם מוגשים בפיתה יוונית עם ירקות ורטבים.',
      en: 'Souvlaki is meat grilled on a skewer over fire, while gyros (Greek shawarma) is meat sliced from a rotating spit. Both are served in Greek pita with vegetables and sauces.',
      ar: 'السوفلاكي هو لحم مشوي على سيخ فوق النار، بينما الجيروس (شاورما يونانية) هو لحم مقطع من سيخ دوار. كلاهما يقدم في خبز بيتا يوناني مع الخضروات والصلصات.',
      ru: 'Сувлаки — это мясо, жаренное на шампуре над огнем, а гирос (греческая шаурма) — это мясо, нарезанное с вращающегося вертела. Оба подаются в греческой пите с овощами и соусами.',
      el: 'Το σουβλάκι είναι κρέας ψημένο σε καλαμάκι στα κάρβουνα, ενώ ο γύρος κόβεται από περιστρεφόμενη σούβλα. Και τα δύο σερβίρονται σε ελληνική πίτα με λαχανικά και σάλτσες.',
    },
  },
];
