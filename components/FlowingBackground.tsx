import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  /**
   * Pattern color (any CSS color). Default brand-terracotta-400.
   * Encoded into the SVG data-uri at runtime.
   */
  color?: string;
  /** Pattern opacity 0..1. Default 0.06. */
  opacity?: number;
}

/**
 * A section wrapper that paints a Greek-key (μαίανδρος) SVG pattern in the
 * background and gives it two flavors of motion:
 *
 *   1. Slow, continuous horizontal flow via CSS keyframes (always on,
 *      respects prefers-reduced-motion).
 *   2. Vertical scroll parallax — the pattern translates downward at half
 *      the page's scroll rate while the section is in view, so the bg
 *      feels like it's behind the content rather than glued to it.
 *
 * Pure SVG, zero asset weight. Pointer-events disabled and aria-hidden.
 */
export default function FlowingBackground({
  children,
  className = '',
  color = '#C0552B',
  opacity = 0.06,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Translate the bg layer between -10% and +10% as the section passes
  // through the viewport — this is the parallax depth.
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  // Greek-key (meander) tile — clean, instantly recognizable. Encoded as a
  // tiny inline SVG so we don't ship an extra request.
  const encoded = encodeURIComponent(GREEK_KEY_SVG.replace('__COLOR__', color));
  const bgImage = `url("data:image/svg+xml;charset=utf-8,${encoded}")`;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-[10%] inset-x-0 flow-bg"
        style={{
          y,
          backgroundImage: bgImage,
          backgroundRepeat: 'repeat',
          backgroundSize: '120px 120px',
          opacity,
        }}
      />
      <style>{`
        .flow-bg {
          animation: bg-flow 60s linear infinite;
          will-change: background-position;
        }
        @keyframes bg-flow {
          from { background-position: 0 0; }
          to   { background-position: 480px 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .flow-bg { animation: none !important; }
        }
      `}</style>
      <div className="relative">{children}</div>
    </div>
  );
}

// Single tile of a Greek key (meander) pattern. Stroke uses the brand
// color via __COLOR__ placeholder which gets substituted at runtime.
const GREEK_KEY_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60' fill='none'>
  <path d='M0 30 H10 V10 H30 V20 H20 V40 H40 V20 H30 V10 H50 V30 H60'
        stroke='__COLOR__' stroke-width='2' stroke-linecap='square'/>
</svg>`;
