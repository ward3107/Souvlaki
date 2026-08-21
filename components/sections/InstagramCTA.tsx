import { useEffect, useRef, useState } from 'react';
import { Camera, Instagram, X } from 'lucide-react';
import { Language } from '../../types';
import { tx } from '../../utils/i18n';
import { useBackClose } from '../hooks/useBackClose';

interface Props {
  lang: Language;
}

export default function InstagramCTA({ lang }: Props) {
  return (
    <section className="py-16 bg-brand-terracotta-400 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/15 backdrop-blur-sm rounded-full mb-6">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
            {tx(
              lang,
              'תייג/י אותנו באינסטגרם!',
              'Tag Us on Instagram!',
              'صورنا على إنستغرام!',
              'Отметьте нас в Instagram!',
              'Tag μας στο Instagram!'
            )}
          </h2>
          <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
            {tx(
              lang,
              'צילמ/ת תמונה של האוכל שלנו? תייג/י אותנו ב-@greek.souvlakii ונשתף אותך בעמוד שלנו!',
              "Took a photo of our food? Tag us @greek.souvlakii and we'll share you on our page!",
              'التقطت صورة لطعامنا؟ ضع علامة علينا في @greek.souvlakii وسنقوم بمشاركتك!',
              'Сфоткали нашу еду? Отметьте нас @greek.souvlakii и мы поделимся вами!',
              'Φωτογράψατε το φαγητό μας; Tag μας στο @greek.souvlakii και θα σας μοιραστούμε!'
            )}
          </p>
          <p className="text-base text-white/80 mb-8 max-w-xl mx-auto">
            {tx(
              lang,
              'או פתח/י את המצלמה עכשיו ושתפ/י את הרגע שלך — לחצ/י על הכפתור למטה.',
              'Or open the camera right now and share your moment — tap the button below.',
              'أو افتح الكاميرا الآن وشارك لحظتك — اضغط على الزر أدناه.',
              'Или откройте камеру прямо сейчас и поделитесь моментом — нажмите кнопку ниже.',
              'Ή άνοιξε την κάμερα τώρα και μοιράσου τη στιγμή σου — πάτα το κουμπί παρακάτω.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CameraShareButton lang={lang} />
            <a
              href="https://www.instagram.com/greek.souvlakii"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-sm text-white rounded-full font-medium border border-white/30 hover:bg-white/25 transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
              <span>@greek.souvlakii</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CameraShareButton({ lang }: { lang: Language }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const buttonLabel = tx(
    lang,
    'צלמ/י ושתפ/י',
    'Snap & Share',
    'التقط وشارك',
    'Сфоткать и поделиться',
    'Φωτογράφισε & μοιράσου'
  );
  const savedMsg = tx(
    lang,
    'התמונה הורדה — פתח/י את אינסטגרם והעלה/י אותה ✨',
    'Photo downloaded — open Instagram and upload it ✨',
    'تم تنزيل الصورة - افتح إنستغرام وارفعها ✨',
    'Фото скачано — откройте Instagram и загрузите его ✨',
    'Η φωτογραφία κατέβηκε — άνοιξε το Instagram και ανέβασέ την ✨'
  );

  const handleCapture = async (file: File) => {
    setOpen(false);
    type ShareCheck = Navigator & { canShare?: (data: ShareData) => boolean };
    const nav = navigator as ShareCheck;
    const shareData: ShareData = {
      files: [file],
      text: '@greek.souvlakii',
      url: 'https://instagram.com/greek.souvlakii',
    };
    if (nav.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled or share failed — fall through to download
      }
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus(savedMsg);
    window.setTimeout(() => setStatus(null), 6000);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="snap-share-pulse inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-terracotta-400 rounded-full font-semibold text-lg hover:shadow-pop hover:scale-105 transition-transform duration-300"
      >
        <span className="camera-wiggle" aria-hidden="true">
          <Camera className="w-6 h-6" />
        </span>
        <span>{buttonLabel}</span>
      </button>
      {open && <CameraModal lang={lang} onClose={() => setOpen(false)} onCapture={handleCapture} />}
      {status && (
        <div
          role="status"
          aria-live="polite"
          className="mt-2 text-sm text-white/95 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          {status}
        </div>
      )}
    </>
  );
}

interface CameraModalProps {
  lang: Language;
  onClose: () => void;
  onCapture: (file: File) => void;
}

function CameraModal({ lang, onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Mobile Back button closes the camera instead of navigating the page away.
  useBackClose(true, onClose);

  const errorMsg = tx(
    lang,
    'לא הצלחנו לפתוח את המצלמה. בדוק/י הרשאות בדפדפן.',
    "Couldn't open the camera. Check browser permissions.",
    'تعذر فتح الكاميرا. تحقق من أذونات المتصفح.',
    'Не удалось открыть камеру. Проверьте разрешения браузера.',
    'Δεν ήταν δυνατό το άνοιγμα της κάμερας. Έλεγξε τις άδειες.'
  );
  const closeLabel = tx(lang, 'סגור', 'Close', 'إغلاق', 'Закрыть', 'Κλείσιμο');
  const captureLabel = tx(lang, 'צלם/י', 'Take Photo', 'التقط', 'Снять', 'Φωτογράφισε');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setReady(true);
        }
      } catch {
        if (!cancelled) setError(errorMsg);
      }
    })();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    // Instagram-optimized: 1080×1080 square JPEG (their canonical format).
    // Center-crop from the camera frame so the user doesn't have to re-crop.
    const w = video.videoWidth;
    const h = video.videoHeight;
    const sourceSize = Math.min(w, h);
    const sx = (w - sourceSize) / 2;
    const sy = (h - sourceSize) / 2;
    const target = 1080;

    const canvas = document.createElement('canvas');
    canvas.width = target;
    canvas.height = target;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, sx, sy, sourceSize, sourceSize, 0, 0, target, target);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `greek-souvlaki-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });
        onCapture(file);
      },
      'image/jpeg',
      0.92
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute top-4 end-4 z-10 p-3 rounded-full bg-white/15 hover:bg-white/25 text-white transition"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex-1 flex items-center justify-center p-4">
        {error ? (
          <div className="text-white text-center max-w-md">
            <p className="text-xl mb-6">{error}</p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white text-black rounded-full font-semibold"
            >
              {closeLabel}
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            className="max-w-full max-h-full rounded-2xl shadow-pop"
          />
        )}
      </div>

      {!error && (
        <div className="pb-10 pt-4 flex items-center justify-center">
          <button
            type="button"
            onClick={capture}
            disabled={!ready}
            aria-label={captureLabel}
            className="w-20 h-20 rounded-full bg-white border-4 border-white/40 hover:border-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span className="block w-14 h-14 rounded-full bg-white ring-2 ring-black/10" />
          </button>
        </div>
      )}
    </div>
  );
}
