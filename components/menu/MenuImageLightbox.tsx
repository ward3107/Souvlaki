import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Lang } from '../../utils/menuData';

const LABELS: Record<Lang, { close: string; title: string }> = {
  he: { close: 'סגירת התמונה', title: 'תמונה מוגדלת' },
  ar: { close: 'إغلاق الصورة', title: 'صورة مكبرة' },
  en: { close: 'Close image', title: 'Enlarged image' },
  ru: { close: 'Закрыть изображение', title: 'Увеличенное изображение' },
  el: { close: 'Κλείσιμο εικόνας', title: 'Μεγεθυμένη εικόνα' },
};

export default function MenuImageLightbox({
  open,
  src,
  name,
  lang,
  onClose,
}: {
  open: boolean;
  src?: string;
  name: string;
  lang: Lang;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !src) return null;
  const labels = LABELS[lang] ?? LABELS.en;

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${labels.title}: ${name}`}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={labels.close}
        className="absolute end-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
      >
        <X className="h-6 w-6" aria-hidden="true" />
      </button>
      <motion.figure
        className="flex max-h-[92vh] w-full max-w-5xl flex-col items-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.22 }}
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={src}
          alt={name}
          className="max-h-[82vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
        />
        <figcaption className="mt-3 rounded-full bg-black/55 px-4 py-2 text-center text-sm font-semibold text-white">
          {name}
        </figcaption>
      </motion.figure>
    </motion.div>,
    document.body
  );
}

export const IMAGE_VIEW_LABEL: Record<Lang, string> = {
  he: 'צפייה בתמונה',
  ar: 'عرض الصورة',
  en: 'View image',
  ru: 'Открыть фото',
  el: 'Προβολή εικόνας',
};

export function ImageViewIcon() {
  return <ZoomIn className="h-4 w-4" aria-hidden="true" />;
}
