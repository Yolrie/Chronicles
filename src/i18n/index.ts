// src/i18n/index.ts

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Locale, TRANSLATIONS } from './translations';

const STORAGE_KEY = 'chronicles_locale';

interface I18nState {
  locale: Locale;
  t: typeof TRANSLATIONS['fr'];
  setLocale: (locale: Locale) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useI18n = create<I18nState>((set) => ({
  locale: 'fr',
  t: TRANSLATIONS['fr'],

  setLocale: async (locale: Locale) => {
    set({ locale, t: TRANSLATIONS[locale] });
    await AsyncStorage.setItem(STORAGE_KEY, locale);
  },

  initialize: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored && TRANSLATIONS[stored]) {
        set({ locale: stored, t: TRANSLATIONS[stored] });
      }
    } catch {
      // keep default
    }
  },
}));
