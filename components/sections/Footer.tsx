import { Facebook, Instagram } from 'lucide-react';
import { Language } from '../../types';
import { t, tx } from '../../utils/i18n';

interface Props {
  lang: Language;
  onOpenLegal: (path: string) => void;
}

const WhatsAppGlyph = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className} fill-current group-hover:scale-110 transition-transform`}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function Footer({ lang, onOpenLegal }: Props) {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <div className="text-center md:text-start">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <img
                src="/favicon.png"
                alt="Greek Souvlaki Logo"
                loading="lazy"
                decoding="async"
                className="w-14 h-14 rounded-full object-cover"
              />
              <span className="font-display text-2xl font-semibold text-white">Greek Souvlaki</span>
            </div>
            <p className="opacity-70 text-sm">
              Authentic Greek flavors in the heart of Kafr Yasif.
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://wa.me/972542001235"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 transition-colors group"
              aria-label="Chat with us on WhatsApp"
            >
              <WhatsAppGlyph />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100089667506328"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors group"
              aria-label="Visit our Facebook page"
            >
              <Facebook
                className="w-6 h-6 group-hover:scale-110 transition-transform"
                aria-hidden="true"
              />
            </a>
            <a
              href="https://www.instagram.com/greek.souvlakii"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-colors group"
              aria-label="Visit our Instagram page"
            >
              <Instagram
                className="w-6 h-6 group-hover:scale-110 transition-transform"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-70 hover:opacity-100 transition-opacity">
          <p className="text-gray-400 dark:text-gray-500">{t(lang, 'footer_copyright')}</p>
          <div className="flex gap-4 flex-wrap justify-center md:justify-end items-center">
            <button
              onClick={() => onOpenLegal('/legal/terms-of-use.md')}
              className="text-gray-400 dark:text-gray-500 hover:text-brand-blue-300 hover:underline transition-all cursor-pointer font-medium px-2 py-1 rounded hover:bg-gray-800/50"
            >
              {t(lang, 'footer_terms')}
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => onOpenLegal('/legal/privacy-policy.md')}
              className="text-gray-400 dark:text-gray-500 hover:text-brand-blue-300 hover:underline transition-all cursor-pointer font-medium px-2 py-1 rounded hover:bg-gray-800/50"
            >
              {t(lang, 'footer_privacy')}
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => onOpenLegal('/legal/accessibility-statement.md')}
              className="text-gray-400 dark:text-gray-500 hover:text-brand-blue-300 hover:underline transition-all cursor-pointer font-medium px-2 py-1 rounded hover:bg-gray-800/50"
            >
              {t(lang, 'footer_accessibility')}
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openRatingWidget'))}
              className="text-gray-400 dark:text-gray-500 hover:text-brand-blue-300 hover:underline transition-all cursor-pointer font-medium px-2 py-1 rounded hover:bg-gray-800/50"
            >
              {tx(lang, 'דרגו אותנו', 'Rate us', 'قيّمنا', 'Оценить', 'Αξιολογήστε')}
            </button>
          </div>

          <div className="flex justify-center md:justify-end items-center md:ml-24">
            <a
              href="https://waseemp.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors group"
              title="Built with wwwebsie"
            >
              <span className="text-sm">Built with</span>
              <img
                src="/ws-logo-100w.avif"
                alt="wwwebsie logo"
                loading="lazy"
                decoding="async"
                className="h-10 w-auto opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
