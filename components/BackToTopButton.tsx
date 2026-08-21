import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '../utils/scroll';

export default function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-[9.5rem] sm:bottom-44 right-4 sm:right-6 rtl:right-auto rtl:left-4 sm:rtl:left-6 z-40 w-10 h-10 sm:w-12 sm:h-12 bg-white text-slate-900 rounded-full shadow-lift ring-1 ring-black/10 flex items-center justify-center transition-transform hover:-translate-y-1 hover:scale-110"
      aria-label="Back to Top"
    >
      <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
}
