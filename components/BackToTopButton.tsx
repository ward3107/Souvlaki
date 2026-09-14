import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '../utils/scroll';

export default function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 rtl:right-auto rtl:left-4 sm:rtl:left-6 z-40 w-10 h-10 sm:w-11 sm:h-11 bg-white text-slate-900 rounded-full shadow-soft ring-1 ring-black/10 flex items-center justify-center transition-colors hover:bg-brand-cream-100 [body.cart-active_&]:hidden"
      aria-label="Back to Top"
    >
      <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
}
