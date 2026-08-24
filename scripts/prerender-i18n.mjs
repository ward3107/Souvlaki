/**
 * Per-language static prerender for Google.
 *
 * The site is a client-rendered SPA that serves all five languages from one
 * HTML file. Search engines that don't run JS (and the ones that do, but weakly)
 * then see a single language. This step takes the built `dist/index.html` and
 * writes a real, crawlable page per language at its own URL:
 *
 *   en → dist/index.html        (also the x-default)
 *   he → dist/he/index.html
 *   ar → dist/ar/index.html
 *   ru → dist/ru/index.html
 *   el → dist/el/index.html
 *
 * Each page carries the correct <html lang/dir>, translated <title> + meta,
 * self-referential canonical, a full hreflang set, and a block of translated
 * content inside #root so a crawler reads real localized text. The SPA still
 * boots and takes over on load (React replaces #root), so users are unaffected.
 *
 * Facts (address, phone, hours, cuisine) mirror the Restaurant JSON-LD in
 * index.html — no invented content.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '..', 'dist');
const ORIGIN = 'https://www.greeksouflaki.com';

// Language code → its own path segment (English lives at the root).
const LANGS = ['en', 'he', 'ar', 'ru', 'el'];
const PATH = { en: '/', he: '/he/', ar: '/ar/', ru: '/ru/', el: '/el/' };
const RTL = new Set(['he', 'ar']);

// Per-language content. Meta strings mirror SEO_METADATA in constants.ts; the
// body strings are the localized, crawlable copy injected into #root.
const C = {
  en: {
    title: 'Greek Souvlaki Kafr Yasif | סובלקי יווני כפר יאסיף - Authentic Greek Restaurant',
    description:
      'Authentic Greek souvlaki in Kafr Yasif. Fresh pita, gyros, skewers & more. Order now! Open Wed-Sat 13:00-01:00. Call 04-812-2980. Local Greek restaurant',
    keywords:
      'souvlaki, gyros, greek restaurant, greek food, greek pita, greek shawarma, kafr yasif, galilee restaurant, northern israel food, souvlaki in pita, gyros in pita',
    ogTitle: 'Greek Souvlaki Kafr Yasif | Authentic Greek Restaurant',
    ogDescription:
      'Best Greek souvlaki in Kafr Yasif! Fresh pita, juicy gyros, grilled skewers. Open Wed-Sat 13:00-01:00. Order now!',
    ogLocale: 'en_IL',
    h1: 'Greek Souvlaki in Kafr Yasif',
    intro:
      'Authentic Greek souvlaki, gyros and grilled skewers wrapped in fresh Greek pita — grilled to order in Kafr Yasif, in the Western Galilee.',
    menuHeading: 'On the menu',
    menu: [
      'Pita souvlaki with tzatziki, fresh vegetables and fries (from ₪30)',
      'Greek gyros in pita',
      'Grilled skewers over open fire',
      'Vegan souvlaki in pita (₪30)',
      'Gluten-free pita option (₪40)',
    ],
    visitHeading: 'Visit us',
    address: 'Route 70, Kafr Yasif, Western Galilee, Israel',
    hoursLabel: 'Hours',
    hours: 'Wednesday–Saturday, 13:00–01:00 (closed Sunday–Tuesday)',
    phoneLabel: 'Phone',
    order: 'Order on WhatsApp: 054-200-1235',
  },
  he: {
    title: 'סובלקי יווני כפר יאסיף | Greek Souvlaki Kfar Yasif - מסעדה יוונית אותנטית',
    description:
      'סובלקי יווני אותנטי בכפר יאסיף. פיתה טרה, גירוס, שישודים ועוד. הזמן עכשיו! פתוח רביעי-שבת 13:00-01:00. התקשרו 04-812-2980. מסעדה יוונית מקומית',
    keywords:
      'סובלקי, גירוס, מסעדה יוונית, אוכל יווני, פיתה יוונית, שווארמה יוונית, כפר יאסיף, מסעדה בגליל, אוכל בצפון, סובלקי בפיתה, גירוס בפיטה',
    ogTitle: 'סובלקי יווני כפר יאסיף | מסעדה יוונית אותנטית',
    ogDescription:
      'הכי טוב סובלקי יווני בכפר יאסיף! פיתה טרה, גירוס עסיסי, שישודים על האש. פתוח רביעי-שבת 13:00-01:00. הזמן עכשיו!',
    ogLocale: 'he_IL',
    h1: 'סובלקי יווני בכפר יאסיף',
    intro:
      'סובלקי, גירוס ושישודים על האש עטופים בפיתה יוונית טרייה — נצלים במקום בכפר יאסיף, בגליל המערבי.',
    menuHeading: 'מהתפריט',
    menu: [
      'סובלקי בפיתה עם צזיקי, ירקות טריים וצ׳יפס (החל מ-30 ₪)',
      'גירוס יווני בפיתה',
      'שישודים צלויים על האש',
      'סובלקי טבעוני בפיתה (30 ₪)',
      'אפשרות פיתה ללא גלוטן (40 ₪)',
    ],
    visitHeading: 'בואו לבקר',
    address: 'כביש 70, כפר יאסיף, הגליל המערבי, ישראל',
    hoursLabel: 'שעות פתיחה',
    hours: 'רביעי–שבת, 13:00–01:00 (סגור ראשון–שלישי)',
    phoneLabel: 'טלפון',
    order: 'הזמנה בוואטסאפ: 054-200-1235',
  },
  ar: {
    title: 'سوفلاكي يوناني كفر ياسيف | Greek Souvlaki Kafr Yasif - مطعم يوناني أصيل',
    description:
      'سوفلاكي يوناني أصيل في كفر ياسيف. خبز بيتا طازج، جيروس، أسياخ والمزيد. اطلب الآن! مفتوح الأربعاء-السبت 13:00-01:00. اتصل 04-812-2980. مطعم يوناني محلي',
    keywords:
      'سوفلاكي, جيروس, مطعم يوناني, طعام يوناني, خبز بيتا يوناني, شاورما يونانية, كفر ياسيف, مطعم في الجليل, طعام في الشمال, سوفلاكي في بيتا, جيروس في بيتا',
    ogTitle: 'سوفلاكي يوناني كفر ياسيف | مطعم يوناني أصيل',
    ogDescription:
      'أفضل سوفلاكي يوناني في كفر ياسيف! خبز بيتا طازج، جيروس طري، أسياخ مشوية. مفتوح الأربعاء-السبت 13:00-01:00. اطلب الآن!',
    ogLocale: 'ar_IL',
    h1: 'سوفلاكي يوناني في كفر ياسيف',
    intro:
      'سوفلاكي وجيروس وأسياخ مشوية على النار ملفوفة في خبز بيتا يوناني طازج — تُشوى عند الطلب في كفر ياسيف، في الجليل الغربي.',
    menuHeading: 'من القائمة',
    menu: [
      'سوفلاكي في بيتا مع تزاتزيكي وخضار طازجة وبطاطس (من 30 شيكل)',
      'جيروس يوناني في بيتا',
      'أسياخ مشوية على النار',
      'سوفلاكي نباتي في بيتا (30 شيكل)',
      'خيار بيتا خالٍ من الغلوتين (40 شيكل)',
    ],
    visitHeading: 'زورونا',
    address: 'الطريق 70، كفر ياسيف، الجليل الغربي، إسرائيل',
    hoursLabel: 'ساعات العمل',
    hours: 'الأربعاء–السبت، 13:00–01:00 (مغلق الأحد–الثلاثاء)',
    phoneLabel: 'الهاتف',
    order: 'اطلب عبر واتساب: 054-200-1235',
  },
  ru: {
    title: 'Греческий сувлаки Кафр Ясиф | Greek Souvlaki Kfar Yasif - Греческий ресторан',
    description:
      'Аутентичный греческий сувлаки в Кафр Ясиф. Свежая пита, гирос, шашлыки и многое другое. Закажите сейчас! Открыто ср-сб 13:00-01:00. Тел 04-812-2980. Греческий ресторан',
    keywords:
      'сувлаки, гирос, греческий ресторан, греческая кухня, греческая пита, греческая шаурма, Кафр Ясиф, ресторан в Галилее, еда на севере, сувлаки в пите, гирос в пите',
    ogTitle: 'Греческий сувлаки Кафр Ясиф | Аутентичный греческий ресторан',
    ogDescription:
      'Лучший греческий сувлаки в Кафр Ясиф! Свежая пита, сочный гирос, шашлыки на углях. Открыто ср-сб 13:00-01:00. Закажите сейчас!',
    ogLocale: 'ru_IL',
    h1: 'Греческий сувлаки в Кафр-Ясиф',
    intro:
      'Сувлаки, гирос и шашлыки на открытом огне в свежей греческой пите — готовятся на заказ в Кафр-Ясиф, в Западной Галилее.',
    menuHeading: 'В меню',
    menu: [
      'Сувлаки в пите с дзадзики, свежими овощами и картофелем фри (от ₪30)',
      'Греческий гирос в пите',
      'Шашлыки на открытом огне',
      'Веганский сувлаки в пите (₪30)',
      'Пита без глютена (₪40)',
    ],
    visitHeading: 'Как нас найти',
    address: 'Шоссе 70, Кафр-Ясиф, Западная Галилея, Израиль',
    hoursLabel: 'Часы работы',
    hours: 'Среда–суббота, 13:00–01:00 (воскресенье–вторник закрыто)',
    phoneLabel: 'Телефон',
    order: 'Заказ в WhatsApp: 054-200-1235',
  },
  el: {
    title: 'Ελληνικό σουβλάκι Κφαρ Γιασίφ | Greek Souvlaki Kfar Yasif - Ελληνικό εστιατόριο',
    description:
      'Αυθεντικό ελληνικό σουβλάκι στο Κφαρ Γιασίφ. Φρέσκια πίτα, γύρος, σουβλάκια και άλλα. Παραγγείλετε τώρα! Ανοιχτά Τετ-Σαβ 13:00-01:00. Τηλ 04-812-2980. Ελληνικό εστιατόριο',
    keywords:
      'σουβλάκι, γύρος, ελληνικό εστιατόριο, ελληνική κουζίνα, ελληνική πίτα, ελληνική σούβλα, Κφαρ Γιασίφ, εστιατόριο στη Γαλιλαία, φαγητό στον βορρά, σουβλάκι στην πίτα, γύρος στην πίτα',
    ogTitle: 'Ελληνικό σουβλάκι Κφαρ Γιασίφ | Αυθεντικό ελληνικό εστιατόριο',
    ogDescription:
      'Το καλύτερο ελληνικό σουβλάκι στο Κφαρ Γιασίφ! Φρέσκια πίτα, ζουμερός γύρος, σουβλάκια στη φωτιά. Ανοιχτά Τετ-Σαβ 13:00-01:00. Παραγγείλετε τώρα!',
    ogLocale: 'el_IL',
    h1: 'Ελληνικό σουβλάκι στο Κφαρ Γιασίφ',
    intro:
      'Σουβλάκι, γύρος και σουβλάκια στη φωτιά τυλιγμένα σε φρέσκια ελληνική πίτα — ψημένα με την παραγγελία στο Κφαρ Γιασίφ, στη Δυτική Γαλιλαία.',
    menuHeading: 'Στο μενού',
    menu: [
      'Σουβλάκι σε πίτα με τζατζίκι, φρέσκα λαχανικά και πατάτες (από ₪30)',
      'Ελληνικός γύρος σε πίτα',
      'Σουβλάκια στη φωτιά',
      'Vegan σουβλάκι σε πίτα (₪30)',
      'Επιλογή πίτας χωρίς γλουτένη (₪40)',
    ],
    visitHeading: 'Επισκεφθείτε μας',
    address: 'Οδός 70, Κφαρ Γιασίφ, Δυτική Γαλιλαία, Ισραήλ',
    hoursLabel: 'Ώρες',
    hours: 'Τετάρτη–Σάββατο, 13:00–01:00 (κλειστά Κυριακή–Τρίτη)',
    phoneLabel: 'Τηλέφωνο',
    order: 'Παραγγελία στο WhatsApp: 054-200-1235',
  },
};

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// hreflang block shared by every page (absolute URLs, self + all + x-default).
function hreflangs() {
  const links = LANGS.map(
    (l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${PATH[l]}" />`
  );
  links.push(`<link rel="alternate" hreflang="x-default" href="${ORIGIN}/" />`);
  return links.join('\n    ');
}

// Crawlable localized content injected into #root (React replaces it on mount).
function seoBlock(c) {
  const items = c.menu.map((m) => `<li>${esc(m)}</li>`).join('');
  return (
    `<div id="seo-prerender">` +
    `<h1>${esc(c.h1)}</h1>` +
    `<p>${esc(c.intro)}</p>` +
    `<h2>${esc(c.menuHeading)}</h2><ul>${items}</ul>` +
    `<h2>${esc(c.visitHeading)}</h2>` +
    `<p>${esc(c.address)}</p>` +
    `<p>${esc(c.hoursLabel)}: ${esc(c.hours)}</p>` +
    `<p>${esc(c.phoneLabel)}: 04-812-2980</p>` +
    `<p>${esc(c.order)}</p>` +
    `</div>`
  );
}

function buildPage(shell, lang) {
  const c = C[lang];
  const url = `${ORIGIN}${PATH[lang]}`;
  const dir = RTL.has(lang) ? 'rtl' : 'ltr';
  let html = shell;

  html = html.replace(/<html[^>]*>/, `<html lang="${lang}" dir="${dir}" xml:lang="${lang}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(c.title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/?>/,
    `<meta name="description" content="${esc(c.description)}" />`
  );
  html = html.replace(
    /<meta\s+name="keywords"[\s\S]*?\/?>/,
    `<meta name="keywords" content="${esc(c.keywords)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"[\s\S]*?\/?>/,
    `<meta property="og:title" content="${esc(c.ogTitle)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/?>/,
    `<meta property="og:description" content="${esc(c.ogDescription)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"[\s\S]*?\/?>/,
    `<meta property="og:url" content="${url}" />`
  );
  html = html.replace(
    /<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:locale" content="${c.ogLocale}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"[\s\S]*?\/?>/,
    `<meta name="twitter:title" content="${esc(c.ogTitle)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"[\s\S]*?\/?>/,
    `<meta name="twitter:description" content="${esc(c.ogDescription)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:url"[\s\S]*?\/?>/,
    `<meta name="twitter:url" content="${url}" />`
  );
  html = html.replace(
    /<link\s+rel="canonical"[\s\S]*?\/?>/,
    `<link rel="canonical" href="${url}" />`
  );
  // Remove every existing hreflang alternate, then insert a fresh set after canonical.
  html = html.replace(/\s*<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>/g, '');
  html = html.replace(/(<link\s+rel="canonical"[^>]*>)/, `$1\n    ${hreflangs()}`);
  // Inject crawlable localized content into the empty mount node.
  html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${seoBlock(c)}</div>`);

  return html;
}

const shell = readFileSync(resolve(DIST, 'index.html'), 'utf8');

for (const lang of LANGS) {
  const page = buildPage(shell, lang);
  if (lang === 'en') {
    writeFileSync(resolve(DIST, 'index.html'), page);
  } else {
    mkdirSync(resolve(DIST, lang), { recursive: true });
    writeFileSync(resolve(DIST, lang, 'index.html'), page);
  }
  console.log(`prerendered ${PATH[lang]} → ${lang === 'en' ? 'index.html' : `${lang}/index.html`}`);
}

console.log('i18n prerender complete: 5 language pages written.');
