import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LanguageCode } from '../types';
import { getTranslation } from '../services/translations';

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLanguage?: LanguageCode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLanguage,
}) => {
  // Check if an ancestor provider is already mounted
  const parentContext = useContext(LanguageContext);
  if (parentContext) {
    return <>{children}</>;
  }

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (initialLanguage) return initialLanguage;
    const stored = localStorage.getItem('shilpsetu_lang') as LanguageCode;
    return stored || 'hi';
  });

  const setLanguage = useCallback((newLang: LanguageCode) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('shilpsetu_lang', newLang);
    } catch {
      // ignore storage errors
    }
  }, []);

  // Listen for storage changes across tabs/windows or external events
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'shilpsetu_lang' && e.newValue) {
        setLanguageState(e.newValue as LanguageCode);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const translated = getTranslation(key, language);
      return translated !== key ? translated : (fallback !== undefined ? fallback : key);
    },
    [language]
  );

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    const fallbackLang: LanguageCode = (localStorage.getItem('shilpsetu_lang') as LanguageCode) || 'hi';
    return {
      language: fallbackLang,
      setLanguage: () => {},
      t: (key: string, fallback?: string) => {
        const translated = getTranslation(key, fallbackLang);
        return translated !== key ? translated : (fallback !== undefined ? fallback : key);
      },
    };
  }
  return context;
}

export function useTranslation(overrideLang?: LanguageCode | string) {
  const context = useLanguage();
  const effectiveLanguage = (overrideLang || context.language || 'hi') as LanguageCode;

  const t = useCallback(
    (key: string, fallback?: string): string => {
      if (!overrideLang) {
        return context.t(key, fallback);
      }
      const translated = getTranslation(key, effectiveLanguage);
      return translated !== key ? translated : (fallback !== undefined ? fallback : key);
    },
    [context, overrideLang, effectiveLanguage]
  );

  return {
    t,
    language: effectiveLanguage,
    setLanguage: context.setLanguage,
  };
}
