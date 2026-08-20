import { useEffect, useRef } from 'react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';

interface WhatsAppModalProps {
  lang: Language;
  open: boolean;
  onClose: () => void;
}

export default function WhatsAppModal({ lang, open, onClose }: WhatsAppModalProps) {
  const isRtl = isRtlLang(lang);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Move focus into the dialog when it opens so keyboard/AT users land inside.
  useEffect(() => {
    if (open && dialogRef.current) dialogRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] bg-black/50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={tx(
          lang,
          'המשך לוואטסאפ',
          'Continue to WhatsApp',
          'متابعة إلى واتساب',
          'Перейти в WhatsApp',
          'Συνέχεια στο WhatsApp'
        )}
        tabIndex={-1}
        className={`max-w-sm w-full rounded-2xl shadow-2xl p-6 outline-none ${isRtl ? 'rtl' : 'ltr'}`}
        style={{ backgroundColor: '#1a1a2e', borderTop: '3px solid #F5A623' }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className="text-sm leading-relaxed text-gray-200 mb-4"
          style={{ fontFamily: 'Heebo, sans-serif' }}
        >
          {tx(
            lang,
            'פרטי ההתקשרות שלך יישמרו לצורך טיפול בהזמנתך. למידע נוסף: מדיניות פרטיות באתר.',
            'Your contact details will be saved to process your order. For more info, see the Privacy Policy on our website.',
            'سيتم حفظ بيانات الاتصال الخاصة بك لمعالجة طلبك. لمزيد من المعلومات: سياسة الخصوصية على الموقع.',
            'Ваши контактные данные будут сохранены для обработки заказа. Подробнее: Политика конфиденциальности на сайте.',
            'Τα στοιχεία επικοινωνίας σας θα αποθηκευτούν για την επεξεργασία της παραγγελίας σας. Περισσότερα: Πολιτική Απορρήτου.'
          )}
        </p>
        <div className="flex gap-3">
          <a
            href="https://wa.me/972542001235"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-white text-center transition-all hover:brightness-110"
            style={{ backgroundColor: '#F5A623', fontFamily: 'Heebo, sans-serif' }}
            onClick={onClose}
          >
            {tx(
              lang,
              'המשך לוואטסאפ',
              'Continue to WhatsApp',
              'متابعة إلى واتساب',
              'Перейти в WhatsApp',
              'Συνέχεια στο WhatsApp'
            )}
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-white/10"
            style={{
              border: '2px solid #F5A623',
              color: '#F5A623',
              fontFamily: 'Heebo, sans-serif',
            }}
          >
            {tx(lang, 'ביטול', 'Cancel', 'إلغاء', 'Отмена', 'Ακύρωση')}
          </button>
        </div>
      </div>
    </div>
  );
}
