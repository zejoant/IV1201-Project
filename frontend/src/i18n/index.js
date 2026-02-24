import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import sv from './sv.json';

/**
 * i18n configuration for the application.
 *
 * Initializes i18next with English and Swedish translations
 * and restores the user's preferred language from localStorage.
 *
 * Translation files:
 *  - ./en.json
 *  - ./sv.json
 *
 * The selected language is persisted using localStorage.language.
 */
i18n
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources: {
      en: { translation: en },
      sv: { translation: sv },
    },
    lng: localStorage.language, // Default language
    fallbackLng: 'en', // Fallback if key is missing
    debug: false, // Set to true to debug missing keys
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    react: {
      useSuspense: true, // You can disable if you don't want loading fallback
    },
  });

export default i18n;