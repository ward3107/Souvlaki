import type Lenis from 'lenis';
import { prefersLiteEffects, subscribeRenderingPolicy } from './renderingPolicy';

let lenis: Lenis | null = null;
let rafId: number | null = null;
let loading: Promise<Lenis | null> | null = null;
let cleanup: (() => void) | null = null;

export function initSmoothScroll(): Promise<Lenis | null> | null {
  if (typeof window === 'undefined' || prefersLiteEffects()) return null;
  if (lenis) return Promise.resolve(lenis);
  if (loading) return loading;

  loading = import('lenis')
    .then(({ default: LenisClass }) => {
      // The preference may have changed while the optional chunk downloaded.
      if (prefersLiteEffects()) return null;
      lenis = new LenisClass({
        lerp: 0.12,
        wheelMultiplier: 1.1,
        smoothWheel: true,
        syncTouch: false,
      });
      const raf = (time: number) => {
        if (!lenis || document.hidden) {
          rafId = null;
          return;
        }
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      const visibility = () => {
        if (document.hidden) {
          if (rafId !== null) cancelAnimationFrame(rafId);
          rafId = null;
          lenis?.stop();
        } else {
          lenis?.start();
          if (lenis && rafId === null) rafId = requestAnimationFrame(raf);
        }
      };
      const change = () => {
        if (prefersLiteEffects()) destroySmoothScroll();
      };
      const unsubscribe = subscribeRenderingPolicy(change);
      document.addEventListener('visibilitychange', visibility);
      cleanup = () => {
        unsubscribe();
        document.removeEventListener('visibilitychange', visibility);
      };
      visibility();
      return lenis;
    })
    .catch(() => null)
    .finally(() => {
      loading = null;
    });
  return loading;
}

export function destroySmoothScroll() {
  cleanup?.();
  cleanup = null;
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = null;
  lenis?.destroy();
  lenis = null;
}

export function getLenis() {
  return lenis;
}
