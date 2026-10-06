import { describe, expect, it } from 'vitest';
import { needsLiteEffects, type DeviceSignals } from '../src/renderingPolicy';

const desktop: DeviceSignals = {
  reducedMotion: false,
  coarsePointer: false,
  cores: 8,
  memory: 8,
  effectiveType: '4g',
};

describe('adaptive rendering policy', () => {
  it('keeps capable desktop devices cinematic', () => {
    expect(needsLiteEffects(desktop)).toBe(false);
  });
  it.each([
    { reducedMotion: true },
    { coarsePointer: true },
    { cores: 2 },
    { cores: 4 },
    { memory: 2 },
    { memory: 4 },
    { saveData: true },
    { effectiveType: 'slow-2g' },
    { effectiveType: '2g' },
    { effectiveType: '3g' },
  ])('uses static media for constrained devices: %j', (signals) => {
    expect(needsLiteEffects({ ...desktop, ...signals })).toBe(true);
  });
  it('does not mistake missing or invalid hardware hints for weak hardware', () => {
    expect(needsLiteEffects({ reducedMotion: false, coarsePointer: false })).toBe(false);
    expect(needsLiteEffects({ ...desktop, cores: 0, memory: 0 })).toBe(false);
  });
});
