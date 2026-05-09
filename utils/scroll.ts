import { getLenis } from '../src/smoothScroll';

/**
 * Scroll to a section by id. Uses Lenis when active (desktop with motion
 * enabled), falls back to native scrollIntoView otherwise — so mobile keeps
 * its buttery native scroll and the two systems never fight.
 */
export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(element, { offset: -64 });
  } else {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

export function scrollToTop() {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
