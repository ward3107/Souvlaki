import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { FAQS, SEO_METADATA, TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { MENU_CATEGORIES, type Lang, type LocalizedString } from '../utils/menuData';

const LANGUAGES: Lang[] = ['he', 'en', 'ar', 'ru', 'el'];

function expectCompleteTranslation(value: LocalizedString) {
  for (const lang of LANGUAGES) {
    expect(value[lang].trim(), `missing ${lang} translation`).not.toBe('');
  }
}

function collectTypeScriptFiles(path: string): string[] {
  if (!statSync(path).isDirectory()) return /\.tsx?$/.test(path) ? [path] : [];
  return readdirSync(path).flatMap((entry) => collectTypeScriptFiles(resolve(path, entry)));
}

describe('customer-facing content quality', () => {
  it('keeps every menu label complete and every identifier unique', () => {
    const ids = new Set<string>();

    for (const category of MENU_CATEGORIES) {
      expect(ids.has(category.id), `duplicate category id: ${category.id}`).toBe(false);
      ids.add(category.id);
      expectCompleteTranslation(category.name);

      for (const item of category.items) {
        expect(ids.has(item.id), `duplicate menu item id: ${item.id}`).toBe(false);
        ids.add(item.id);
        expectCompleteTranslation(item.name);
        if (item.description) expectCompleteTranslation(item.description);
        expect(item.price).toBeGreaterThan(0);

        if (item.image) {
          expect(item.image.startsWith('/')).toBe(true);
          expect(
            existsSync(resolve(process.cwd(), 'public', item.image.slice(1))),
            `missing menu image: ${item.image}`
          ).toBe(true);
        }

        for (const variant of item.variants ?? []) {
          expectCompleteTranslation(variant.label);
        }
      }

      for (const addon of category.addons ?? []) {
        expectCompleteTranslation(addon.name);
      }
    }
  });

  it('does not attach misleading dish photos', () => {
    const items = MENU_CATEGORIES.flatMap((category) => category.items);
    const byId = (id: string) => items.find((item) => item.id === id);

    expect(byId('pita-gf')?.image).toBeUndefined();
    expect(byId('pizza-small')?.image).toBeUndefined();
    expect(byId('pizza-large')?.image).toBeUndefined();
    expect(byId('greek-salad')?.image).toBeUndefined();
    expect(byId('fries')?.image).toBe('/gallery/IMG-20251205-WA0048-400.webp');
  });

  it('keeps navigation, FAQ, and SEO copy complete in all five languages', () => {
    for (const lang of Object.values(Language)) {
      for (const value of Object.values(TRANSLATIONS[lang])) expect(value.trim()).not.toBe('');
      for (const value of Object.values(SEO_METADATA[lang])) expect(value.trim()).not.toBe('');
    }

    for (const faq of FAQS) {
      expectCompleteTranslation(faq.question);
      expectCompleteTranslation(faq.answer);
    }
  });

  it('provides all five translations for every inline tx call', () => {
    const roots = ['components', 'utils', 'App.tsx'].map((path) => resolve(process.cwd(), path));
    const incompleteCalls: string[] = [];

    for (const file of roots.flatMap(collectTypeScriptFiles)) {
      const source = readFileSync(file, 'utf8');
      const sourceFile = ts.createSourceFile(
        file,
        source,
        ts.ScriptTarget.Latest,
        true,
        file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
      );
      const visit = (node: ts.Node) => {
        if (
          ts.isCallExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === 'tx' &&
          node.arguments.length < 6
        ) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
          incompleteCalls.push(`${file}:${line + 1}`);
        }
        ts.forEachChild(node, visit);
      };
      visit(sourceFile);
    }

    expect(incompleteCalls).toEqual([]);
  });

  it('blocks known placeholder content and translation mistakes', () => {
    const files = [
      'constants.ts',
      'index.html',
      'scripts/prerender-i18n.mjs',
      'components/ShareModal.tsx',
      'components/sections/Footer.tsx',
      'utils/menuData.ts',
      'vite.config.ts',
      'public/legal/accessibility-statement.md',
    ];
    const content = files
      .map((file) => readFileSync(resolve(process.cwd(), file), 'utf8'))
      .join('\n');

    for (const staleText of [
      'picsum.photos',
      'סובלקי',
      'פיתה טרה',
      'שישודים',
      'תלוו להזמין',
      'Κουφ Γιασίφ',
      'Κφαρ Γιασίφ',
      'Vegan σουβλάκι',
    ]) {
      expect(content).not.toContain(staleText);
    }
  });
});
