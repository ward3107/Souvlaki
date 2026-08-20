import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Pure-SVG ingredient sprites — no external assets, ~negligible payload.
// Each one drifts slowly via CSS keyframes, then offsets further with mouse
// parallax on desktop. Disabled on touch + reduced-motion.

const OLIVE = (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="18" rx="10" ry="11" fill="#4A6B2D" />
    <ellipse cx="13" cy="14" rx="3" ry="4" fill="#7B9D5E" opacity="0.5" />
    <path d="M16 4c2 1 3 3 3 5s-1 3-3 3-3-1-3-3 1-4 3-5z" fill="#3F5A1F" />
  </svg>
);

const LEMON = (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="16" rx="13" ry="11" fill="#F5C946" />
    <ellipse cx="13" cy="13" rx="4" ry="3" fill="#FBE498" opacity="0.6" />
    <path
      d="M3 16h26M16 5v22M9 8l14 16M23 8L9 24"
      stroke="#D4A21D"
      strokeWidth="0.6"
      opacity="0.4"
    />
  </svg>
);

const PARSLEY = (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="12" r="4" fill="#3F8C3A" />
    <circle cx="16" cy="9" r="4.5" fill="#4DA847" />
    <circle cx="22" cy="13" r="4" fill="#3F8C3A" />
    <circle cx="14" cy="16" r="4" fill="#5BB853" />
    <circle cx="20" cy="19" r="3.5" fill="#4DA847" />
    <path d="M16 13v15" stroke="#4A6B2D" strokeWidth="1.2" />
  </svg>
);

const TOMATO = (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="18" r="11" fill="#D9434A" />
    <ellipse cx="13" cy="14" rx="3" ry="4" fill="#E8767A" opacity="0.5" />
    <path d="M11 7l5 4 5-4-3 5h-4l-3-5z" fill="#4A8033" />
  </svg>
);

interface Layout {
  id: string;
  ingredient: 'olive' | 'lemon' | 'parsley' | 'tomato';
  className: string; // position + size + opacity + animation duration
  depth: number;
}

// Six ingredients scattered. Position uses Tailwind utility classes; we keep
// a couple in the corners to anchor the section, others mid-flow.
const LAYOUT: Layout[] = [
  {
    id: 'a',
    ingredient: 'olive',
    className: 'top-[6%] left-[4%] w-12 md:w-16 opacity-15 animate-float-slow',
    depth: 0.6,
  },
  {
    id: 'b',
    ingredient: 'lemon',
    className: 'top-[20%] right-[8%] w-14 md:w-20 opacity-15 animate-float-medium',
    depth: 0.4,
  },
  {
    id: 'c',
    ingredient: 'parsley',
    className: 'top-[55%] left-[2%] w-16 md:w-24 opacity-15 animate-float-medium',
    depth: 0.5,
  },
  {
    id: 'd',
    ingredient: 'tomato',
    className: 'top-[40%] right-[4%] w-12 md:w-16 opacity-15 animate-float-slow',
    depth: 0.7,
  },
  {
    id: 'e',
    ingredient: 'parsley',
    className: 'bottom-[8%] right-[14%] w-12 md:w-16 opacity-10 animate-float-fast',
    depth: 0.3,
  },
  {
    id: 'f',
    ingredient: 'olive',
    className: 'bottom-[20%] left-[10%] w-10 md:w-14 opacity-15 animate-float-fast',
    depth: 0.5,
  },
];

const SVGS = { olive: OLIVE, lemon: LEMON, parsley: PARSLEY, tomato: TOMATO };

export default function IngredientFloaters() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.8 });

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

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    // Cache the rect on enter/resize so mousemove doesn't force a reflow per event.
    let rect = el.getBoundingClientRect();
    const cacheRect = () => {
      rect = el.getBoundingClientRect();
    };
    const onMove = (e: MouseEvent) => {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      mx.set(px * 30);
      my.set(py * 30);
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    el.addEventListener('mouseenter', cacheRect);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', cacheRect);
    return () => {
      el.removeEventListener('mouseenter', cacheRect);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', cacheRect);
    };
  }, [enabled, mx, my]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {LAYOUT.map((entry) => (
        <FloaterItem key={entry.id} entry={entry} sx={sx} sy={sy} />
      ))}
      <style>{`
        @keyframes float-slow { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(3deg); } }
        @keyframes float-medium { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(-4deg); } }
        @keyframes float-fast { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(5deg); } }
        .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 7s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-float-slow, .animate-float-medium, .animate-float-fast { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function FloaterItem({
  entry,
  sx,
  sy,
}: {
  entry: Layout;
  sx: ReturnType<typeof useMotionValue<number>>;
  sy: ReturnType<typeof useMotionValue<number>>;
}) {
  const x = useTransform(sx, (v) => v * entry.depth);
  const y = useTransform(sy, (v) => v * entry.depth);
  return (
    <motion.div className={`absolute ${entry.className}`} style={{ x, y, willChange: 'transform' }}>
      {SVGS[entry.ingredient]}
    </motion.div>
  );
}
