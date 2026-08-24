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
  RotateCcw,
  X,
} from 'lucide-react';

interface AccessibilityWidgetProps {
  language: string;
}

interface FeatureButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const FeatureButton: React.FC<FeatureButtonProps> = ({ active, onClick, icon: Icon, label }) => (
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

  // Apply Classes to Body/HTML
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.style.fontSize = `${fontSize}%`;
    html.classList.toggle('high-contrast', features.contrast);
    body.classList.toggle('highlight-links', features.highlightLinks);
    body.classList.toggle('readable-font', features.readableFont);
    body.classList.toggle('stop-animations', features.stopAnimations);
    body.classList.toggle('big-cursor', features.bigCursor);
    html.classList.toggle('grayscale-mode', features.grayscale);
    html.classList.toggle('invert-mode', features.invert);
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

  // Close the panel on Escape (collapses back to the slim tab).
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const adjustFontSize = (delta: number) => {
    const newSize = Math.min(Math.max(fontSize + delta, 90), 150);
    setFontSize(newSize);
  };

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
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

  return (
    <>
      {/* Slim, always-present edge tab. An accessibility control must stay
          reachable (IS 5568) — it collapses to this tab, never disappears. */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-1/2 -translate-y-1/2 z-[70] w-8 h-14 bg-brand-blue-500 hover:bg-brand-blue-600 text-white flex items-center justify-center shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${
          isRtl ? 'right-0 rounded-l-xl' : 'left-0 rounded-r-xl'
        } ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label="Open accessibility menu"
        aria-expanded={isOpen}
      >
        <Accessibility className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Full panel */}
      {isOpen && (
        <div
          className={`fixed top-1/2 -translate-y-1/2 z-[70] w-[calc(100vw-1rem)] max-w-xs sm:w-80 sm:max-w-none bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[85vh] overflow-y-auto scrollbar-thin ${
            isRtl ? 'right-2 sm:right-4' : 'left-2 sm:left-4'
          }`}
          role="dialog"
          aria-label="Accessibility settings"
        >
          <div className="flex justify-between items-center border-b pb-2 dark:border-slate-600 sticky top-0 bg-white dark:bg-slate-800 z-10">
            <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
              <Accessibility className="w-5 h-5" aria-hidden="true" />
              Accessibility
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={reset}
                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded"
                aria-label="Reset all accessibility settings"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                Reset
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
                aria-label="Close accessibility menu"
                title="Close"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium dark:text-gray-300">Text Size: {fontSize}%</p>
            <div className="flex gap-2">
              <button
                onClick={() => adjustFontSize(-10)}
                className="flex-1 bg-gray-100 dark:bg-slate-700 p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 font-bold text-lg"
                aria-label="Decrease text size"
              >
                A-
              </button>
              <button
                onClick={() => adjustFontSize(10)}
                className="flex-1 bg-gray-100 dark:bg-slate-700 p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 font-bold text-lg"
                aria-label="Increase text size"
              >
                A+
              </button>
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
    </>
  );
};

export default AccessibilityWidget;
