import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  /** Background image src (full path from public/). */
  image: string;
  /** Optional content rendered over the image (quote, headline, etc.). */
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
 * A scroll-pinned parallax stripe. The background image translates at a
 * slower rate than scroll, so as the user scrolls past, the image appears
 * to "stay still" while everything else moves on. Smooth on every browser
 * (uses framer-motion + transforms, no `background-attachment: fixed`,
 * which is jittery on iOS Safari).
 */
export default function ParallaxStripe({
  image,
  children,
  height = '60vh',
  shift = 25,
  overlay = 0.45,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Bg layer scrolls at a slower rate than the section itself — that's
  // what creates the "pinned in place" illusion.
  const y = useTransform(scrollYProgress, [0, 1], [`-${shift}%`, `${shift}%`]);

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight: height }}
      aria-hidden={!children}
    >
      <motion.div
        className="absolute inset-x-0 bg-cover bg-center"
        style={{
          y,
          top: `-${shift}%`,
          bottom: `-${shift}%`,
          backgroundImage: `url(${image})`,
          willChange: 'transform',
        }}
      />
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
