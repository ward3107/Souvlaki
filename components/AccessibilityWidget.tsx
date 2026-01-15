import React, { useState, useEffect } from 'react';
import { 
  Accessibility, 
  Type, 
  Pause, 
  MousePointer2, 
  Palette, 
  Eye, 
  ScanLine, 
  Contrast,
  Link,
  RotateCcw
} from 'lucide-react';

interface AccessibilityWidgetProps {
  language: string;
}

const AccessibilityWidget: React.FC<AccessibilityWidgetProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  
  // Feature States
  const [features, setFeatures] = useState({
    contrast: false,
    highlightLinks: false,
    readableFont: false,
    stopAnimations: false,
    bigCursor: false,
    grayscale: false,
    invert: false,
    readingGuide: false,
  });

  const toggleOpen = () => setIsOpen(!isOpen);

  // Apply Classes to Body/HTML
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Font Size
    html.style.fontSize = `${fontSize}%`;

    // Contrast
    html.classList.toggle('high-contrast', features.contrast);

    // Highlight Links
    body.classList.toggle('highlight-links', features.highlightLinks);

    // Readable Font
    body.classList.toggle('readable-font', features.readableFont);

    // Stop Animations
    body.classList.toggle('stop-animations', features.stopAnimations);

    // Big Cursor
    body.classList.toggle('big-cursor', features.bigCursor);

    // Grayscale
    html.classList.toggle('grayscale-mode', features.grayscale);

    // Invert Colors
    html.classList.toggle('invert-mode', features.invert);

    // Reading Guide
    body.classList.toggle('reading-guide-active', features.readingGuide);

  }, [fontSize, features]);

  // Reading Guide Logic
  useEffect(() => {
    const guide = document.getElementById('reading-guide');
    if (!guide) return;

    if (features.readingGuide) {
      const moveGuide = (e: MouseEvent) => {
        guide.style.top = `${e.clientY}px`;
      };
      window.addEventListener('mousemove', moveGuide);
      return () => window.removeEventListener('mousemove', moveGuide);
    }
  }, [features.readingGuide]);

  const adjustFontSize = (delta: number) => {
    const newSize = Math.min(Math.max(fontSize + delta, 90), 150);
    setFontSize(newSize);
  };

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const reset = () => {
    setFontSize(100);
    setFeatures({
      contrast: false,
      highlightLinks: false,
      readableFont: false,
      stopAnimations: false,
      bigCursor: false,
      grayscale: false,
      invert: false,
      readingGuide: false,
    });
  };

  const isRtl = language === 'he' || language === 'ar';

  const FeatureButton = ({ 
    active, 
    onClick, 
    icon: Icon, 
    label 
  }: { 
    active: boolean; 
    onClick: () => void; 
    icon: React.ElementType; 
    label: string; 
  }) => (
    <button 
      onClick={onClick} 
      className={`w-full p-2 rounded-lg flex items-center gap-3 transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium">{label}</span>
      {active && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
    </button>
  );

  return (
    <div className={`fixed bottom-24 ${isRtl ? 'right-4' : 'left-4'} z-50`}>
      <button
        onClick={toggleOpen}
        className="w-12 h-12 bg-white text-black rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 mix-blend-difference z-50"
        aria-label="Accessibility Menu"
      >
        <Accessibility className="w-7 h-7" />
      </button>

      {isOpen && (
        <div className={`absolute bottom-16 ${isRtl ? 'right-0' : 'left-0'} w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 p-4 space-y-4 max-h-[80vh] overflow-y-auto scrollbar-thin`}>
          <div className="flex justify-between items-center border-b pb-2 dark:border-slate-600 sticky top-0 bg-white dark:bg-slate-800 z-10">
            <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
              <Accessibility className="w-5 h-5" />
              Accessibility
            </h3>
            <button 
              onClick={reset} 
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 px-2 py-1 rounded"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium dark:text-gray-300">Text Size: {fontSize}%</p>
            <div className="flex gap-2">
              <button onClick={() => adjustFontSize(-10)} className="flex-1 bg-gray-100 dark:bg-slate-700 p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 font-bold text-lg">A-</button>
              <button onClick={() => adjustFontSize(10)} className="flex-1 bg-gray-100 dark:bg-slate-700 p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 font-bold text-lg">A+</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <FeatureButton 
              active={features.readableFont} 
              onClick={() => toggleFeature('readableFont')} 
              icon={Type} 
              label="Readable Font" 
            />
            <FeatureButton 
              active={features.highlightLinks} 
              onClick={() => toggleFeature('highlightLinks')} 
              icon={Link} 
              label="Highlight Links" 
            />
             <FeatureButton 
              active={features.contrast} 
              onClick={() => toggleFeature('contrast')} 
              icon={Contrast} 
              label="High Contrast" 
            />
            <FeatureButton 
              active={features.grayscale} 
              onClick={() => toggleFeature('grayscale')} 
              icon={Palette} 
              label="Grayscale" 
            />
            <FeatureButton 
              active={features.invert} 
              onClick={() => toggleFeature('invert')} 
              icon={Eye} 
              label="Invert Colors" 
            />
            <FeatureButton 
              active={features.bigCursor} 
              onClick={() => toggleFeature('bigCursor')} 
              icon={MousePointer2} 
              label="Big Cursor" 
            />
            <FeatureButton 
              active={features.readingGuide} 
              onClick={() => toggleFeature('readingGuide')} 
              icon={ScanLine} 
              label="Reading Guide" 
            />
            <FeatureButton 
              active={features.stopAnimations} 
              onClick={() => toggleFeature('stopAnimations')} 
              icon={Pause} 
              label="Stop Animation" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityWidget;