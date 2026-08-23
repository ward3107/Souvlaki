import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageCircle, Plus, Share2 } from 'lucide-react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';
import { track } from '../utils/analytics';
import ShareModal from './ShareModal';
import WhatsAppModal from './WhatsAppModal';

type ActiveModal = 'none' | 'share' | 'whatsapp';

const FloatingActions: React.FC<{ lang: Language }> = ({ lang }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const isRtl = isRtlLang(lang);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const mainButtonRef = useRef<HTMLButtonElement>(null);

  // Collapse the fan on outside click / Escape while it's open.
  useEffect(() => {
    if (!expanded) return;
    const handlePointer = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpanded(false);
        mainButtonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [expanded]);

  const openModal = (modal: ActiveModal) => {
    if (modal !== 'none') track(modal === 'whatsapp' ? 'open_whatsapp' : 'open_share');
    setActiveModal(modal);
    setExpanded(false);
  };

  const closeModal = () => {
    setActiveModal('none');
    mainButtonRef.current?.focus();
  };

  const shareLabel = tx(lang, 'שיתוף', 'Share', 'مشاركة', 'Поделиться', 'Κοινοποίηση');
  const whatsappAria = tx(
    lang,
    'צ׳אט בוואטסאפ',
    'Chat on WhatsApp',
    'الدردشة على واتساب',
    'Написать в WhatsApp',
    'Συνομιλία στο WhatsApp'
  );

  const actions = [
    {
      key: 'whatsapp' as const,
      label: 'WhatsApp',
      ariaLabel: whatsappAria,
      onClick: () => openModal('whatsapp'),
      icon: <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />,
      buttonClass: 'bg-green-500 hover:bg-green-600',
    },
    {
      key: 'share' as const,
      label: shareLabel,
      ariaLabel: shareLabel,
      onClick: () => openModal('share'),
      icon: <Share2 className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />,
      buttonClass: 'bg-brand-blue-500 hover:bg-brand-blue-600',
    },
  ];

  const spring = prefersReducedMotion
    ? { duration: 0 }
    : ({ type: 'spring', stiffness: 380, damping: 26, mass: 0.7 } as const);

  const sideClass = isRtl ? 'left-4 sm:left-6' : 'right-4 sm:right-6';
  const alignClass = isRtl ? 'items-start' : 'items-end';
  const rowDirClass = isRtl ? 'flex-row-reverse' : 'flex-row';

  return (
    <>
      <div
        ref={containerRef}
        className={`fixed bottom-4 sm:bottom-6 ${sideClass} z-50 [body.cart-active_&]:hidden`}
      >
        <div className={`flex flex-col ${alignClass} gap-3`}>
          <AnimatePresence>
            {expanded &&
              actions.map((action, i) => (
                <motion.div
                  key={action.key}
                  className={`flex items-center gap-2.5 ${rowDirClass}`}
                  initial={{ opacity: 0, y: 14, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 14, scale: 0.8 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { ...spring, delay: (actions.length - 1 - i) * 0.05 }
                  }
                >
                  <span className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-medium shadow-lift whitespace-nowrap">
                    {action.label}
                  </span>
                  <button
                    onClick={action.onClick}
                    aria-label={action.ariaLabel}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white shadow-lift hover:shadow-pop flex items-center justify-center transition-colors ${action.buttonClass}`}
                  >
                    {action.icon}
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>

          <button
            ref={mainButtonRef}
            onClick={() => setExpanded((v) => !v)}
            aria-label={tx(lang, 'פעולות', 'Actions', 'إجراءات', 'Действия', 'Ενέργειες')}
            aria-expanded={expanded}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-blue-500 hover:bg-brand-blue-600 text-white shadow-lift hover:shadow-pop flex items-center justify-center transition-all duration-300 hover:scale-105"
          >
            <motion.span
              animate={{ rotate: expanded ? 45 : 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 300, damping: 20 }
              }
              className="flex items-center justify-center"
            >
              <Plus className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
            </motion.span>
          </button>
        </div>
      </div>

      <ShareModal lang={lang} open={activeModal === 'share'} onClose={closeModal} />
      <WhatsAppModal lang={lang} open={activeModal === 'whatsapp'} onClose={closeModal} />
    </>
  );
};

export default FloatingActions;
