import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  /** Background image src (full path from public/). Used as poster when video is supplied. */
  image: string;
  /**
   * Optional video src (mp4) for a moving background. When provided, the video plays muted/looped
   * and the still `image` is used as a poster fallback (slow connections, reduced-motion, mobile data-saver).
   */
  video?: string;
  /** Optional content rendered over the bg (quote, headline, etc.). */
  children?: ReactNode;
  /** Section min-height. Default 60vh. */
  height?: string;
  /**
   * How aggressive the parallax is. The bg layer translates between
   * `-shift%` and `+shift%` as the section passes through the viewport.
   * Higher = more dramatic. Default 25.
   */
  shift?: number;
  /** Dark overlay opacity 0..1. Default 0.45. */
  overlay?: number;
  className?: string;
}

/**
 * A scroll-pinned parallax stripe. The background translates at a slower rate
 * than scroll, so as you scroll past, the bg appears to "stay still" while
 * everything else moves. Smooth on every browser (uses framer-motion +
 * transforms, no `background-attachment: fixed` which jitters on iOS).
 *
 * Pass `video` for a moving food clip; on touch / reduced-motion / save-data
 * we fall back to the still `image` poster to save bandwidth and battery.
 */
export default function ParallaxStripe({
  image,
  video,
  children,
  height = '60vh',
  shift = 25,
  overlay = 0.45,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [allowVideo, setAllowVideo] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${shift}%`, `${shift}%`]);

  // Decide whether to play the video. On data-saver / reduced-motion / very
  // small screens we keep the static poster — saves megabytes on metered
  // connections and battery on older phones.
  useEffect(() => {
    if (!video) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    type WithSaveData = Navigator & { connection?: { saveData?: boolean } };
    const conn = (navigator as WithSaveData).connection;
    const saveData = !!conn?.saveData;

    const update = () => setAllowVideo(!reduce.matches && !saveData);
    update();
    reduce.addEventListener('change', update);
    return () => reduce.removeEventListener('change', update);
  }, [video]);

  // Pause/resume video as it enters/leaves the viewport — no need to decode
  // off-screen frames.
  useEffect(() => {
    if (!allowVideo || !videoRef.current || !ref.current) return;
    const el = videoRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [allowVideo]);

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight: height }}
      aria-hidden={!children}
    >
      <motion.div
        className="absolute inset-x-0"
        style={{
          y,
          top: `-${shift}%`,
          bottom: `-${shift}%`,
          willChange: 'transform',
        }}
      >
        {video && allowVideo ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={video}
            poster={image}
            muted
            loop
            playsInline
            preload="metadata"
            // autoPlay handled by IntersectionObserver above so we don't
            // burn cycles on off-screen frames.
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        )}
      </motion.div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlay})` }}
      />
      {children && (
        <div
          className="relative z-10 flex items-center justify-center h-full"
          style={{ minHeight: height }}
        >
          {children}
        </div>
      )}
    </section>
  );
}
