import { getLenis } from '../src/smoothScroll';

// The header is `sticky top-0` and 80px tall (h-20). Scroll targets must clear
// it, or the section heading lands hidden underneath the translucent header.
const HEADER_OFFSET = 80;

/**
 * Scroll to a section by id. Uses Lenis when active (desktop with motion
 * enabled), falls back to a manual native scroll otherwise — so mobile keeps
 * its buttery native scroll and the two systems never fight. Both branches
 * clear the sticky header by HEADER_OFFSET.
 */
export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  const target = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  const lenis = getLenis();
  if (lenis) {
    // Refresh Lenis' cached page dimensions first — right after a route swap
    // its ResizeObserver hasn't fired yet, so a deep target would get clamped
    // to a stale (too-small) scroll limit. Pass a resolved number, not the
    // element, so Lenis doesn't recompute the offset from the stale cache.
    lenis.resize();
    lenis.scrollTo(target);
  } else {
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
}

/**
 * Scroll to a section that may not have mounted yet, and whose final position
 * keeps shifting after the scroll begins — e.g. routing from /menu back to the
 * homepage, where the heavy tree (hero video, full-screen cinematic sections)
 * mounts over several frames, and lazy images below the fold (the 35-photo
 * Instagram grid) load *as we scroll down* and shove deep sections like Contact
 * hundreds of pixels further down.
 *
 * A single scroll can't hit a moving target. Instead we close the loop: each
 * animation frame, if the section isn't aligned under the header, we (re)issue
 * a scroll — but only once the current scroll has settled, so we correct for
 * layout shifts without fighting an in-flight animation. We stop once it holds
 * at the target for a few frames, or the frame budget runs out.
 */
export function scrollToSectionWhenReady(id: string, maxFrames = 240) {
  const TOLERANCE = 4;
  let prevScrollY = Number.NaN;
  let alignedFrames = 0;
  const step = (remaining: number) => {
    const element = document.getElementById(id);
    if (element) {
      const viewportTop = element.getBoundingClientRect().top;
      const scrollY = Math.round(window.scrollY);
      if (Math.abs(viewportTop - HEADER_OFFSET) <= TOLERANCE) {
        alignedFrames += 1;
        if (alignedFrames >= 3) return; // settled at the target
      } else {
        alignedFrames = 0;
        // Re-issue only when the previous scroll has stopped moving, so we
        // nudge toward the (possibly shifted) target instead of interrupting
        // an animation mid-flight.
        if (scrollY === prevScrollY) scrollToSection(id);
      }
      prevScrollY = scrollY;
    }
    if (remaining > 0) {
      requestAnimationFrame(() => step(remaining - 1));
    }
  };
  requestAnimationFrame(() => step(maxFrames));
}

export function scrollToTop() {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
