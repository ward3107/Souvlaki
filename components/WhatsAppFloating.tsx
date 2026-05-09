import { useState } from 'react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';

interface Props {
  lang: Language;
}

export default function WhatsAppFloating({ lang }: Props) {
  const [showNotice, setShowNotice] = useState(false);
  const isRtl = isRtlLang(lang);

  return (
    <>
      <button
        onClick={() => setShowNotice(true)}
        className="fixed bottom-28 right-6 rtl:right-auto rtl:left-6 z-45 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-xl mix-blend-difference hover:scale-110 transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </button>

      {showNotice && (
        <div
          className="fixed inset-0 z-[9998] bg-black/50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowNotice(false)}
        >
          <div
            className={`max-w-sm w-full rounded-2xl shadow-2xl p-6 ${isRtl ? 'rtl' : 'ltr'}`}
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
                onClick={() => setShowNotice(false)}
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
                onClick={() => setShowNotice(false)}
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
      )}
    </>
  );
}
