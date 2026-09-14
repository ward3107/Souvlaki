import type { Lang } from '../../utils/menuData';

export const IMAGE_LIGHTBOX_LABELS: Record<Lang, { close: string; title: string }> = {
  he: { close: 'סגירת התמונה', title: 'תמונה מוגדלת' },
  ar: { close: 'إغلاق الصورة', title: 'صورة مكبرة' },
  en: { close: 'Close image', title: 'Enlarged image' },
  ru: { close: 'Закрыть изображение', title: 'Увеличенное изображение' },
  el: { close: 'Κλείσιμο εικόνας', title: 'Μεγεθυμένη εικόνα' },
};

export const IMAGE_VIEW_LABEL: Record<Lang, string> = {
  he: 'צפייה בתמונה',
  ar: 'عرض الصورة',
  en: 'View image',
  ru: 'Открыть фото',
  el: 'Προβολή εικόνας',
};
