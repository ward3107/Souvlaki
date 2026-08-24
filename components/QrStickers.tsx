import { useEffect, useRef, useState } from 'react';
import { Printer, Download, QrCode, Home } from 'lucide-react';
import { Language } from '../types';
import { tx } from '../utils/i18n';
import { navigate } from '../utils/router';

// The public site the QR points at. Table stickers default to the menu so a
// guest who scans lands straight on the food (and the WhatsApp order flow).
const SITE = 'https://www.greeksouflaki.com';

type Dest = 'menu' | 'home';
type Layout = 'grid' | 'single';

/**
 * Renders a QR code to a <canvas>. Mirrors the generator used in ShareModal
 * (brand-blue on white, medium-high error correction so a scuffed printed
 * sticker still scans). Generated at a high pixel size and sized down in CSS
 * so it stays crisp when printed.
 */
function Qr({ value, id, className }: { value: string; id?: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let cancelled = false;

    import('qrcode').then(({ default: QRCode }) => {
      if (cancelled || !ref.current) return;
      QRCode.toCanvas(ref.current, value, {
        width: 720,
        margin: 1,
        errorCorrectionLevel: 'Q',
        color: { dark: '#0B5FA5', light: '#FFFFFF' },
      })
        .then(() => {
          // qrcode sets an inline width/height (720px) on the canvas, which
          // would override our CSS sizing and blow the code out of its card.
          // Clear it so the w-[..mm] class controls the printed/display size,
          // while the 720px bitmap keeps it crisp.
          if (ref.current) {
            ref.current.style.width = '';
            ref.current.style.height = '';
          }
        })
        .catch((err) => {
          console.error('QR generation failed:', err);
        });
    });

    return () => {
      cancelled = true;
    };
  }, [value]);

  return <canvas ref={ref} id={id} className={className} />;
}

function Sticker({
  lang,
  dest,
  url,
  large,
}: {
  lang: Language;
  dest: Dest;
  url: string;
  large: boolean;
}) {
  const line1 =
    dest === 'menu'
      ? tx(lang, 'סרקו לתפריט', 'Scan for the menu', 'امسح لعرض القائمة')
      : tx(lang, 'סרקו לאתר שלנו', 'Scan our website', 'امسح لزيارة موقعنا');

  const display = url.replace(/^https?:\/\//, '');

  return (
    <div
      className={`flex flex-col items-center text-center break-inside-avoid rounded-[4mm] border-2 border-dashed border-slate-300 bg-white ${
        large ? 'gap-[5mm] p-[10mm]' : 'gap-[3mm] p-[6mm]'
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-[3mm]">
        <img
          src="/favicon.png"
          alt=""
          aria-hidden="true"
          className={large ? 'w-[18mm] h-[18mm] rounded-full' : 'w-[12mm] h-[12mm] rounded-full'}
        />
        <div className="text-start">
          <div
            className={`font-display font-bold leading-none text-brand-blue-700 ${
              large ? 'text-[8mm]' : 'text-[5mm]'
            }`}
          >
            Greek Souvlaki
          </div>
          <div
            className={`text-slate-500 ${large ? 'text-[3.5mm] mt-[1.5mm]' : 'text-[2.6mm] mt-[1mm]'}`}
          >
            כפר יאסיף · كفر ياسيف
          </div>
        </div>
      </div>

      {/* QR */}
      <Qr value={url} className={`block ${large ? 'w-[80mm] h-[80mm]' : 'w-[46mm] h-[46mm]'}`} />

      {/* Trilingual call to action — Arabic, Hebrew, English for a local table */}
      <div className="leading-tight">
        <div
          className={`font-semibold text-slate-900 ${large ? 'text-[6mm]' : 'text-[3.6mm]'}`}
          dir="rtl"
        >
          {dest === 'menu' ? 'امسح لعرض القائمة' : 'امسح لزيارة موقعنا'}
        </div>
        <div
          className={`font-semibold text-slate-900 ${large ? 'text-[6mm]' : 'text-[3.6mm]'}`}
          dir="rtl"
        >
          {dest === 'menu' ? 'סרקו לתפריט' : 'סרקו לאתר שלנו'}
        </div>
        <div
          className={`text-slate-600 ${large ? 'text-[4.5mm] mt-[1mm]' : 'text-[2.8mm] mt-[0.5mm]'}`}
        >
          {dest === 'menu' ? 'Scan for the menu' : 'Scan our website'}
        </div>
      </div>

      <div className={`text-slate-400 tabular-nums ${large ? 'text-[3.2mm]' : 'text-[2.3mm]'}`}>
        {display}
      </div>

      {/* Keeps a11y label meaningful without changing the visible layout */}
      <span className="sr-only">{line1}</span>
    </div>
  );
}

export default function QrStickers({ lang }: { lang: Language }) {
  const [dest, setDest] = useState<Dest>('menu');
  const [layout, setLayout] = useState<Layout>('grid');

  const url = dest === 'menu' ? `${SITE}/menu` : SITE;
  const count = layout === 'single' ? 1 : 6;

  const handleDownload = () => {
    const canvas = document.getElementById('qr-download') as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `greek-souvlaki-qr-${dest}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const btnBase =
    'inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-transform active:scale-95';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-6 px-4">
      {/* Controls — never printed */}
      <div className="print:hidden mx-auto max-w-[210mm]">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-lift">
          <div className="flex items-center gap-2 text-brand-blue-700 dark:text-brand-blue-100">
            <QrCode className="w-5 h-5" aria-hidden="true" />
            <h1 className="font-display text-lg font-bold">
              {tx(lang, 'מדבקות QR לשולחנות', 'Table QR stickers', 'ملصقات QR للطاولات')}
            </h1>
          </div>

          <div className="grow" />

          {/* Destination toggle */}
          <div
            className="inline-flex rounded-full bg-slate-100 dark:bg-slate-700 p-1"
            role="group"
            aria-label={tx(lang, 'יעד', 'Destination', 'الوجهة')}
          >
            <button
              type="button"
              onClick={() => setDest('menu')}
              aria-pressed={dest === 'menu'}
              className={`${btnBase} px-3 py-1.5 ${
                dest === 'menu'
                  ? 'bg-brand-terracotta-400 text-white'
                  : 'text-slate-600 dark:text-slate-200'
              }`}
            >
              <QrCode className="w-4 h-4" aria-hidden="true" />
              {tx(lang, 'תפריט', 'Menu', 'القائمة')}
            </button>
            <button
              type="button"
              onClick={() => setDest('home')}
              aria-pressed={dest === 'home'}
              className={`${btnBase} px-3 py-1.5 ${
                dest === 'home'
                  ? 'bg-brand-terracotta-400 text-white'
                  : 'text-slate-600 dark:text-slate-200'
              }`}
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              {tx(lang, 'אתר', 'Website', 'الموقع')}
            </button>
          </div>

          {/* Layout toggle */}
          <div
            className="inline-flex rounded-full bg-slate-100 dark:bg-slate-700 p-1"
            role="group"
            aria-label={tx(lang, 'פריסה', 'Layout', 'التخطيط')}
          >
            <button
              type="button"
              onClick={() => setLayout('grid')}
              aria-pressed={layout === 'grid'}
              className={`${btnBase} px-3 py-1.5 ${
                layout === 'grid'
                  ? 'bg-brand-blue-500 text-white'
                  : 'text-slate-600 dark:text-slate-200'
              }`}
            >
              {tx(lang, '6 בדף', '6 per page', '٦ في الصفحة')}
            </button>
            <button
              type="button"
              onClick={() => setLayout('single')}
              aria-pressed={layout === 'single'}
              className={`${btnBase} px-3 py-1.5 ${
                layout === 'single'
                  ? 'bg-brand-blue-500 text-white'
                  : 'text-slate-600 dark:text-slate-200'
              }`}
            >
              {tx(lang, 'גדול', 'Large', 'كبير')}
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className={`${btnBase} bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white`}
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            {tx(lang, 'הורד PNG', 'Download PNG', 'تنزيل PNG')}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className={`${btnBase} bg-brand-terracotta-400 hover:bg-brand-terracotta-500 text-white shadow-lift`}
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            {tx(lang, 'הדפס', 'Print', 'طباعة')}
          </button>
        </div>

        <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
          {tx(
            lang,
            'הדפיסו, גזרו לאורך הקו המקווקו והדביקו על השולחנות. הקוד פותח את ' +
              (dest === 'menu' ? 'התפריט' : 'האתר') +
              '.',
            'Print, cut along the dashed lines, and stick on the tables. The code opens the ' +
              (dest === 'menu' ? 'menu' : 'website') +
              '.',
            'اطبع، قص على طول الخط المتقطع، والصق على الطاولات. يفتح الرمز ' +
              (dest === 'menu' ? 'القائمة' : 'الموقع') +
              '.'
          )}
        </p>

        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm font-medium text-brand-blue-600 dark:text-brand-blue-300 hover:underline"
          >
            {tx(lang, '← לדף הבית', '← Home', '← الصفحة الرئيسية')}
          </button>
        </div>
      </div>

      {/* Zero-size, clipped high-res QR used only as the source for the PNG
          download — toDataURL reads the full 720px bitmap regardless of CSS,
          and h-0/w-0 + overflow-hidden keeps it from affecting layout/scroll. */}
      <div className="absolute left-0 top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
        <Qr value={url} id="qr-download" />
      </div>

      {/* The printable sheet (see #qr-sheet in the @media print block) */}
      <div id="qr-sheet" className="mx-auto mt-6 max-w-[210mm] bg-white p-[8mm]">
        <div className={layout === 'single' ? 'flex justify-center' : 'grid grid-cols-2 gap-[6mm]'}>
          {Array.from({ length: count }).map((_, i) => (
            <Sticker key={i} lang={lang} dest={dest} url={url} large={layout === 'single'} />
          ))}
        </div>
      </div>
    </div>
  );
}
