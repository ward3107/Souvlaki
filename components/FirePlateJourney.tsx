import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { Language } from '../types';
import { tx } from '../utils/i18n';

interface Props {
  lang: Language;
}

type Stage = {
  kind: 'video' | 'image';
  src: string;
  poster?: string;
  he: string;
  en: string;
  ar: string;
  ru: string;
  el: string;
};

// The four beats of the story. Photos can be swapped freely — order is the story.
const STAGES: Stage[] = [
  {
    kind: 'video',
    src: '/video/grill.mp4',
    poster: '/video/grill-poster.jpg',
    he: 'הכל מתחיל באש.',
    en: 'It starts with fire.',
    ar: 'يبدأ كل شيء بالنار.',
    ru: 'Всё начинается с огня.',
    el: 'Όλα ξεκινούν με τη φωτιά.',
  },
  {
    kind: 'image',
    src: '/gallery/IMG-20251205-WA0040-400.webp',
    he: 'שיפודים על הגריל, בסבלנות.',
    en: 'Skewers over an open flame.',
    ar: 'أسياخ على النار المكشوفة.',
    ru: 'Шампуры на открытом огне.',
    el: 'Σουβλάκια στη φλόγα.',
  },
  {
    kind: 'image',
    src: '/gallery/IMG-20251205-WA0055-400.webp',
    he: 'עטוף בפיתה חמה וטרייה.',
    en: 'Wrapped in warm, fresh pita.',
    ar: 'ملفوف في خبز بيتا دافئ وطازج.',
    ru: 'Завёрнуто в тёплую свежую питу.',
    el: 'Τυλιγμένο σε ζεστή, φρέσκια πίτα.',
  },
  {
    kind: 'image',
    src: '/gallery/IMG-20251205-WA0063-400.webp',
    he: 'אל הצלחת שלך. תמיד טרי.',
    en: 'On your plate. Always fresh.',
    ar: 'إلى طبقك. طازج دائمًا.',
    ru: 'На вашей тарелке. Всегда свежо.',
    el: 'Στο πιάτο σας. Πάντα φρέσκο.',
  },
];

const N = STAGES.length;
const FADE = 0.06;

function StageLayer({
  stage,
  i,
  progress,
  reduce,
  allowVideo,
  videoRef,
}: {
  stage: Stage;
  i: number;
  progress: MotionValue<number>;
  reduce: boolean;
  allowVideo: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const start = i / N;
  // Stage 0 is the always-visible base; each later stage reveals over the previous.
  const opacity = useTransform(progress, [start, start + FADE], [0, 1]);
  // Slow cinematic push-in on the active beat.
  const scale = useTransform(progress, [start, start + 1 / N], reduce ? [1, 1] : [1.14, 1.0]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity: i === 0 ? 1 : opacity, zIndex: i }}
      aria-hidden="true"
    >
      <motion.div className="absolute inset-0" style={{ scale, willChange: 'transform' }}>
        {stage.kind === 'video' && allowVideo ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={stage.src}
            poster={stage.poster}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            className="w-full h-full object-cover"
            src={stage.kind === 'video' ? stage.poster || stage.src : stage.src}
            alt=""
            loading="lazy"
            decoding="async"
          />
        )}
      </motion.div>
      {/* Cinematic scrim — richens the image and keeps captions legible. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/40" />
    </motion.div>
  );
}

function Caption({
  stage,
  i,
  progress,
  lang,
}: {
  stage: Stage;
  i: number;
  progress: MotionValue<number>;
  lang: Language;
}) {
  const start = i / N;
  const end = (i + 1) / N;
  // Fade each caption fully in and out WITHIN its own beat window so adjacent
  // captions never overlap (they sit at the same spot). The last one stays.
  const w = 1 / (N * 4);
  const input = i === N - 1 ? [start, start + w, 1] : [start, start + w, end - w, end];
  const output = i === N - 1 ? [0, 1, 1] : [0, 1, 1, 0];
  const opacity = useTransform(progress, input, output);
  const y = useTransform(progress, [start, start + w], [28, 0]);

  return (
    <motion.p
      className="absolute inset-x-0 bottom-0 font-display text-3xl md:text-5xl font-semibold text-white tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
      style={{ opacity, y }}
    >
      {tx(lang, stage.he, stage.en, stage.ar, stage.ru, stage.el)}
    </motion.p>
  );
}

function Dot({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const start = i / N;
  const end = (i + 1) / N;
  const opacity = useTransform(
    progress,
    [Math.max(0, start - FADE), start + FADE * 0.5, end - FADE * 0.5, Math.min(1, end + FADE)],
    [0.35, 1, 1, 0.35]
  );
  return (
    <motion.span
      className="block h-1 w-6 rounded-full bg-white"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}

export default function FirePlateJourney({ lang }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // Skip the grill video on reduced-motion / data-saver — the poster carries it.
  // Derived during render (no effect) so it never triggers a cascading re-render.
  const saveData = !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    ?.saveData;
  const allowVideo = !reduce && !saveData;

  // Only decode/play the grill video while the section is on screen — otherwise
  // it keeps burning GPU behind the rest of the page and causes scroll jank.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !allowVideo) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) el.play().catch(() => {});
          else el.pause();
        }
      },
      { threshold: 0.05 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [allowVideo]);

  return (
    <section
      ref={ref}
      aria-label={tx(
        lang,
        'מהאש אל הצלחת',
        'From fire to plate',
        'من النار إلى الطبق',
        'От огня до тарелки',
        'Από τη φωτιά στο πιάτο'
      )}
      style={{ height: `${N * 64}vh` }}
      className="relative bg-black"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {STAGES.map((s, i) => (
          <StageLayer
            key={i}
            stage={s}
            i={i}
            progress={scrollYProgress}
            reduce={reduce}
            allowVideo={allowVideo}
            videoRef={videoRef}
          />
        ))}

        {/* Stage progress ticks */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {STAGES.map((_, i) => (
            <Dot key={i} i={i} progress={scrollYProgress} />
          ))}
        </div>

        {/* Captions */}
        <div className="absolute inset-0 z-20 flex items-end justify-center pb-24 px-6 pointer-events-none">
          <div className="relative w-full max-w-3xl h-16 text-center">
            {STAGES.map((s, i) => (
              <Caption key={i} stage={s} i={i} progress={scrollYProgress} lang={lang} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
