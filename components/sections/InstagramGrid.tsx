import { Heart, Instagram } from 'lucide-react';
import { Language } from '../../types';
import { tx } from '../../utils/i18n';
import { MouseParallax, ParallaxLayer } from '../MouseParallax';
import { useTilt3D } from '../hooks/useTilt3D';

interface Props {
  lang: Language;
  galleryImages: string[];
}

// Each card sits at a slightly different z-depth so the parallax layer
// translates them independently — the grid feels like a window onto a
// shallow 3D space, not a flat wall of pictures.
const DEPTHS = [0.25, 0.55, 0.4, 0.7, 0.5, 0.3, 0.65, 0.45];

export default function InstagramGrid({ lang, galleryImages }: Props) {
  const photos = galleryImages.slice(0, 8);

  return (
    <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px] transition-colors duration-300">
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

        {/* 3D depth wall: outer mouse-parallax, per-card tilt */}
        <MouseParallax range={28} className="max-w-5xl mx-auto" style={{ perspective: '1200px' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {photos.map((img, idx) => (
              <ParallaxLayer key={idx} depth={DEPTHS[idx % DEPTHS.length]}>
                <DepthCard img={img} />
              </ParallaxLayer>
            ))}
          </div>
        </MouseParallax>

        <div className="text-center mt-10">
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

function DepthCard({ img }: { img: string }) {
  const {
    ref: tiltRef,
    style: tiltOuterStyle,
    innerStyle: tiltInnerStyle,
    handlers: tiltHandlers,
  } = useTilt3D<HTMLAnchorElement>({ max: 8, scale: 1.04, perspective: 800 });

  return (
    <a
      ref={tiltRef}
      href="https://www.instagram.com/greek.souvlakii"
      target="_blank"
      rel="noopener noreferrer"
      style={tiltOuterStyle}
      {...tiltHandlers}
      className="relative aspect-square rounded-xl overflow-hidden group shadow-soft hover:shadow-pop transition-shadow duration-300 block"
    >
      <div style={tiltInnerStyle} className="relative w-full h-full">
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
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 rounded-full p-1.5 shadow-soft opacity-0 group-hover:opacity-100 transition-opacity">
          <Instagram className="w-4 h-4 text-pink-600" />
        </div>
      </div>
    </a>
  );
}
