'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import en from './dictionaries/en.json';
import ar from './dictionaries/ar.json';

type Dictionary = typeof en;

const dictionaries: Record<string, Dictionary> = {
  en,
  ar: ar as unknown as Dictionary,
};

interface TranslationContextType {
  locale: 'en' | 'ar';
  t: (path: string, variables?: Record<string, string | number>) => string;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider = ({
  locale,
  children,
}: {
  locale: 'en' | 'ar';
  children: ReactNode;
}) => {
  const dictionary = dictionaries[locale] || en;

  const t = (path: string, variables?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let value: unknown = dictionary;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return path; // Fallback to path if not found
      }
    }

    if (typeof value !== 'string') {
      return path;
    }

    let result = value;
    if (variables) {
      Object.entries(variables).forEach(([key, val]) => {
        result = result.replace(new RegExp(`{${key}}`, 'g'), String(val));
      });
    }

    return result;
  };

  return (
    <TranslationContext.Provider value={{ locale, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
