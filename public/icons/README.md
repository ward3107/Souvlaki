# PWA Icons Instructions

## Icons Required

You need to add these icon files to the `public/icons/` folder:

```
public/icons/
├── icon-192.png   (192x192 pixels)
├── icon-512.png   (512x512 pixels)
```

And in the `public/` folder:

```
public/
├── apple-touch-icon.png  (180x180 pixels)
```

## Quick Ways to Generate Icons

### Option 1: Use an Online Tool (Easiest)

1. Go to: https://realfavicongenerator.net/
2. Upload your logo or image
3. Download the generated icons
4. Copy `icon-192.png` and `icon-512.png` to `public/icons/`
5. Copy `apple-touch-icon.png` to `public/`

### Option 2: Use PWA Asset Generator

1. Go to: https://www.pwabuilder.com/imageGenerator
2. Upload your image
3. Download the icons
4. Place them in the correct folders

### Option 3: Manual with Image Editor

- Use Photoshop, GIMP, or Canva
- Create PNG images at exact sizes:
  - 192x192 pixels
  - 512x512 pixels
  - 180x180 pixels (for apple-touch-icon)

## For Now (Temporary)

The PWA will work without icons, but the app icon will be the browser default.
Add your custom icons as soon as possible for better branding!

## Icon Design Tips

- Use your restaurant logo
- Keep it simple (minimal details work better at small sizes)
- Use solid colors with good contrast
- Test on both light and dark backgrounds
- The icon should be recognizable even at small sizes
