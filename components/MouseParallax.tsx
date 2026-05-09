import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';

interface ParallaxValues {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

const ParallaxContext = createContext<ParallaxValues | null>(null);

interface LayerProps {
  depth?: number; // 0 = no movement, 1 = full movement
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  range?: number; // pixels of max travel
  style?: CSSProperties;
}

export function MouseParallax({ children, className, range = 24, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 80, damping: 18, mass: 0.6 });

  useEffect(() => {
    const hover = window.matchMedia('(hover: hover)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(hover.matches && !reduce.matches);
    update();
    hover.addEventListener('change', update);
    reduce.addEventListener('change', update);
    return () => {
      hover.removeEventListener('change', update);
      reduce.removeEventListener('change', update);
    };
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px * range);
    my.set(py * range);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <ParallaxContext.Provider value={{ x: sx, y: sy }}>
      <div
        ref={ref}
        className={className}
        style={style}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {children}
      </div>
    </ParallaxContext.Provider>
  );
}

export function ParallaxLayer({ depth = 0.4, children, className, style }: LayerProps) {
  const ctx = useContext(ParallaxContext);
  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  const baseX = ctx?.x ?? fallbackX;
  const baseY = ctx?.y ?? fallbackY;
  const x = useTransform(baseX, (v) => v * depth);
  const y = useTransform(baseY, (v) => v * depth);

  return (
    <motion.div className={className} style={{ ...style, x, y, willChange: 'transform' }}>
      {children}
    </motion.div>
  );
}
