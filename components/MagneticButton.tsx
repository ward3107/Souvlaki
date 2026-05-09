import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  strength?: number; // pixels of pull at edge
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

export default function MagneticButton({
  children,
  className,
  onClick,
  ariaLabel,
  strength = 18,
  as = 'button',
  href,
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(mq.matches && !reduce.matches);
    update();
    mq.addEventListener('change', update);
    reduce.addEventListener('change', update);
    return () => {
      mq.removeEventListener('change', update);
      reduce.removeEventListener('change', update);
    };
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.4 });

  // Children get a slightly smaller pull for parallax depth
  const childX = useTransform(springX, (v) => v * 0.55);
  const childY = useTransform(springY, (v) => v * 0.55);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ((e.clientX - cx) / (rect.width / 2)) * strength;
    const dy = ((e.clientY - cy) / (rect.height / 2)) * strength;
    x.set(dx);
    y.set(dy);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY, display: 'inline-block' }}
    >
      <motion.div style={{ x: childX, y: childY }}>{children}</motion.div>
    </motion.div>
  );

  if (as === 'a') {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={className}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <button onClick={onClick} aria-label={ariaLabel} className={className}>
      {inner}
    </button>
  );
}
