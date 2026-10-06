import { useSyncExternalStore } from 'react';

export interface DeviceSignals {
  reducedMotion: boolean;
  coarsePointer: boolean;
  cores?: number;
  memory?: number;
  saveData?: boolean;
  effectiveType?: string;
}

// Touch devices get the same photography and story with native scrolling and
// static compositions. Missing hardware/network hints alone never imply a
// weak device (Safari does not expose deviceMemory or Network Information).
export function needsLiteEffects(signals: DeviceSignals): boolean {
  return (
    signals.reducedMotion ||
    signals.coarsePointer ||
    signals.saveData === true ||
    (signals.cores !== undefined && signals.cores > 0 && signals.cores <= 4) ||
    (signals.memory !== undefined && signals.memory > 0 && signals.memory <= 4) ||
    signals.effectiveType === 'slow-2g' ||
    signals.effectiveType === '2g' ||
    signals.effectiveType === '3g'
  );
}

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };
type DeviceNavigator = Navigator & { deviceMemory?: number; connection?: Connection };

export function prefersLiteEffects(): boolean {
  if (typeof window === 'undefined') return true;
  const device = navigator as DeviceNavigator;
  return needsLiteEffects({
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
    cores: device.hardwareConcurrency,
    memory: device.deviceMemory,
    saveData: device.connection?.saveData,
    effectiveType: device.connection?.effectiveType,
  });
}

const listeners = new Set<() => void>();
let stopListening: (() => void) | undefined;

export function subscribeRenderingPolicy(listener: () => void) {
  listeners.add(listener);
  if (!stopListening) {
    const notify = () => listeners.forEach((callback) => callback());
    const queries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(pointer: coarse)'),
    ];
    // Older Safari only provides addListener/removeListener.
    queries.forEach((query) => {
      if (query.addEventListener) query.addEventListener('change', notify);
      else query.addListener(notify);
    });
    const connection = (navigator as DeviceNavigator).connection;
    connection?.addEventListener?.('change', notify);
    stopListening = () => {
      queries.forEach((query) => {
        if (query.removeEventListener) query.removeEventListener('change', notify);
        else query.removeListener(notify);
      });
      connection?.removeEventListener?.('change', notify);
    };
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      stopListening?.();
      stopListening = undefined;
    }
  };
}

export function useLiteEffects() {
  return useSyncExternalStore(subscribeRenderingPolicy, prefersLiteEffects, () => true);
}

// Set before React's first paint; also applies to CSS-only ambient effects.
export function initRenderingPolicy() {
  const update = () => {
    document.documentElement.dataset.effects = prefersLiteEffects() ? 'lite' : 'full';
  };
  update();
  return subscribeRenderingPolicy(update);
}
