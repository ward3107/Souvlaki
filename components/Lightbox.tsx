import { useEffect, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';

interface Props {
  lang: Language;
  index: number | null;
  images: string[];
  onClose: () => void;
  onChange: (index: number) => void;
}

const SWIPE_THRESHOLD = 50;

export default function Lightbox({ lang, index, images, onClose, onChange }: Props) {
  const isRtl = isRtlLang(lang);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const next = () => {
    if (index === null) return;
    onChange((index + 1) % images.length);
  };
  const prev = () => {
    if (index === null) return;
    onChange((index - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (index === null) return;
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          isRtl ? next() : prev();
          break;
        case 'ArrowRight':
          isRtl ? prev() : next();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isRtl]);

  if (index === null) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > SWIPE_THRESHOLD) {
      isRtl ? prev() : next();
    } else if (distance < -SWIPE_THRESHOLD) {
      isRtl ? next() : prev();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={`${tx(lang, 'גלריית תמונות', 'Image Gallery', 'معرض الصور')} - ${index + 1} / ${images.length}`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full z-10 transition-colors"
        aria-label={tx(lang, 'סגור גלריה', 'Close gallery', 'إغلاق المعرض')}
      >
        <X className="w-8 h-8" aria-hidden="true" />
      </button>

      <div className="absolute top-4 left-4 text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
        {index + 1} / {images.length}
      </div>

      <button
        onClick={prev}
        className="absolute left-4 rtl:left-auto rtl:right-4 text-white p-3 hover:bg-white/20 rounded-full transition-all hover:scale-110"
        aria-label={tx(lang, 'תמונה קודמת', 'Previous image', 'الصورة السابقة')}
      >
        <ChevronDown
          className={`w-10 h-10 ${isRtl ? 'rotate-90' : '-rotate-90'}`}
          aria-hidden="true"
        />
      </button>

      <div
        className="absolute left-0 top-0 bottom-0 w-1/3 rtl:left-auto rtl:right-0 z-0 cursor-pointer"
        onClick={prev}
        role="button"
        tabIndex={0}
        aria-label={tx(lang, 'תמונה קודמת', 'Previous image', 'الصورة السابقة')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            prev();
          }
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 rtl:right-auto rtl:left-0 z-0 cursor-pointer"
        onClick={next}
        role="button"
        tabIndex={0}
        aria-label={tx(lang, 'תמונה הבאה', 'Next image', 'الصورة التالية')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            next();
          }
        }}
      />

      <img
        src={images[index]}
        alt={`Restaurant photo ${index + 1} of ${images.length}`}
        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl z-1 transition-opacity duration-300"
      />

      <button
        onClick={next}
        className="absolute right-4 rtl:right-auto rtl:left-4 text-white p-3 hover:bg-white/20 rounded-full transition-all hover:scale-110"
        aria-label={tx(lang, 'תמונה הבאה', 'Next image', 'الصورة التالية')}
      >
        <ChevronDown
          className={`w-10 h-10 ${isRtl ? '-rotate-90' : 'rotate-90'}`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
