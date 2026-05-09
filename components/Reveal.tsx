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
  hidden: { opacity: 0, y, x, rotateX: x === 0 ? 6 : 0 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
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
