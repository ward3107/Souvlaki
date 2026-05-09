import { ChevronDown, Star } from 'lucide-react';
import { Language } from '../../types';
import { t, tx } from '../../utils/i18n';
import { scrollToSection } from '../../utils/scroll';
import { MouseParallax, ParallaxLayer } from '../MouseParallax';
import MagneticButton from '../MagneticButton';

interface HeroProps {
  lang: Language;
}

export default function Hero({ lang }: HeroProps) {
  return (
    <MouseParallax
      range={20}
      className="relative h-[90vh] flex items-center justify-center overflow-hidden"
    >
      <section id="home" className="absolute inset-0 flex items-center justify-center">
        <ParallaxLayer depth={0.08} className="absolute inset-0 z-0">
          <div
            className="absolute -inset-4 bg-center bg-cover md:bg-fixed"
            style={{ backgroundImage: 'url(/gallery/hero-bg.webp)' }}
          />
          <div className="absolute inset-0 bg-gray-900/60" />
        </ParallaxLayer>

        <ParallaxLayer depth={0.5} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lift hover:bg-white/20 transition-all cursor-default">
            <img src="/favicon.png" alt="Logo" className="w-12 h-12 rounded-full" />
            <div className="flex gap-0.5 text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-7 h-7 fill-current" />
              ))}
            </div>
            <span className="text-white font-bold text-sm ml-1.5">4.9/5</span>
          </div>

          <h1
            className="font-display text-5xl md:text-7xl font-semibold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl"
            style={{ minHeight: '4.5rem' }}
          >
            {t(lang, 'hero_title')}
          </h1>
          <p
            className="text-xl md:text-2xl text-gray-100 mb-6 font-light max-w-2xl mx-auto drop-shadow-lg"
            style={{ minHeight: '3rem' }}
          >
            {t(lang, 'hero_subtitle')}
          </p>

          <p className="text-lg md:text-xl text-white/95 mb-8 font-normal max-w-3xl mx-auto drop-shadow-md leading-relaxed">
            {tx(
              lang,
              'מסעדה יוונית אותנטית בכפר יאסיף, הגליל המערבי. מתכונים משפחתיים מדור לדור, שילוב ייחודי של טריות ואותנטיות באווירה משפחתית חמה.',
              'An authentic Greek restaurant in Kfar Yasif, Western Galilee. Family recipes passed down through generations, featuring a unique blend of freshness and authenticity in a warm family atmosphere.',
              'مطعم يوناني أصيل في كفر ياسيف، الجليل الغربي. وصفات عائلية تنتقل عبر الأجيال، مزيج فريد من الطزاجة والأصالة في أجواء عائلية دافئة.',
              'Аутентичный греческий ресторан в Кафр-Ясиф, Западная Галилея. Семейные рецепты, передаваемые из поколения в поколение, уникальное сочетание свежести и аутентичности в теплой семейной атмосфере.',
              'Αυθεντικό ελληνικό εστιατόριο στο Καφρ Γιασίφ, Δυτική Γαλιλαία. Οικογενικές συνταγές που περνούν από γενιά σε γενιά, μοναδικός συνδυασμός φρεσκάδας και αυθεντικότητας σε μια ζεστή οικογενειακή ατμόσφαιρα.'
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton
              onClick={() => scrollToSection('menu')}
              className="px-8 py-4 bg-brand-terracotta-400 hover:bg-brand-terracotta-500 text-white rounded-full font-semibold text-lg shadow-lift hover:shadow-pop transition-all inline-block"
              ariaLabel={t(lang, 'hero_cta_menu')}
            >
              {t(lang, 'hero_cta_menu')}
            </MagneticButton>
          </div>
        </ParallaxLayer>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/40 z-10">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>
    </MouseParallax>
  );
}
