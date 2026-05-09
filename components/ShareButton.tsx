import { useEffect, useRef, useState } from 'react';
import { X, Share2, Copy, Download, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';

const QRCodeIcon: React.FC<{
  value: string;
  size?: number;
  id?: string;
  includeMargin?: boolean;
  bgColor?: string;
  fgColor?: string;
}> = ({ value, size = 180, id, includeMargin = true, bgColor = '#FFFFFF', fgColor = '#0B5FA5' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let cancelled = false;

    import('qrcode').then(({ default: QRCode }) => {
      if (cancelled || !canvasRef.current) return;
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: includeMargin ? 2 : 0,
        errorCorrectionLevel: 'M',
        color: { dark: fgColor, light: bgColor },
      }).catch((err) => {
        console.error('QR generation failed:', err);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [value, size, includeMargin, bgColor, fgColor]);

  return <canvas ref={canvasRef} id={id} style={{ display: 'block' }} />;
};

const ShareButton: React.FC<{ lang: Language }> = ({ lang }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const shareUrl =
    typeof window !== 'undefined' ? window.location.href : 'https://souvlaki.pages.dev';
  const isRtl = isRtlLang(lang);

  const shareMessage = tx(
    lang,
    'בואו לסובלקי יווני כפר יאסיף! תלוו להזמין טעימה',
    'Welcome to Greek Souvlaki Kfar Yasif!',
    'مرحباً بكم في سوفلاكي يوناني كفر ياسيف! تفضلوا للحجز',
    'Добро пожаловать в Греческий Сувлаки Кафр Ясиф!',
    'Καλώς ήρθατε στο Ελληνικό Σουβλάκι Καφρ Γιασίφ!'
  );

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Greek Souvlaki Kfar Yasif',
          text: shareMessage,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Share canceled:', error);
      }
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage + ' ' + shareUrl)}`;
    window.open(url, '_blank');
    setShowShareModal(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert(tx(lang, 'הקישור הועתק!', 'Link copied!', 'تم نسخ الرابط!', 'Ссылка скопирована!', 'Ο σύνδεσμος αντιγράφηκε!'));
    setShowShareModal(false);
  };

  const handleDownloadQR = () => {
    const qrElement = document.getElementById('qr-code-canvas');
    if (qrElement) {
      const canvas = qrElement as HTMLCanvasElement;
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'greek-souvlaki-qr-code.png';
      link.href = url;
      link.click();
    }
  };

  useEffect(() => {
    if (showShareModal && modalRef.current) {
      modalRef.current.focus();
    } else if (!showShareModal && triggerButtonRef.current) {
      triggerButtonRef.current.focus();
    }
  }, [showShareModal]);

  useEffect(() => {
    if (!showShareModal) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowShareModal(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showShareModal]);

  return (
    <>
      <button
        ref={triggerButtonRef}
        onClick={() => setShowShareModal(!showShareModal)}
        className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-50 w-14 h-14 bg-brand-blue-500 hover:bg-brand-blue-600 text-white rounded-full shadow-lift hover:shadow-pop transition-all duration-300 flex items-center justify-center hover:scale-105 [body.cart-active_&]:hidden`}
        aria-label="Share"
        aria-expanded={showShareModal}
      >
        {showShareModal ? <X className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
      </button>

      {showShareModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowShareModal(false)}
          aria-modal="true"
          role="dialog"
          aria-labelledby="share-modal-title"
        >
          <div
            ref={modalRef}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 outline-none"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 id="share-modal-title" className="font-display text-xl font-semibold text-gray-900 dark:text-white">
                {tx(lang, 'שתף את האתר', 'Share the Website', 'شارك الموقع', 'Поделиться сайтом', 'Μοιραστείτε τον ιστότοπο')}
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl flex flex-col items-center">
              <QRCodeIcon
                size={180}
                value={shareUrl}
                id="qr-code-canvas"
                includeMargin={true}
                bgColor="#FFFFFF"
                fgColor="#0B5FA5"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
                {tx(lang, 'סרקו את הקוד להורדה או להדפיסה', 'Scan to download or print', 'امسح الكود للتنزيل أو الطباعة', 'Сканируйте для скачивания или печати', 'Σαρώστε για λήψη ή εκτύπωση')}
              </p>
              <button
                onClick={handleDownloadQR}
                className="mt-2 flex items-center gap-2 px-4 py-2 bg-brand-blue-500 hover:bg-brand-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                {tx(lang, 'הורד QR', 'Download QR', 'تنزيل QR', 'Скачать QR', 'Λήψη QR')}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleWhatsAppShare}
                className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-colors border border-green-200 dark:border-green-800"
              >
                <MessageCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">WhatsApp</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-2 p-4 bg-brand-blue-50 dark:bg-brand-blue-900/20 hover:bg-brand-blue-100 dark:hover:bg-brand-blue-900/30 rounded-xl transition-colors border border-brand-blue-200 dark:border-brand-blue-800"
              >
                <Copy className="w-8 h-8 text-brand-blue-500 dark:text-brand-blue-300" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {tx(lang, 'העתק קישור', 'Copy Link', 'نسخ الرابط', 'Копировать', 'Αντιγράφη')}
                </span>
              </button>
              {navigator.share && (
                <button
                  onClick={handleNativeShare}
                  className="col-span-2 flex items-center justify-center gap-2 p-4 bg-brand-terracotta-50 dark:bg-brand-terracotta-400/15 hover:bg-brand-terracotta-100 rounded-xl transition-colors border border-brand-terracotta-200 dark:border-brand-terracotta-400/30"
                >
                  <Share2 className="w-6 h-6 text-brand-terracotta-500 dark:text-brand-terracotta-200" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {tx(lang, 'שתף...', 'Share...', 'مشاركة...', 'Поделиться...', 'Μοιραστείτε...')}
                  </span>
                </button>
              )}
            </div>

            <div className="mt-4 p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 break-all">{shareUrl}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;
