import { useEffect, useRef } from 'react';
import { useLiteEffects } from '../src/renderingPolicy';

interface Props {
  src: string;
  poster: string;
  className?: string;
  priority?: boolean;
}

/** Decorative video has no source until visible, and never downloads in lite
 * mode. The image remains beneath it on autoplay failure or unsupported video.
 * Observe a normal-flow host: a sticky hero can intersect while fully covered. */
export default function AmbientVideo({ src, poster, className, priority = false }: Props) {
  const lite = useLiteEffects();
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    const target = host.current;
    if (lite || !element || !target || !('IntersectionObserver' in window)) return;
    let visible = false;
    let disposed = false;
    const syncPlayback = () => {
      if (!visible || document.hidden || disposed) {
        element.pause();
        return;
      }
      if (!element.getAttribute('src')) element.src = src;
      element
        .play()
        .then(() => {
          if (!visible || document.hidden || disposed) element.pause();
        })
        .catch(() => {
          /* Poster remains visible if autoplay is unavailable. */
        });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.05 }
    );
    observer.observe(target);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      element.pause();
      element.removeAttribute('src');
      element.load();
    };
  }, [lite, src]);

  return (
    <div ref={host} className={className} aria-hidden="true">
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        decoding="async"
      />
      {!lite && (
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
        />
      )}
    </div>
  );
}
