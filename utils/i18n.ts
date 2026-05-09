import { TRANSLATIONS } from '../constants';
import { Language, type TranslationKey } from '../types';

export const t = (lang: Language, key: TranslationKey): string => TRANSLATIONS[lang][key] || key;

export const tx = (
  lang: Language,
  he: string,
  en: string,
  ar: string,
  ru?: string,
  el?: string
): string => {
  if (lang === Language.HE) return he;
  if (lang === Language.AR) return ar;
  if (lang === Language.RU && ru) return ru;
  if (lang === Language.EL && el) return el;
  return en;
};

export const isRtlLang = (lang: Language): boolean => lang === Language.HE || lang === Language.AR;
