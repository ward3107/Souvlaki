import { useEffect, useRef } from 'react';
import { X, Share2, Copy, Download, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { tx } from '../utils/i18n';
import { useBackClose } from './hooks/useBackClose';

const QRCodeIcon: React.FC<{
  value: string;
  size?: number;
  id?: string;
  includeMargin?: boolean;
  bgColor?: string;
  fgColor?: string;
}> = ({
  value,
  size = 180,
  id,
  includeMargin = true,
  bgColor = '#FFFFFF',
  fgColor = '#0B5FA5',
}) => {
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

interface ShareModalProps {
  lang: Language;
  open: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ lang, open, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Share the canonical origin + path only — strip query/hash so a crafted URL
  // a visitor arrived on can't ride along into what they share.
  const shareUrl =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : 'https://greeksouflaki.com';

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
      } catch {
        // User dismissed the native share sheet — not an error worth logging.
      }
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage + ' ' + shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert(
      tx(
        lang,
        'הקישור הועתק!',
        'Link copied!',
        'تم نسخ الرابط!',
        'Ссылка скопирована!',
        'Ο σύνδεσμος αντιγράφηκε!'
      )
    );
    onClose();
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

  // Mobile Back button closes the modal instead of navigating away.
  useBackClose(open, onClose);

  // Move focus into the dialog when it opens so keyboard/AT users land inside.
  useEffect(() => {
    if (open && modalRef.current) modalRef.current.focus();
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="share-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 outline-none max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3
            id="share-modal-title"
            className="font-display text-lg sm:text-xl font-semibold text-gray-900 dark:text-white"
          >
            {tx(
              lang,
              'שתף את האתר',
              'Share the Website',
              'شارك الموقع',
              'Поделиться сайтом',
              'Μοιραστείτε τον ιστότοπο'
            )}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-slate-700 rounded-xl flex flex-col items-center">
          <QRCodeIcon
            size={typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : 180}
            value={shareUrl}
            id="qr-code-canvas"
            includeMargin={true}
            bgColor="#FFFFFF"
            fgColor="#0B5FA5"
          />
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-3 text-center">
            {tx(
              lang,
              'סרקו את הקוד להורדה או להדפיסה',
              'Scan to download or print',
              'امسح الكود للتنزيل أو الطباعة',
              'Сканируйте для скачивания или печати',
              'Σαρώστε για λήψη ή εκτύπωση'
            )}
          </p>
          <button
            onClick={handleDownloadQR}
            className="mt-2 flex items-center gap-2 px-4 py-2 bg-brand-blue-500 hover:bg-brand-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            {tx(lang, 'הורד QR', 'Download QR', 'تنزيل QR', 'Скачать QR', 'Λήψη QR')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={handleWhatsAppShare}
            className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-colors border border-green-200 dark:border-green-800"
          >
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
              WhatsApp
            </span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-brand-blue-50 dark:bg-brand-blue-900/20 hover:bg-brand-blue-100 dark:hover:bg-brand-blue-900/30 rounded-xl transition-colors border border-brand-blue-200 dark:border-brand-blue-800"
          >
            <Copy className="w-6 h-6 sm:w-8 sm:h-8 text-brand-blue-500 dark:text-brand-blue-300" />
            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
              {tx(lang, 'העתק קישור', 'Copy Link', 'نسخ الرابط', 'Копировать', 'Αντιγράφη')}
            </span>
          </button>
          {typeof navigator.share === 'function' && (
            <button
              onClick={handleNativeShare}
              className="col-span-2 flex items-center justify-center gap-2 p-3 sm:p-4 bg-brand-terracotta-50 dark:bg-brand-terracotta-400/15 hover:bg-brand-terracotta-100 rounded-xl transition-colors border border-brand-terracotta-200 dark:border-brand-terracotta-400/30"
            >
              <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-brand-terracotta-500 dark:text-brand-terracotta-200" />
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                {tx(lang, 'שתף...', 'Share...', 'مشاركة...', 'Поделиться...', 'Μοιραστείτε...')}
              </span>
            </button>
          )}
        </div>

        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
          <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 break-all">
            {shareUrl}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
