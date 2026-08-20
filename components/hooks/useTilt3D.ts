import { useEffect, useRef, useState } from 'react';

interface Options {
  max?: number;
  scale?: number;
  perspective?: number;
}

/**
 * 3D tilt-on-hover for a card. The tilt transform is written straight to the
 * DOM inside a requestAnimationFrame — NOT via React state — so moving the
 * cursor never triggers a re-render of the card and its children. This matters
 * because these cards live in grids (Instagram, Menu) where a setState per
 * mousemove (~120/s) would thrash the whole subtree.
 *
 * Usage: attach `ref` to the outer element (owns the perspective), spread
 * `handlers` onto it, and attach `innerRef` + `innerStyle` to the inner element
 * that actually tilts.
 */
export function useTilt3D<T extends HTMLElement>({
  max = 10,
  scale = 1.02,
  perspective = 1000,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  const rectRef = useRef<DOMRect | null>(null);
  const coordsRef = useRef({ rx: 0, ry: 0 });
  const rafRef = useRef<number | null>(null);

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

  // Cancel any pending frame on unmount.
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const writeTransform = (rx: number, ry: number, active: boolean) => {
    const el = innerRef.current;
    if (!el) return;
    const s = active ? scale : 1;
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${s}, ${s}, 1)`;
    el.style.transition = active ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out';
  };

  const onMouseEnter = () => {
    if (!enabled) return;
    // Cache the rect once on enter so mousemove doesn't force a reflow per event.
    rectRef.current = ref.current?.getBoundingClientRect() ?? null;
  };

  const onMouseMove = (e: React.MouseEvent<T>) => {
    if (!enabled) return;
    const rect = rectRef.current ?? ref.current?.getBoundingClientRect() ?? null;
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    coordsRef.current = {
      rx: ((y - cy) / cy) * -max,
      ry: ((x - cx) / cx) * max,
    };
    // Throttle to one DOM write per frame.
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      writeTransform(coordsRef.current.rx, coordsRef.current.ry, true);
    });
  };

  const onMouseLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    coordsRef.current = { rx: 0, ry: 0 };
    writeTransform(0, 0, false);
  };

  const style: React.CSSProperties = enabled ? { perspective: `${perspective}px` } : {};

  // Static base for the inner element; the dynamic transform is applied
  // imperatively in writeTransform() above.
  const innerStyle: React.CSSProperties = enabled
    ? {
        transformStyle: 'preserve-3d',
        transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.4s ease-out',
        willChange: 'transform',
      }
    : {};

  return {
    ref,
    innerRef,
    style,
    innerStyle,
    handlers: enabled ? { onMouseMove, onMouseEnter, onMouseLeave } : {},
  };
}
