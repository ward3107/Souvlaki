import { useEffect, useRef, useState } from 'react';
import { Globe, Menu as MenuIcon, Moon, Sun, X } from 'lucide-react';
import { Language, type TranslationKey } from '../../types';
import { t } from '../../utils/i18n';
import { scrollToSection } from '../../utils/scroll';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const NAV_LINKS: { id: string; labelKey: TranslationKey }[] = [
  { id: 'home', labelKey: 'nav_home' },
  { id: 'menu', labelKey: 'nav_menu' },
  { id: 'about', labelKey: 'nav_about' },
  { id: 'reviews', labelKey: 'nav_reviews' },
  { id: 'faq', labelKey: 'nav_faq' },
  { id: 'contact', labelKey: 'nav_contact' },
];

export default function Header({ lang, setLang, theme, setTheme }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const langButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isLangDropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    // Keyboard users need Escape to dismiss the dropdown and get focus back.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLangDropdownOpen(false);
        langButtonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLangDropdownOpen]);

  const handleNav = (id: string) => {
    setIsMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-black/5 dark:border-white/10 transition-colors duration-300">
      <div className="container mx-auto px-4 h-20 grid grid-cols-3 items-center">
        <button
          className="justify-self-start flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleNav('home')}
          aria-label="Go to home"
        >
          <img
            src="/favicon.png"
            alt="Greek Souvlaki Logo"
            className="w-14 h-14 rounded-full object-cover"
          />
          <span className="font-display text-xl font-semibold text-brand-blue-700 dark:text-brand-blue-100 hidden sm:block tracking-tight">
            Greek Souvlaki
          </span>
        </button>

        <nav className="hidden md:flex justify-self-center items-center gap-1 rtl:space-x-reverse">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className="nav-3d text-gray-600 dark:text-gray-300 hover:text-brand-blue-500 dark:hover:text-brand-blue-300 font-medium"
            >
              {t(lang, link.labelKey)}
            </button>
          ))}
        </nav>

        <div className="justify-self-end flex items-center gap-3">
          <div className="relative" ref={langDropdownRef}>
            <button
              ref={langButtonRef}
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
              aria-label="Select language"
              aria-expanded={isLangDropdownOpen}
              aria-haspopup="true"
            >
              <Globe className="w-5 h-5" aria-hidden="true" />
            </button>
            {isLangDropdownOpen && (
              <div className="absolute top-full end-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 py-2 z-50">
                {Object.values(Language).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      localStorage.setItem('language', l);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`block w-full text-start px-4 py-2 text-sm hover:bg-brand-blue-50 dark:hover:bg-slate-700 ${
                      lang === l
                        ? 'text-brand-blue-500 font-bold'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-yellow-500 dark:text-yellow-300"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Sun className="w-5 h-5" aria-hidden="true" />
            )}
          </button>

          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className="block w-full text-center py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 font-medium"
              >
                {t(lang, link.labelKey)}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
