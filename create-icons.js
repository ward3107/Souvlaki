const fs = require('fs');
const path = require('path');

// Simple SVG icons as placeholders
const createIconSVG = (size, color = '#1e3a8a') => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${color}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">Σ</text>
</svg>`;
};

// Create icons directory
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Also create in dist for immediate testing
const distIconsDir = path.join(__dirname, 'dist', 'icons');
if (!fs.existsSync(distIconsDir)) {
  fs.mkdirSync(distIconsDir, { recursive: true });
}

// Create icons
const sizes = [192, 512];
sizes.forEach((size) => {
  const svg = createIconSVG(size);

  // Save to public/icons
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), svg);
  console.log(`✅ Created public/icons/icon-${size}.png (SVG placeholder)`);

  // Save to dist/icons for immediate testing
  fs.writeFileSync(path.join(distIconsDir, `icon-${size}.png`), svg);
  console.log(`✅ Created dist/icons/icon-${size}.png (SVG placeholder)`);
});

// Create apple-touch-icon
const appleIconSVG = createIconSVG(180, '#1e3a8a');
fs.writeFileSync(path.join(__dirname, 'public', 'apple-touch-icon.png'), appleIconSVG);
fs.writeFileSync(path.join(__dirname, 'dist', 'apple-touch-icon.png'), appleIconSVG);
console.log('✅ Created apple-touch-icon.png (180x180)');

console.log('\n✅ All placeholder icons created!');
console.log(
  '⚠️  Note: These are SVG placeholders. For production, convert to real PNG images using:'
);
console.log('   - https://realfavicongenerator.net/');
console.log('   - https://www.pwabuilder.com/imageGenerator');
