import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from "./constants";
import enCommon from "./locales/en/common";
import enHome from "./locales/en/home";
import enPricing from "./locales/en/pricing";
import enFaq from "./locales/en/faq";
import enCoaching from "./locales/en/coaching";
import arCommon from "./locales/ar/common";
import arHome from "./locales/ar/home";
import arPricing from "./locales/ar/pricing";
import arFaq from "./locales/ar/faq";
import arCoaching from "./locales/ar/coaching";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, home: enHome, pricing: enPricing, faq: enFaq, coaching: enCoaching },
      ar: { common: arCommon, home: arHome, pricing: arPricing, faq: arFaq, coaching: arCoaching },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    ns: ["common", "home", "pricing", "faq", "coaching"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
    },
  });

export default i18n;
