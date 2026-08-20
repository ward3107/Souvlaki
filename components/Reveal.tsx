import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
  once?: boolean;
}

const buildVariants = (y: number, x: number): Variants => ({
  // Gentle "camera moving closer" entrance: the piece scales up into place as it
  // scrolls into view. One-time (whileInView), so it never costs anything on scroll.
  hidden: { opacity: 0, y, x, scale: 0.94, rotateX: x === 0 ? 6 : 0 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
});

export default function Reveal({
  children,
  delay = 0,
  y = 32,
  x = 0,
  className,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1200 }}
      variants={buildVariants(y, x)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
