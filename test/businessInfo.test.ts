import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BUSINESS_INFO } from '../utils/businessInfo';
import { OPEN_DAYS, OPEN_TIME_LABEL } from '../utils/openStatus';

const PUBLIC_INFO_FILES = [
  'README.md',
  'HANDOFF.md',
  'REQUESTS.md',
  'constants.ts',
  'index.html',
  'scripts/prerender-i18n.mjs',
  'legal/privacy-policy.md',
  'public/legal/privacy-policy.md',
];

describe('business information', () => {
  it('uses the verified public contact details and hours', () => {
    expect(BUSINESS_INFO.phone.display).toBe('04-812-2980');
    expect(BUSINESS_INFO.whatsapp.display).toBe('052-892-1454');
    expect(BUSINESS_INFO.whatsapp.href).toBe('https://wa.me/972528921454');
    expect(BUSINESS_INFO.hours.display).toBe('13:00–00:00');
    expect(OPEN_DAYS).toEqual([3, 4, 5, 6]);
    expect(OPEN_TIME_LABEL).toBe('13:00 - 00:00');
  });

  it('does not reintroduce stale public contact information', () => {
    const publicInfo = PUBLIC_INFO_FILES.map((file) =>
      readFileSync(resolve(process.cwd(), file), 'utf8')
    ).join('\n');

    expect(publicInfo).not.toContain('054-200-1235');
    expect(publicInfo).not.toContain('+972-54-200-1235');
    expect(publicInfo).not.toContain('972542001235');
    expect(publicInfo).not.toContain('01:00');
    expect(publicInfo).not.toContain('[INSERT EMAIL]');
  });
});
