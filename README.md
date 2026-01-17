<div align="center">

  <!-- Logo/Title -->
  <h1 align="center">
    <img src="https://ward3107.github.io/GREEK_SOVLAKI_WEBSITE/gallery/hero-bg-1280w.webp" alt="Greek Souvlaki" width="1200" height="400">
  </h1>

  # 🇬🇷 Greek Souvlaki Kfar Yasif

  **A modern, high-performance multi-language responsive website for an authentic Greek restaurant in Kfar Yasif, Israel**

  [![Live Demo](https://img.shields.io/badge/🚀-Live_Demo-success?style=for-the-badge&logo=vercel&logoColor=white)](https://greek-souvlaki-website-ixley74ef-wassems-projects-ab3ab6ba.vercel.app/)
  [![GitHub Stars](https://img.shields.io/github/stars/ward3107/Souvlaki?style=for-the-badge&logo=github&color=yellow)](https://github.com/ward3107/Souvlaki/stargazers)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

  <!-- Tech Stack Badges -->
  [![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

  <!-- Performance Badges -->
  [![Performance](https://img.shields.io/badge/⚡-Performance-Excellent-success?style=for-the-badge)](#performance)
  [![Mobile Friendly](https://img.shields.io/badge/📱-Mobile_Friendly-4CAF50?style=for-the-badge)](https://search.google.com/test/mobile-friendly)
  [![SEO](https://img.shields.io/badge/🔍-SEO_Optimized-4CAF50?style=for-the-badge)](#seo-optimization)
  [![Accessibility](https://img-shields.io/badge/♿-WCAG_2.1_AA-4CAF50?style=for-the-badge)](#accessibility)

  <!-- Language Links -->
  [English](#english) | [עברית](#hebrew) | [العربية](#arabic) | [Русский](#russian) | [Ελληνικά](#greek)

  <!-- Quick Links -->
  [📸 Screenshots](#screenshots) • [✨ Features](#features) • [🚀 Getting Started](#getting-started) • [📖 Documentation](#documentation)

</div>

---

## 📸 Screenshots

### Desktop View
<table>
  <tr>
    <td align="center"><img src="https://ward3107.github.io/GREEK_SOVLAKI_WEBSITE/gallery/hero-bg-1280w.webp" width="400" alt="Desktop Hero Section"></td>
    <td align="center"><img src="https://ward3107.github.io/GREEK_SOVLAKI_WEBSITE/gallery/hero-bg-1280w.webp" width="400" alt="Desktop Menu"></td>
  </tr>
  <tr>
    <td align="center">Hero Section</td>
    <td align="center">Interactive Menu</td>
  </tr>
</table>

### Mobile View
<table>
  <tr>
    <td align="center"><img src="https://ward3107.github.io/GREEK_SOVLAKI_WEBSITE/gallery/hero-bg-640w.webp" width="200" alt="Mobile View"></td>
  </tr>
  <tr>
    <td align="center">Responsive Mobile Design</td>
  </tr>
</table>

---

## ✨ Features

### 🌐 Multi-Language Support
- **5 Languages**: Hebrew, Arabic, Russian, Greek, English
- **RTL Support**: Full right-to-left layout for Hebrew and Arabic
- **Dynamic Translations**: Instant language switching
- **Localized SEO**: Separate sitemaps for each language

### 🎨 Modern UI/UX
| Feature | Description |
|---------|-------------|
| **3D Tilt Effects** | Interactive menu cards with 3D perspective (desktop & mobile) |
| **Dark Mode** | Automatic theme switching based on system preferences |
| **Smooth Animations** | Scroll-reveal effects with intersection observers |
| **Parallax Backgrounds** | Beautiful parallax scrolling on desktop |
| **Responsive Design** | Optimized for desktop, tablet, and mobile devices |

### 🚀 Performance Optimizations
- ⚡ **Code Splitting**: Manual chunks for better caching (React vendor: 60KB, Icons: 4KB, App: 71KB)
- 🖼️ **Image Optimization**: 76 WebP images with responsive sizes
- 📦 **Resource Preloading**: DNS prefetch, preconnect, and module preloads
- 🎯 **Critical CSS**: Inlined to prevent FOUC (Flash of Unstyled Content)
- 🌐 **Font Loading**: `display: optional` to prevent CLS

### 🔍 SEO & Accessibility
- **Schema.org**: JSON-LD structured data for restaurants
- **Open Graph**: Social media sharing optimization
- **Sitemaps**: Multi-language sitemap generation
- **WCAG 2.1 AA**: Full accessibility compliance
- **ARIA Labels**: Screen reader friendly markup

### 📱 Mobile Optimizations
- **Touch Events**: 3D tilt effects with touch handling
- **Smooth Scrolling**: No horizontal movement issues
- **Large Tap Targets**: Minimum 48x48px for buttons
- **Responsive Images**: Adaptive image sizes

### 🛡️ Legal & Privacy
- **Cookie Consent**: GDPR-compliant cookie banner
- **Legal Documents**: Privacy Policy, Terms of Service, Accessibility Statement
- **Data Protection**: User privacy controls

---

## 📊 Performance Metrics

| Metric | Value | Status |
|--------|-------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 🟢 Good |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 🟢 Good |
| **FCP** (First Contentful Paint) | < 1.8s | 🟢 Good |
| **TBT** (Total Blocking Time) | < 200ms | 🟢 Good |
| **Bundle Size** | ~135 KB (gzipped) | 🟢 Excellent |

### Optimization Techniques
```bash
# Build output sizes
react-vendor.js   193 KB → 60 KB gzipped
icons.js          16 KB → 4 KB gzipped
index.js         245 KB → 71 KB gzipped
styles.css        61 KB → 10 KB gzipped
─────────────────────────────────────
Total:           515 KB → 145 KB gzipped
```

---

## 🛠️ Technologies Used

### Frontend Framework
- **[React 19.2.3](https://react.dev/)** - UI library with latest features
- **[TypeScript 5.8.2](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite 6.2.0](https://vitejs.dev/)** - Lightning-fast build tool

### Styling & UI
- **[Tailwind CSS 3.4.19](https://tailwindcss.com/)** - Utility-first CSS
- **[PostCSS 8.5.6](https://postcss.org/)** - CSS transformations
- **[Lucide React 0.562.0](https://lucide.dev/)** - Beautiful icon library

### Development Tools
- **ESBuild** - Fast JavaScript bundler
- **Autoprefixer** - CSS vendor prefixes
- **React Markdown** - Markdown rendering

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

```bash
# Check versions
node --version  # v18.0.0+
npm --version   # v9.0.0+
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ward3107/Souvlaki.git
cd Souvlaki

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the website.

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` directory.

---

## 📖 Documentation

<details>
<summary><b>📂 Project Structure</b></summary>

```
Souvlaki/
├── 📁 public/                    # Static assets
│   ├── 📁 gallery/               # Optimized images (WebP, AVIF)
│   ├── 📁 legal/                 # Legal document markdown files
│   ├── manifest.json            # Web app manifest
│   ├── robots.txt               # SEO robots file
│   ├── sitemap*.xml             # Multi-language sitemaps
│   └── favicon*.png             # Favicon files
├── 📁 components/                # React components
│   ├── AccessibilityWidget.tsx  # ♿ Accessibility controls
│   ├── CookieBanner.tsx         # 🍪 Cookie consent
│   ├── LegalDocument.tsx        # ⚖️ Legal doc viewer
│   ├── Menu.tsx                 # 📋 Menu component
│   └── OpeningHours.tsx         # 🕐 Hours display
├── 📄 App.tsx                    # Main application component
├── 📄 constants.ts               # Translations, menu items, FAQs
├── 📄 types.ts                   # TypeScript type definitions
├── 📄 vite.config.ts             # Vite configuration with plugins
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 vercel.json                # Vercel deployment config
└── 📄 package.json               # Dependencies and scripts
```

</details>

<details>
<summary><b>🌍 Adding a New Language</b></summary>

1. **Add language enum** in `types.ts`:
```typescript
export enum Language {
  HE = 'he',
  AR = 'ar',
  RU = 'ru',
  EL = 'el',
  EN = 'en',
  YOUR_LANG = 'code'  // Add your language code
}
```

2. **Add translations** in `constants.ts`:
```typescript
export const TRANSLATIONS: Record<Language, Partial<TranslationDict>> = {
  YOUR_LANG: {
    hero_title: 'Your translation',
    hero_subtitle: 'Subtitle translation',
    // ... add all translation keys
  }
}
```

3. **Update meta tags** in `index.html` for SEO

4. **Create sitemap** for the new language: `sitemap-YOUR_LANG.xml`

</details>

<details>
<summary><b>⚙️ Vite Configuration</b></summary>

The project uses custom Vite plugins:

**`injectPreloads()`** - Automatically adds preload hints
```typescript
function injectPreloads(): Plugin {
  return {
    name: 'inject-preloads',
    transformIndexHtml(html: string) {
      // Inject modulepreload for JS bundles
      // Inject preload for CSS bundles
    }
  };
}
```

**Code Splitting** - Manual chunks for caching:
```typescript
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-dom/client'],
  'icons': ['lucide-react']
}
```

</details>

<details>
<summary><b>🚢 Deployment</b></summary>

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
npx vercel --prod
```

### Other Platforms
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Push to `gh-pages` branch
- **AWS S3**: Upload `dist/` contents
- **Traditional hosting**: Upload via FTP

</details>

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make** your changes following code style guidelines
4. **Test** on multiple devices and browsers
5. **Commit** with clear messages
   ```bash
   git commit -m "feat: add new feature"
   ```
6. **Push** to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open** a Pull Request

### Commit Convention

| Type | Description |
|------|-------------|
| `feat:` | ✨ New feature |
| `fix:` | 🐛 Bug fix |
| `docs:` | 📚 Documentation changes |
| `style:` | 💄 Code style changes |
| `refactor:` | ♻️ Code refactoring |
| `perf:` | ⚡ Performance improvements |
| `test:` | ✅ Adding tests |
| `chore:` | 🔨 Maintenance tasks |

### Code Style Guidelines
- ✅ Use TypeScript for type safety
- ✅ Follow React best practices
- ✅ Use functional components with hooks
- ✅ Implement mobile-first responsive design
- ✅ Ensure WCAG 2.1 AA accessibility
- ✅ Optimize for performance

---

## 🗺️ Roadmap

### Completed ✅
- [x] Multi-language support (5 languages)
- [x] 3D tilt effects on menu cards
- [x] Mobile touch event handling
- [x] Performance optimization (code splitting, preloading)
- [x] SEO optimization (sitemaps, meta tags, schema)
- [x] Accessibility features (WCAG 2.1 AA)
- [x] Dark mode support
- [x] Cookie consent banner
- [x] Legal documents viewer

### Planned 📋
- [ ] PWA support (offline mode)
- [ ] Online ordering system
- [ ] Table reservation system
- [ ] Customer reviews integration
- [ ] Admin dashboard
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] SMS notifications

---

## ❓ FAQ

<details>
<summary><b>How do I change the restaurant information?</b></summary>

Update the constants in `constants.ts`:
- `SEO_METADATA` - Restaurant name, description, contact info
- `MENU_ITEMS` - Menu items, prices, descriptions
- `OPENING_HOURS` - Business hours
- `CONTACT_INFO` - Phone, WhatsApp, address
</details>

<details>
<summary><b>How do I add a new menu item?</b></summary>

Add to `MENU_ITEMS` array in `constants.ts`:
```typescript
{
  id: 'item-id',
  name: { he: 'שם', ar: 'اسم', ru: 'Имя', el: 'Όνομα', en: 'Name' },
  description: { he: 'תיאור', ar: 'وصف', ru: 'Описание', el: 'Περιγραφή', en: 'Description' },
  price: 99,
  category: 'category_key',
  image: '/gallery/image.webp'
}
```
</details>

<details>
<summary><b>Why are images not loading in production?</b></summary>

1. Ensure images are in `public/` folder
2. Check image paths are correct (case-sensitive)
3. Verify Vercel deployment includes `public/` folder
4. Clear browser cache
</details>

<details>
<summary><b>How do I fix RTL layout issues?</b></summary>

1. Check `dir="rtl"` attribute on `<html>` element
2. Verify CSS uses logical properties (e.g., `margin-inline-start`)
3. Test in actual RTL language (Hebrew/Arabic)
4. Check flex/grid direction properties
</details>

---

## 🔧 Troubleshooting

### Build Errors

**TypeScript errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Styles not applying:**
- Clear browser cache (Ctrl+Shift+R)
- Check `dist/assets/` for CSS files
- Verify Tailwind configuration

### Development Issues

**Port already in use:**
```bash
# Kill process on port 5173
npx kill-port 5173
# Or use different port
npm run dev -- --port 3000
```

**Hot reload not working:**
- Check Vite HMR configuration
- Clear browser cache
- Restart dev server

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Greek Souvlaki Kfar Yasif

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 📞 Contact

### Restaurant Information
| Detail | Information |
|--------|-------------|
| **Name** | Greek Souvlaki Kfar Yasif |
| **Location** | Route 70, Kafr Yasif, Northern District, Israel |
| **Phone** | +972-4-812-2980 |
| **WhatsApp** | +972-54-200-1235 |
| **Hours** | Wed-Sat: 13:00 - 01:00 |

### Social Media
- **Facebook**: [facebook.com/greeksouvlaki](https://www.facebook.com/greeksouvlaki)
- **Instagram**: [@greek.souvlakii](https://www.instagram.com/greek.souvlakii)

### Project Links
- **GitHub**: [github.com/ward3107/Souvlaki](https://github.com/ward3107/Souvlaki)
- **Live Demo**: [greek-souvlaki-website.vercel.app](https://greek-souvlaki-website-ixley74ef-wassems-projects-ab3ab6ba.vercel.app/)
- **Issues**: [GitHub Issues](https://github.com/ward3107/Souvlaki/issues)

---

## 🙏 Acknowledgments

- **Design**: Inspired by modern Greek restaurant aesthetics
- **Icons**: [Lucide Icons](https://lucide.dev/) - Beautiful icon library
- **Fonts**: Google Fonts (Heebo, Rubik)
- **Images**: Optimized using WebP and AVIF formats
- **Build Tools**: Vite, React, TypeScript communities

---

## ⭐ Star History

<a href="https://github.com/ward3107/Souvlaki/stargazers">
  <img src="https://api.star-history.com/svg?repos=ward3107/Souvlaki&type=Date" alt="Star History Chart">
</a>

---

<div align="center">

  ## 🍢 Built with passion for Greek cuisine 🇬🇷

  **⚡ Powered by React • TypeScript • Vite**

  **♿ Accessible • 🔍 SEO Optimized • 📱 Mobile Friendly**

  **Supporting local businesses in the Galilee region 🇮🇱**

  **Made with ❤️ in Kfar Yasif**

  [⬆ Back to Top](#-greek-souvlaki-kfar-yasif)

  <br>

  [![Stargazers](https://img.shields.io/github/stars/ward3107/Souvlaki?style=social)](https://github.com/ward3107/Souvlaki/stargazers)
  [![Watchers](https://img.shields.io/github/watchers/ward3107/Souvlaki?style=social)](https://github.com/ward3107/Souvlaki/watchers)
  [![Forks](https://img.shields.io/github/forks/ward3107/Souvlaki?style=social)](https://github.com/ward3107/Souvlaki/network/members)

</div>

---

# 🌐 Language Sections

---

# Hebrew - עברית

<div dir="rtl">

## תכונות
- **תמיכה ב-5 שפות**: עברית, ערבית, רוסית, יוונית, אנגלית
- **עיצוב רספונסיבי**: מותאם למחשב, טאבלט ונייד
- **אפקטי תלת-ממד**: כרטיסי תפריט אינטראקטיביים
- **מצב חשוך/בהיר**: החלפה אוטומטית על פי העדפות המערכת
- **נגישות**: פתרונות נגישות מובנים (WCAG 2.1 AA)

## התקנה
```bash
npm install
npm run dev
```

## יצירת קשר
- **טלפון**: 04-812-2980
- **וואטסאפ**: 054-200-1235
- **כתובת**: כביש 70, כפר יאסיף

</div>

---

# العربية - Arabic

<div dir="rtl">

## الميزات
- **دعم 5 لغات**: العبرية، العربية، الروسية، اليونانية، الإنجليزية
- **تصميم متجاوب**: متوافق مع الكمبيوتر والتابلت والجوال
- **تأثيرات ثلاثية الأبعاد**: بطاقات القائمة التفاعلية
- **الوضع الداكن**: تبديل تلقائي حسب تفضيلات النظام
- **إمكانية الوصول**: حلول إمكانية الوصول المدمجة (WCAG 2.1 AA)

## التثبيت
```bash
npm install
npm run dev
```

## للتواصل
- **هاتف**: 04-812-2980
- **واتساب**: 054-200-1235
- **العنوان**: طريق 70، كفر ياسيف

</div>

---

# Русский - Russian

## Особенности
- **Поддержка 5 языков**: иврит, арабский, русский, греческий, английский
- **Адаптивный дизайн**: оптимизирован для ПК, планшета и мобильных устройств
- **3D эффекты**: интерактивные карточки меню
- **Темная тема**: автоматическое переключение
- **Доступность**: встроенные решения доступности (WCAG 2.1 AA)

## Установка
```bash
npm install
npm run dev
```

## Контакты
- **Телефон**: 04-812-2980
- **WhatsApp**: 054-200-1235
- **Адрес**: Трасса 70, Кафр Ясиф

---

# Ελληνικά - Greek

## Χαρακτηριστικά
- **Υποστήριξη 5 γλωσσών**: Εβραϊκά, Αραβικά, Ρωσικά, Ελληνικά, Αγγλικά
- **Ανταποκρυστικός σχεδιασμός**: βελτιστοποιημένο για υπολογιστή, ταμπλέτα και κινητό
- **3D εφέ**: Διαδραστικές κάρτες μενού
- **Σκοτεινή λειτουργία**: αυτόματη εναλλαγή
- **Προσβασιμότητα**: ενσωματωμένες λύσεις προσβασιμότητας (WCAG 2.1 AA)

## Εγκατάσταση
```bash
npm install
npm run dev
```

## Επικοινωνία
- **Τηλέφωνο**: 04-812-2980
- **WhatsApp**: 054-200-1235
- **Διεύθυνση**: Λεωφόρος 70, Καρ Γιουσίφ

---

<div align="center">

  **[⬆ Back to Top](#-greek-souvlaki-kfar-yasif)**

</div>
