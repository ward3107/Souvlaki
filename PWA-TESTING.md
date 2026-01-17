# 🧪 PWA Testing Checklist

## Branch: `feature/pwa`
**Preview URL:** Check Vercel dashboard for deployment link

---

## ✅ Desktop Testing (Chrome/Edge)

### 1. DevTools - Application Tab
Open DevTools (F12) → Application tab:

**Manifest:**
- [ ] Manifest detected and parsed correctly
- [ ] Name: "Greek Souvlaki"
- [ ] Short name: "Souvlaki"
- [ ] Theme color: #1e3a8a
- [ ] Display: standalone
- [ ] Start URL: /
- [ ] Icons present (192x192, 512x512)

**Service Workers:**
- [ ] Service worker active and running
- [ ] Status: "activated" or "activated and running"
- [ ] Check "Update on reload" for testing

**Cache Storage:**
- [ ] Cache storage populated
- [ ] Named caches present (workbox-precache, images-cache, google-fonts-cache)
- [ ] Assets cached (JS, CSS, images)

### 2. Lighthouse PWA Audit
Run Lighthouse (F12 → Lighthouse → Progressive Web App):

**Must Pass:**
- [ ] Manifest exists
- [ ] Has install prompt (desktop)
- [ ] Registers service worker
- [ ] Responds with 200 when offline
- [ ] Contains start_url
- [ ] Has theme color
- [ ] Has icons (at least 192x192)
- [ ] Sets theme-color

**Target Score: 90+**

### 3. Install Test (Desktop Chrome)
- [ ] Click install icon in address bar (⊕ or install icon)
- [ ] App installs to desktop/apps
- [ ] Opens in standalone window (no browser bar)
- [ ] Works like native app

---

## ✅ Android Testing (Chrome)

### 1. Install Test
- [ ] Open site in Chrome
- [ ] Look for "Add to Home Screen" popup or menu item
- [ ] Tap "Install" or "Add to Home Screen"
- [ ] App icon appears on home screen
- [ ] Tap icon to open - should open in fullscreen
- [ ] No browser URL bar visible

### 2. Offline Test
- [ ] Open app once while online (caches assets)
- [ ] Turn on airplane mode
- [ ] Open app from home screen
- [ ] App should load (show cached content)
- [ ] Menu, images, and styling should be present
- [ ] Shows "offline ready" or works normally

### 3. Update Test
- [ ] Close app
- [ ] Wait for new deployment (or manually trigger)
- [ ] Open app again
- [ ] Should see update prompt (in your language)
- [ ] Confirming refreshes the app

---

## ✅ iOS Testing (Safari)

### 1. Add to Home Screen
- [ ] Open site in Safari
- [ ] Tap Share button (square with arrow)
- [ ] Scroll down and tap "Add to Home Screen"
- [ ] Verify app name and icon are correct
- [ ] Tap "Add"
- [ ] App icon appears on home screen

### 2. Launch Test
- [ ] Tap app icon from home screen
- [ ] Should open in fullscreen (no Safari UI)
- [ ] Should not show URL bar
- [ ] Should work like native app

### 3. Offline Test
- [ ] Open app once while online
- [ ] Turn on airplane mode
- [ ] Open app from home screen
- [ ] Should load cached content
- [ ] May show offline message for dynamic content

**Note:** iOS doesn't support full service worker features like Android.
The app should still work offline but with some limitations.

---

## ✅ Network Test

### 1. Fast 3G Simulation
- [ ] Open Chrome DevTools → Network tab
- [ ] Throttle to "Fast 3G"
- [ ] Reload page
- [ ] App should load reasonably fast

### 2. Offline Simulation
- [ ] Open Chrome DevTools → Network tab
- [ ] Select "Offline"
- [ ] Reload page
- [ ] App should load from cache
- [ ] Check for "offline ready" console message

---

## ✅ Multi-Language Test

Test update prompt in each language:

- [ ] Hebrew (HE): "גרסה חדשה זמינה! לרענן עכשיו?"
- [ ] English (EN): "New version available! Refresh now?"
- [ ] Russian (RU): "Новая версия доступна! Обновить?"
- [ ] Spanish (AR): "Nueva versión disponible! ¿Actualizar?"
- [ ] Greek (EL): Check translation

---

## ✅ Service Worker Console Messages

Open console (F12) and look for:

**On first load:**
```
✅ Service Worker registered: ServiceWorkerRegistration
✅ PWA ready to work offline
```

**On update available:**
```
Update found! New content is downloading.
```

**After update:**
Update prompt appears with confirmation dialog

---

## 🚨 Common Issues & Fixes

### Issue 1: "Update on reload" doesn't work
**Fix:** Unregister service worker, clear cache, reload:
```
DevTools → Application → Service Workers → Unregister
DevTools → Application → Clear storage → Clear site data
```

### Issue 2: Offline doesn't work
**Fix:** Check service worker is active:
```
DevTools → Application → Service Workers
Status should be "activated"
```

### Issue 3: Install prompt doesn't appear
**Fix:** Site must be:
- Served over HTTPS
- Accessed at least twice (with 2+ minutes between)
- Not already installed

### Issue 4: Large images not cached
**Fix:** Already configured - 50MB limit in vite.config.ts

### Issue 5: Icons not showing
**Fix:** Add icons to public/icons/ folder:
- icon-192.png (192x192)
- icon-512.png (512x512)
- public/apple-touch-icon.png (180x180)

---

## 📊 Performance Metrics

Check in Lighthouse:

| Metric | Target | Actual |
|--------|--------|--------|
| Performance | 90+ | ___ |
| PWA | 90+ | ___ |
| Accessibility | 90+ | ___ |
| Best Practices | 90+ | ___ |
| SEO | 90+ | ___ |

---

## ✅ Pre-Merge Checklist

Before merging to main:

- [ ] Desktop Chrome: Install works
- [ ] Desktop Chrome: Offline works
- [ ] Desktop Chrome: Lighthouse PWA audit passes
- [ ] Android Chrome: Install to home screen works
- [ ] Android Chrome: Offline works
- [ ] iOS Safari: Add to Home Screen works
- [ ] iOS Safari: Launches in fullscreen
- [ ] All languages work
- [ ] Update prompt appears (test by deploying new version)
- [ ] Console shows no errors
- [ ] Cache storage populated

---

## 🚀 Deployment Steps

After testing is complete:

1. **Merge Pull Request:**
   ```
   https://github.com/ward3107/Souvlaki/pull/new/feature/pwa
   ```

2. **Wait for Vercel deployment**
   - Check Vercel dashboard
   - Verify production deployment succeeds

3. **Test on Production:**
   - https://greek-souvlaki-website.vercel.app
   - Run all tests again

4. **Announce to users (optional):**
   - "Install our app on your phone for faster access!"
   - Instructions for Android and iOS

---

## 📱 User Instructions (For Your Customers)

### Android Users:
1. Open our website in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"
4. Our app icon will appear on your home screen!

### iPhone/iPad Users:
1. Open our website in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"
5. Our app icon will appear on your home screen!

---

## 🔧 Technical Details

**Service Worker:** `/sw.js`
**Manifest:** `/manifest.webmanifest`
**Precached Assets:** 103 entries (~58 MB)
**Cache Strategy:**
- HTML/JS/CSS: Precache (versioned)
- Images: CacheFirst (30 days)
- Fonts: StaleWhileRevalidate (1 year)

**Update Interval:** Every 60 minutes

---

## 📞 If Something Goes Wrong

**Emergency Rollback:**
```bash
git revert HEAD
git push origin main
```

**Force Update on User Devices:**
Deploy a new version - service worker will detect and prompt users

---

<div align="center">

**✅ When all tests pass, merge to main!**

**Your PWA is ready for production!**

</div>
