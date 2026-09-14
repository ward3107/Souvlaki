// Static i18n strings for the Menu section, extracted so the components that
// consume them stay focused on markup and behavior.
import type { Lang, LocalizedString } from '../../utils/menuData';

export const SECTION_TITLES: Record<Lang, { title: string; subtitle: string }> = {
  en: { title: 'Our Menu', subtitle: 'Authentic Greek flavors made with love' },
  he: { title: 'התפריט שלנו', subtitle: 'טעמים יווניים אותנטיים עשויים באהבה' },
  ar: { title: 'قائمتنا', subtitle: 'نكهات يونانية أصلية مصنوعة بحب' },
  ru: { title: 'Наше меню', subtitle: 'Настоящие греческие вкусы, приготовленные с любовью' },
  el: { title: 'Το μενού μας', subtitle: 'Αυθεντικές ελληνικές γεύσεις φτιαγμένες με αγάπη' },
};

export const SCROLL_HINT: LocalizedString = {
  en: 'Swipe for more categories',
  he: 'גלול לעוד קטגוריות',
  ar: 'مرّر للمزيد من الفئات',
  ru: 'Листайте для других категорий',
  el: 'Σαρώστε για περισσότερες κατηγορίες',
};

export const CHOOSE_HINT: LocalizedString = {
  en: 'Tap a choice to order',
  he: 'לחצו על אפשרות להזמנה',
  ar: 'اضغط على اختيار للطلب',
  ru: 'Нажмите на вариант, чтобы заказать',
  el: 'Πατήστε επιλογή για παραγγελία',
};

export const FROM_LABEL: LocalizedString = {
  en: 'from',
  he: 'מ-',
  ar: 'من',
  ru: 'от',
  el: 'από',
};

export const ADDONS_LABEL: LocalizedString = {
  en: 'Add-ons',
  he: 'תוספות',
  ar: 'إضافات',
  ru: 'Дополнения',
  el: 'Προσθήκες',
};

export const ORDER_INTRO: LocalizedString = {
  en: "Hi! I'd like to order:",
  he: 'היי, אשמח להזמין:',
  ar: 'مرحبًا، أود الطلب:',
  ru: 'Здравствуйте, хочу заказать:',
  el: 'Γεια, θα ήθελα να παραγγείλω:',
};

export const ADD_LABEL: LocalizedString = {
  en: 'Add',
  he: 'הוסף',
  ar: 'أضف',
  ru: 'Добавить',
  el: 'Προσθήκη',
};

export const DETAILS_HINT: LocalizedString = {
  en: 'Tap for details',
  he: 'הקש לפרטים',
  ar: 'اضغط للتفاصيل',
  ru: 'Нажмите для деталей',
  el: 'Πατήστε για λεπτομέρειες',
};

export const BACK_LABEL: LocalizedString = {
  en: 'Back',
  he: 'חזור',
  ar: 'رجوع',
  ru: 'Назад',
  el: 'Πίσω',
};

export const YOUR_ORDER_LABEL: LocalizedString = {
  en: 'Your order',
  he: 'ההזמנה שלך',
  ar: 'طلبك',
  ru: 'Ваш заказ',
  el: 'Η παραγγελία σας',
};

export const ITEM_LABEL: LocalizedString = {
  en: 'item',
  he: 'פריט',
  ar: 'صنف',
  ru: 'позиция',
  el: 'είδος',
};

export const ITEMS_LABEL: LocalizedString = {
  en: 'items',
  he: 'פריטים',
  ar: 'أصناف',
  ru: 'позиций',
  el: 'είδη',
};

export const TOTAL_LABEL: LocalizedString = {
  en: 'Total',
  he: 'סה״כ',
  ar: 'الإجمالي',
  ru: 'Итого',
  el: 'Σύνολο',
};

export const SEND_ORDER_LABEL: LocalizedString = {
  en: 'Send via WhatsApp',
  he: 'שלח בוואטסאפ',
  ar: 'إرسال عبر واتساب',
  ru: 'Отправить в WhatsApp',
  el: 'Αποστολή στο WhatsApp',
};

export const CLEAR_CART_LABEL: LocalizedString = {
  en: 'Clear',
  he: 'נקה',
  ar: 'مسح',
  ru: 'Очистить',
  el: 'Εκκαθάριση',
};

export const CLOSE_LABEL: LocalizedString = {
  en: 'Close',
  he: 'סגור',
  ar: 'إغلاق',
  ru: 'Закрыть',
  el: 'Κλείσιμο',
};

export const VIEW_ORDER_LABEL: LocalizedString = {
  en: 'View order',
  he: 'הצג הזמנה',
  ar: 'عرض الطلب',
  ru: 'Посмотреть заказ',
  el: 'Δείτε παραγγελία',
};

export const EMPTY_CART_LABEL: LocalizedString = {
  en: 'Your order is empty.',
  he: 'ההזמנה שלך ריקה.',
  ar: 'طلبك فارغ.',
  ru: 'Ваш заказ пуст.',
  el: 'Η παραγγελία σας είναι κενή.',
};

export const REMOVE_ARIA: LocalizedString = {
  en: 'Remove',
  he: 'הסר',
  ar: 'إزالة',
  ru: 'Удалить',
  el: 'Αφαίρεση',
};

export const INCREASE_ARIA: LocalizedString = {
  en: 'Increase quantity',
  he: 'הגדל כמות',
  ar: 'زيادة الكمية',
  ru: 'Увеличить количество',
  el: 'Αύξηση ποσότητας',
};

export const DECREASE_ARIA: LocalizedString = {
  en: 'Decrease quantity',
  he: 'הקטן כמות',
  ar: 'إنقاص الكمية',
  ru: 'Уменьшить количество',
  el: 'Μείωση ποσότητας',
};

export const SEARCH_PLACEHOLDER: LocalizedString = {
  en: 'Search the menu…',
  he: 'חיפוש בתפריט…',
  ar: 'ابحث في القائمة…',
  ru: 'Поиск по меню…',
  el: 'Αναζήτηση στο μενού…',
};

export const NO_RESULTS: LocalizedString = {
  en: 'No dishes match your search.',
  he: 'לא נמצאו מנות התואמות לחיפוש.',
  ar: 'لا توجد أطباق تطابق بحثك.',
  ru: 'Ничего не найдено.',
  el: 'Δεν βρέθηκαν πιάτα.',
};

export const RESULTS_LABEL: LocalizedString = {
  en: 'results',
  he: 'תוצאות',
  ar: 'نتائج',
  ru: 'результатов',
  el: 'αποτελέσματα',
};

export const CLEAR_FILTERS_LABEL: LocalizedString = {
  en: 'Clear',
  he: 'נקה',
  ar: 'مسح',
  ru: 'Сбросить',
  el: 'Καθαρισμός',
};

export const SOLD_OUT_LABEL: LocalizedString = {
  en: 'Sold out',
  he: 'אזל מהמלאי',
  ar: 'نفد',
  ru: 'Нет в наличии',
  el: 'Εξαντλήθηκε',
};

export const NAME_LABEL: LocalizedString = {
  he: 'שם',
  en: 'Name',
  ar: 'الاسم',
  ru: 'Имя',
  el: 'Όνομα',
};

export const NAME_PLACEHOLDER: LocalizedString = {
  he: 'השם שלך (חובה)',
  en: 'Your name (required)',
  ar: 'اسمك (مطلوب)',
  ru: 'Ваше имя (обязательно)',
  el: 'Το όνομά σας (απαιτείται)',
};

export const NAME_REQUIRED_LABEL: LocalizedString = {
  he: 'יש להזין שם לפני המעבר לוואטסאפ.',
  en: 'Enter your name before continuing to WhatsApp.',
  ar: 'أدخل اسمك قبل الانتقال إلى واتساب.',
  ru: 'Введите имя перед переходом в WhatsApp.',
  el: 'Εισαγάγετε το όνομά σας πριν συνεχίσετε στο WhatsApp.',
};

export const NOTE_LABEL: LocalizedString = {
  he: 'הערה להזמנה',
  en: 'Order note',
  ar: 'ملاحظة للطلب',
  ru: 'Комментарий к заказу',
  el: 'Σημείωση παραγγελίας',
};

export const NOTE_PLACEHOLDER: LocalizedString = {
  he: 'למשל: בלי בצל (לא חובה)',
  en: 'For example: no onions (optional)',
  ar: 'مثال: بدون بصل (اختياري)',
  ru: 'Например: без лука (необязательно)',
  el: 'Π.χ. χωρίς κρεμμύδι (προαιρετικό)',
};

export const UNAVAILABLE_LABEL: LocalizedString = {
  he: 'הפריט אינו זמין כרגע — יש להסירו מההזמנה.',
  en: 'This item is currently unavailable—remove it from your order.',
  ar: 'هذا الصنف غير متاح حاليًا — أزله من الطلب.',
  ru: 'Позиция сейчас недоступна — удалите её из заказа.',
  el: 'Το είδος δεν είναι διαθέσιμο — αφαιρέστε το από την παραγγελία.',
};

export const ADDED_TO_ORDER_LABEL: LocalizedString = {
  he: 'נוסף להזמנה',
  en: 'Added to your order',
  ar: 'أُضيف إلى طلبك',
  ru: 'Добавлено в заказ',
  el: 'Προστέθηκε στην παραγγελία',
};

export const TICKET_HINT: LocalizedString = {
  he: '🖨️ כרטיס מטבח (הקש להדפסה):',
  en: '🖨️ Kitchen ticket (tap to print):',
  ar: '🖨️ تذكرة المطبخ (اضغط للطباعة):',
  ru: '🖨️ Кухонный чек (нажмите, чтобы напечатать):',
  el: '🖨️ Δελτίο κουζίνας (πατήστε για εκτύπωση):',
};
