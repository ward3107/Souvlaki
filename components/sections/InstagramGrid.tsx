import { Heart, Instagram } from 'lucide-react';
import { Language } from '../../types';
import { tx } from '../../utils/i18n';

interface Props {
  lang: Language;
  galleryImages: string[];
}

export default function InstagramGrid({ lang, galleryImages }: Props) {
  return (
    <section className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-terracotta-400 rounded-2xl mb-4 shadow-soft">
            <Instagram className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-4xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
            {tx(
              lang,
              'עקבו אחרינו באינסטגרם',
              'Follow Us on Instagram',
              'تابعنا على إنستغرام',
              'Подпишитесь на нас в Instagram',
              'Ακολουθήστε μας στο Instagram'
            )}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            {tx(
              lang,
              'צפו/י בתמונות הכי עדכניות של המנות המיוחדות שלנו, האווירה והעוד.',
              'Check out the latest photos of our signature dishes, atmosphere, and more.',
              'شاهد أحدث الصور لأطباقنا المميزة والأجواء والمزيد.',
              'Смотрите последние фото наших фирменных блюд, атмосферы и многого другого.',
              'Δείτε τις τελευταίες φωτογραφίες από τα σπεσιαλιτέ μας, την ατμόσφαιρα και πολλά άλλα.'
            )}
          </p>
          <a
            href="https://www.instagram.com/greek.souvlakii"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-terracotta-400 hover:bg-brand-terracotta-500 text-white rounded-full font-semibold shadow-soft hover:shadow-lift transition-all duration-300"
          >
            <Instagram className="w-5 h-5" />
            <span>@greek.souvlakii</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-5xl mx-auto">
          {galleryImages.slice(0, 8).map((img, idx) => (
            <a
              key={idx}
              href="https://www.instagram.com/greek.souvlakii"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={img}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <Heart className="w-5 h-5 fill-white" />
                  <Instagram className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <Instagram className="w-4 h-4 text-pink-600" />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/greek.souvlakii"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-terracotta-400 text-brand-terracotta-400 rounded-full font-semibold hover:bg-brand-terracotta-400 hover:text-white transition-all duration-300"
          >
            {tx(
              lang,
              'עוד תמונות באינסטגרם →',
              'More Photos on Instagram →',
              'المزيد من الصور على إنستغرام →',
              'Больше фото в Instagram →',
              'Περισσότερες φωτογραφίες στο Instagram →'
            )}
          </a>
        </div>
      </div>
    </section>
  );
}
