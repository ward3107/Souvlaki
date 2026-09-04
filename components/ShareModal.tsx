import { useEffect, useRef } from 'react';
import { X, Share2, Copy, Download, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { tx } from '../utils/i18n';
import { useBackClose } from './hooks/useBackClose';

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Render a "round-style" QR: data modules as circular dots and the three
 * corner finder patterns as rounded squares. The overall grid stays square
 * (the finder eyes must survive for scanners to lock on), but the dot styling
 * reads as round. Error correction is set to High so the styling stays
 * reliably scannable. Draws onto the given canvas at devicePixelRatio (or a
 * caller-supplied scale) for crisp output on screen and in print.
 */
async function drawRoundQR(
  canvas: HTMLCanvasElement,
  value: string,
  size: number,
  fgColor: string,
  bgColor: string,
  margin = 2,
  scaleOverride?: number
) {
  const { default: QRCode } = await import('qrcode');
  const qr = QRCode.create(value, { errorCorrectionLevel: 'H' });
  const count = qr.modules.size;
  const total = count + margin * 2;

  const scale = scaleOverride ?? (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
  canvas.width = Math.round(size * scale);
  canvas.height = Math.round(size * scale);
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const cell = size / total;
  const off = margin * cell;

  // Background.
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  const inFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7);

  // Data modules as circular dots.
  ctx.fillStyle = fgColor;
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (inFinder(r, c)) continue;
      if (!qr.modules.get(r, c)) continue;
      const cx = off + (c + 0.5) * cell;
      const cy = off + (r + 0.5) * cell;
      ctx.beginPath();
      ctx.arc(cx, cy, cell * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Finder eyes as rounded squares (outer ring + inner dot).
  const drawEye = (r0: number, c0: number) => {
    const x = off + c0 * cell;
    const y = off + r0 * cell;
    const s = 7 * cell;
    ctx.fillStyle = fgColor;
    roundRect(ctx, x, y, s, s, cell * 1.8);
    ctx.fill();
    ctx.fillStyle = bgColor;
    roundRect(ctx, x + cell, y + cell, s - 2 * cell, s - 2 * cell, cell * 1.2);
    ctx.fill();
    ctx.fillStyle = fgColor;
    roundRect(ctx, x + 2 * cell, y + 2 * cell, s - 4 * cell, s - 4 * cell, cell * 0.8);
    ctx.fill();
  };
  drawEye(0, 0);
  drawEye(0, count - 7);
  drawEye(count - 7, 0);
}

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

    drawRoundQR(canvasRef.current, value, size, fgColor, bgColor, includeMargin ? 2 : 0).catch(
      (err) => {
        if (!cancelled) console.error('QR generation failed:', err);
      }
    );

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
      : 'https://www.greeksouflaki.com';

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

  // Build a print-ready tabletop sign: headline + QR + a "scan for our menu"
  // line in all five site languages + the URL. Rendered at 3x for crisp print.
  const handleDownloadQR = async () => {
    const scale = 3;
    const W = 700;
    const H = 860;
    const brand = '#0B5FA5';

    const canvas = document.createElement('canvas');
    canvas.width = W * scale;
    canvas.height = H * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);
    ctx.textAlign = 'center';

    // Background + brand frame.
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = brand;
    ctx.lineWidth = 6;
    ctx.strokeRect(14, 14, W - 28, H - 28);

    // Header.
    ctx.fillStyle = brand;
    ctx.font = '700 46px system-ui, -apple-system, sans-serif';
    ctx.fillText('Greek Souvlaki', W / 2, 84);
    ctx.font = '600 24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('כפר יאסיף · كفر ياسيف · Kfar Yasif', W / 2, 120);

    // QR (kept square with a quiet zone for reliable scanning).
    const qrPx = 340;
    const qrY = 150;
    const qrX = (W - qrPx) / 2;
    const qrCanvas = document.createElement('canvas');
    await drawRoundQR(qrCanvas, shareUrl, qrPx, brand, '#FFFFFF', 2, scale);
    ctx.drawImage(qrCanvas, qrX, qrY, qrPx, qrPx);

    // Call to action — English as the headline, then the other four languages.
    let y = qrY + qrPx + 56;
    ctx.fillStyle = brand;
    ctx.font = '700 34px system-ui, -apple-system, sans-serif';
    ctx.fillText('Scan to see our menu', W / 2, y);

    const menuLines = [
      'סרקו לצפייה בתפריט',
      'امسحوا لرؤية القائمة',
      'Сканируйте, чтобы увидеть меню',
      'Σαρώστε για το μενού',
    ];
    ctx.font = '400 25px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#334155';
    y += 46;
    for (const line of menuLines) {
      ctx.fillText(line, W / 2, y);
      y += 38;
    }

    // Footer URL.
    ctx.font = '600 24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = brand;
    ctx.fillText('greeksouflaki.com', W / 2, H - 40);

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'greek-souvlaki-menu-qr.png';
    link.href = url;
    link.click();
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
          {/* Round white badge: the QR itself stays square (its corner finder
              patterns must not be clipped), but the circle circumscribes it so
              the whole thing reads as round. Padding = size*(√2-1)/2 so the
              square's corners never poke past the circle's edge. */}
          {(() => {
            const qrSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : 180;
            const pad = Math.ceil((qrSize * (Math.SQRT2 - 1)) / 2);
            return (
              <div
                className="rounded-full bg-white shadow-inner flex items-center justify-center"
                style={{ padding: pad }}
              >
                <QRCodeIcon
                  size={qrSize}
                  value={shareUrl}
                  id="qr-code-canvas"
                  includeMargin={true}
                  bgColor="#FFFFFF"
                  fgColor="#0B5FA5"
                />
              </div>
            );
          })()}
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
