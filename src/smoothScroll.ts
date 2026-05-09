import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (typeof window === 'undefined') return;
  if (lenis) return lenis;

  // Respect reduced-motion AND skip on touch devices — native scroll on
  // phones/tablets is already buttery and Lenis just fights it.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(pointer: coarse)').matches || !matchMedia('(hover: hover)').matches;
  if (reduce || isTouch) return null;

  lenis = new Lenis({
    // Snappier feel: lerp-driven (constant catch-up) instead of duration-based,
    // gives a clean "tracks the wheel" response on desktop trackpads + mice.
    lerp: 0.12,
    wheelMultiplier: 1.1,
    smoothWheel: true,
    syncTouch: false,
  });

  function raf(time: number) {
    lenis!.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenis;
}

export function getLenis() {
  return lenis;
}
