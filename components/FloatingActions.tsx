import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';
import { track } from '../utils/analytics';
import WhatsAppModal from './WhatsAppModal';

const FloatingActions: React.FC<{ lang: Language }> = ({ lang }) => {
  const [open, setOpen] = useState(false);
  const isRtl = isRtlLang(lang);

  return (
    <>
      <div
        className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 [body.cart-active_&]:hidden ${
          isRtl ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            track('open_whatsapp');
            setOpen(true);
          }}
          aria-label={tx(
            lang,
            'פתיחת WhatsApp',
            'Open WhatsApp',
            'فتح واتساب',
            'Открыть WhatsApp',
            'Άνοιγμα WhatsApp'
          )}
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-green-600 px-4 py-3 font-semibold text-white shadow-lift transition-colors hover:bg-green-700"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span className="text-sm">
            {tx(lang, 'WhatsApp', 'WhatsApp', 'واتساب', 'WhatsApp', 'WhatsApp')}
          </span>
        </button>
      </div>
      <WhatsAppModal lang={lang} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default FloatingActions;
