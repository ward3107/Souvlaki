import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const origin = 'https://www.greeksouflaki.com';
const pages = [
  ['en', '/', 'index.html'],
  ['he', '/he', 'he.html'],
  ['ar', '/ar', 'ar.html'],
  ['ru', '/ru', 'ru.html'],
  ['el', '/el', 'el.html'],
  ['en', '/menu', 'menu.html'],
  ['he', '/he/menu', 'he/menu.html'],
  ['ar', '/ar/menu', 'ar/menu.html'],
  ['ru', '/ru/menu', 'ru/menu.html'],
  ['el', '/el/menu', 'el/menu.html'],
];

const fail = (message) => {
  throw new Error(`SEO output verification failed: ${message}`);
};

for (const [lang, urlPath, file] of pages) {
  const absolute = resolve(dist, file);
  if (!existsSync(absolute)) fail(`missing ${file}`);
  const html = readFileSync(absolute, 'utf8');
  const canonical = `${origin}${urlPath}`;
  if (!html.includes(`<html lang="${lang}"`)) fail(`${file} has wrong language`);
  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) {
    fail(`${file} has wrong canonical`);
  }
  if (!html.includes('id="seo-prerender"')) fail(`${file} lacks crawlable content`);
  if (!html.includes('id="restaurant-schema"')) fail(`${file} lacks Restaurant schema`);
  if (!html.includes('id="webpage-schema"')) fail(`${file} lacks WebPage schema`);
  if (urlPath.endsWith('/menu') || urlPath === '/menu') {
    if (html.includes('id="faq-schema"')) fail(`${file} carries homepage FAQ schema`);
    if (!html.toLowerCase().includes('menu')) fail(`${file} lacks menu metadata`);
    if (!html.includes('id="menu-prerender-schema"')) fail(`${file} lacks static Menu schema`);
  } else if (!html.includes('id="faq-schema"')) {
    fail(`${file} lacks localized FAQ schema`);
  }
}

for (const file of ['sitemap.xml', 'robots.txt', 'llms.txt', 'llms-full.txt']) {
  if (!existsSync(resolve(dist, file))) fail(`missing ${file}`);
}

const sitemap = readFileSync(resolve(dist, 'sitemap.xml'), 'utf8');
for (const [, path] of pages) {
  if (!sitemap.includes(`<loc>${origin}${path}</loc>`)) fail(`sitemap is missing ${path}`);
}

console.log('SEO output verified: 10 localized pages, structured data, sitemap and AI files.');
