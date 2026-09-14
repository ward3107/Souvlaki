import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Lang } from '../../utils/menuData';
import { IMAGE_LIGHTBOX_LABELS } from './imageLightboxLabels';

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
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open || !src) return null;
  const labels = IMAGE_LIGHTBOX_LABELS[lang] ?? IMAGE_LIGHTBOX_LABELS.en;

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${labels.title}: ${name}`}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label={labels.close}
      />
      <button
        ref={closeButtonRef}
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
