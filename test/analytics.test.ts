import { afterEach, describe, expect, it, vi } from 'vitest';
import { track } from '../utils/analytics';

type AnalyticsWindow = Window & { gtag?: (...args: unknown[]) => void };

afterEach(() => {
  delete (window as AnalyticsWindow).gtag;
});

describe('analytics', () => {
  it('is a no-op while analytics consent is absent', () => {
    expect(() => track('view_item', { item_id: 'pita-souvlaki' })).not.toThrow();
  });

  it('forwards an event when gtag is active', () => {
    const gtag = vi.fn();
    (window as AnalyticsWindow).gtag = gtag;

    track('add_to_cart', { currency: 'ILS', value: 30 });

    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag).toHaveBeenCalledWith('event', 'add_to_cart', {
      currency: 'ILS',
      value: 30,
    });
  });

  it('never lets an analytics failure interrupt the customer action', () => {
    (window as AnalyticsWindow).gtag = () => {
      throw new Error('blocked');
    };

    expect(() => track('begin_checkout')).not.toThrow();
  });
});
