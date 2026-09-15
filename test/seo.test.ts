import { describe, expect, it } from 'vitest';
import { Language } from '../types';
import {
  canonicalUrl,
  languageAlternates,
  localizedPublicPath,
  MENU_SEO,
  stripLanguagePrefix,
} from '../utils/seo';

describe('localized public SEO routes', () => {
  it('normalizes language-prefixed routes', () => {
    expect(stripLanguagePrefix('/he/menu/')).toBe('/menu');
    expect(stripLanguagePrefix('/ar')).toBe('/');
    expect(stripLanguagePrefix('/menu')).toBe('/menu');
  });

  it('builds canonical home and menu paths without redirecting slashes', () => {
    expect(localizedPublicPath(Language.EN, '/menu')).toBe('/menu');
    expect(localizedPublicPath(Language.HE, '/menu')).toBe('/he/menu');
    expect(localizedPublicPath(Language.AR, '/')).toBe('/ar');
    expect(canonicalUrl(Language.EL, '/menu')).toBe('https://www.greeksouflaki.com/el/menu');
  });

  it('never copies an untrusted path or language into a navigation target', () => {
    expect(localizedPublicPath(Language.HE, '//evil.example/phish')).toBe('/he');
    expect(localizedPublicPath(Language.AR, '/menu/../../admin')).toBe('/ar');
    expect(localizedPublicPath('https://evil.example' as Language, '/menu')).toBe('/menu');
  });

  it('keeps each hreflang cluster on the same page type', () => {
    const menu = languageAlternates('/ru/menu');
    expect(menu.en).toBe('https://www.greeksouflaki.com/menu');
    expect(menu.he).toBe('https://www.greeksouflaki.com/he/menu');
    expect(menu['x-default']).toBe(menu.en);
  });

  it('has unique menu titles and useful descriptions in all languages', () => {
    const titles = new Set<string>();
    for (const lang of Object.values(Language)) {
      expect(MENU_SEO[lang].title.length).toBeGreaterThan(10);
      expect(MENU_SEO[lang].description.length).toBeGreaterThan(70);
      titles.add(MENU_SEO[lang].title);
    }
    expect(titles.size).toBe(Object.values(Language).length);
  });
});
