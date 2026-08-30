import { LanguageCode } from '../types';
import { ALL_TRANSLATIONS } from './locales';

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = ALL_TRANSLATIONS;

export function getTranslation(key: string, language: LanguageCode | string = 'hi'): string {
  const langKey = (language as LanguageCode);
  const langDict = TRANSLATIONS[langKey] || TRANSLATIONS['hi'] || TRANSLATIONS['en'];
  if (langDict && langDict[key]) return langDict[key];
  if (TRANSLATIONS['hi'] && TRANSLATIONS['hi'][key]) return TRANSLATIONS['hi'][key];
  if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) return TRANSLATIONS['en'][key];
  return key;
}

export function useTranslation(language: LanguageCode | string = 'hi') {
  const langCode = (language as LanguageCode);
  return {
    t: (key: string, fallback?: string) => {
      const translated = getTranslation(key, langCode);
      return translated !== key ? translated : (fallback || key);
    },
    language: langCode,
  };
}
