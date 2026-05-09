import { useEffect, useRef, useState } from 'react';

interface Tilt {
  rx: number;
  ry: number;
  active: boolean;
}

interface Options {
  max?: number;
  scale?: number;
  perspective?: number;
}

export function useTilt3D<T extends HTMLElement>({
  max = 10,
  scale = 1.02,
  perspective = 1000,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [tilt, setTilt] = useState<Tilt>({ rx: 0, ry: 0, active: false });
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

  const onMouseMove = (e: React.MouseEvent<T>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    setTilt({
      rx: ((y - cy) / cy) * -max,
      ry: ((x - cx) / cx) * max,
      active: true,
    });
  };

  const onMouseEnter = () => enabled && setTilt((t) => ({ ...t, active: true }));
  const onMouseLeave = () => setTilt({ rx: 0, ry: 0, active: false });

  const style: React.CSSProperties = enabled
    ? {
        perspective: `${perspective}px`,
      }
    : {};

  const innerStyle: React.CSSProperties = enabled
    ? {
        transformStyle: 'preserve-3d',
        transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(${
          tilt.active ? scale : 1
        }, ${tilt.active ? scale : 1}, 1)`,
        transition: tilt.active ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
        willChange: 'transform',
      }
    : {};

  return {
    ref,
    style,
    innerStyle,
    handlers: enabled ? { onMouseMove, onMouseEnter, onMouseLeave } : {},
  };
}
