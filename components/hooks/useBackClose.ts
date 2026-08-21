import { useEffect, useRef } from 'react';

/**
 * Makes the browser / mobile **Back** button close an open overlay (modal,
 * fullscreen viewer, mobile menu) instead of navigating the page away.
 *
 * While `active` is true it pushes one history entry; pressing Back pops that
 * entry and fires `onClose` rather than leaving the page. If the overlay is
 * instead closed through the UI (an X button, backdrop tap, Escape), the entry
 * we added is popped on cleanup so the history stack stays clean either way.
 *
 * Pass `active` as the overlay's open state. For components that only mount
 * while open, pass `true`.
 */
export function useBackClose(active: boolean, onClose: () => void): void {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!active || typeof window === 'undefined') return;

    window.history.pushState({ overlay: true }, '');
    const onPop = () => onCloseRef.current();
    window.addEventListener('popstate', onPop);

    return () => {
      window.removeEventListener('popstate', onPop);
      // Closed via the UI → our entry is still on top, so pop it. Closed via
      // Back → the browser already popped it (state.overlay is gone) → skip,
      // otherwise we'd navigate one step too far.
      if (window.history.state?.overlay) {
        window.history.back();
      }
    };
  }, [active]);
}
