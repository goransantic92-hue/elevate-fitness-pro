import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from "./constants";
import enCommon from "./locales/en/common";
import enHome from "./locales/en/home";
import enPricing from "./locales/en/pricing";
import enFaq from "./locales/en/faq";
import enCoaching from "./locales/en/coaching";
import enProgram from "./locales/en/program";
import enTraining from "./locales/en/training";
import enNutrition from "./locales/en/nutrition";
import enResults from "./locales/en/results";
import enAuth from "./locales/en/auth";
import enBlog from "./locales/en/blog";
import enDashboard from "./locales/en/dashboard";
import arCommon from "./locales/ar/common";
import arHome from "./locales/ar/home";
import arPricing from "./locales/ar/pricing";
import arFaq from "./locales/ar/faq";
import arCoaching from "./locales/ar/coaching";
import arProgram from "./locales/ar/program";
import arTraining from "./locales/ar/training";
import arNutrition from "./locales/ar/nutrition";
import arResults from "./locales/ar/results";
import arAuth from "./locales/ar/auth";
import arBlog from "./locales/ar/blog";
import arDashboard from "./locales/ar/dashboard";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        home: enHome,
        pricing: enPricing,
        faq: enFaq,
        coaching: enCoaching,
        program: enProgram,
        training: enTraining,
        nutrition: enNutrition,
        results: enResults,
        auth: enAuth,
        blog: enBlog,
        dashboard: enDashboard,
      },
      ar: {
        common: arCommon,
        home: arHome,
        pricing: arPricing,
        faq: arFaq,
        coaching: arCoaching,
        program: arProgram,
        training: arTraining,
        nutrition: arNutrition,
        results: arResults,
        auth: arAuth,
        blog: arBlog,
        dashboard: arDashboard,
      },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    ns: [
      "common",
      "home",
      "pricing",
      "faq",
      "coaching",
      "program",
      "training",
      "nutrition",
      "results",
      "auth",
      "blog",
      "dashboard",
    ],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
    },
  });

export default i18n;
