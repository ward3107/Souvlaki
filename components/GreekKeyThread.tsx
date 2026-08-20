import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * A slim gold "thread" pinned to the left edge that fills from the top as the
 * visitor scrolls the page — a quiet, premium progress ribbon that ties the
 * whole site together. Desktop only; decorative, so aria-hidden.
 */
export default function GreekKeyThread() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      className="hidden lg:block fixed left-6 top-0 h-screen w-[3px] z-30 pointer-events-none"
      aria-hidden="true"
    >
      {/* Faint full-height track */}
      <div className="absolute inset-0 rounded-full bg-brand-blue-900/10 dark:bg-white/10" />
      {/* Gold-to-blue fill that grows from the top with scroll progress */}
      <motion.div
        className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-gradient-to-b from-[#C79A3A] via-[#C0552B] to-[#0B5FA5]"
        style={{ scaleY }}
      />
    </div>
  );
}
