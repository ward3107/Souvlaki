import { Camera, Instagram } from 'lucide-react';
import { Language } from '../../types';
import { tx } from '../../utils/i18n';

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
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {tx(
              lang,
              'צילמ/ת תמונה של האוכל שלנו? תייג/י אותנו ב-@greek.souvlakii ונשתף אותך בעמוד שלנו!',
              "Took a photo of our food? Tag us @greek.souvlakii and we'll share you on our page!",
              'التقطت صورة لطعامنا؟ ضع علامة علينا في @greek.souvlakii وسنقوم بمشاركتك!',
              'Сфоткали нашу еду? Отметьте нас @greek.souvlakii и мы поделимся вами!',
              'Φωτογράψατε το φαγητό μας; Tag μας στο @greek.souvlakii και θα σας μοιραστούμε!'
            )}
          </p>
          <a
            href="https://www.instagram.com/greek.souvlakii"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-terracotta-400 rounded-full font-semibold text-lg shadow-lift hover:shadow-pop hover:scale-105 transition-all duration-300"
          >
            <Instagram className="w-6 h-6" />
            <span>@greek.souvlakii</span>
          </a>
        </div>
      </div>
    </section>
  );
}
