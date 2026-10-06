import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AmbientVideo from '../components/AmbientVideo';

let intersect: IntersectionObserverCallback;
let reducedMotion: MediaQueryList;

beforeEach(() => {
  vi.spyOn(navigator, 'hardwareConcurrency', 'get').mockReturnValue(8);
  reducedMotion = Object.assign(new EventTarget(), { matches: false }) as unknown as MediaQueryList;
  vi.spyOn(window, 'matchMedia').mockImplementation((query) =>
    query.includes('reduced-motion')
      ? reducedMotion
      : (Object.assign(new EventTarget(), { matches: false }) as MediaQueryList)
  );
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersect = callback;
      }
      observe() {}
      disconnect() {}
    }
  );
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
});

afterEach(() => vi.restoreAllMocks());

function visibility(isIntersecting: boolean) {
  act(() =>
    intersect([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver)
  );
}

describe('decorative video lifecycle', () => {
  it('does not request video until visible, then pauses offscreen and releases on unmount', async () => {
    const { container, unmount } = render(<AmbientVideo src="/demo.mp4" poster="/poster.webp" />);
    const video = container.querySelector('video')!;
    expect(video.getAttribute('src')).toBeNull();
    visibility(true);
    expect(video.getAttribute('src')).toBe('/demo.mp4');
    expect(video.play).toHaveBeenCalled();
    visibility(false);
    expect(video.pause).toHaveBeenCalled();
    unmount();
    expect(video.getAttribute('src')).toBeNull();
    expect(video.load).toHaveBeenCalled();
  });
  it('reduced motion never mounts a video or exposes a video source', () => {
    Object.assign(reducedMotion, { matches: true });
    const { container } = render(<AmbientVideo src="/demo.mp4" poster="/poster.webp" />);
    expect(container.querySelector('video')).toBeNull();
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/poster.webp');
  });
  it('reacts immediately when motion preferences change', () => {
    const { container } = render(<AmbientVideo src="/demo.mp4" poster="/poster.webp" />);
    visibility(true);
    act(() => {
      Object.assign(reducedMotion, { matches: true });
      reducedMotion.dispatchEvent(new Event('change'));
    });
    expect(container.querySelector('video')).toBeNull();
  });
  it('retains its poster if autoplay fails', async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValue(new Error('Autoplay blocked'));
    const { container } = render(<AmbientVideo src="/demo.mp4" poster="/poster.webp" />);
    visibility(true);
    await act(async () => {});
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/poster.webp');
    expect(screen.queryByRole('alert')).toBeNull();
  });
  it('pauses on hidden tabs and resumes only when still visible', () => {
    const hidden = vi.spyOn(document, 'hidden', 'get');
    hidden.mockReturnValue(false);
    const { container } = render(<AmbientVideo src="/demo.mp4" poster="/poster.webp" />);
    visibility(true);
    const video = container.querySelector('video')!;
    hidden.mockReturnValue(true);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(video.pause).toHaveBeenCalled();
    const calls = vi.mocked(video.play).mock.calls.length;
    visibility(false);
    hidden.mockReturnValue(false);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(video.play).toHaveBeenCalledTimes(calls);
  });
});
