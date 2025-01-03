import React, { createContext, useContext, useEffect, useState } from "react";
import en from "../locales/en.json";
import it from "../locales/it.json";
import moment from "moment";
import "moment/locale/it";

// Defines supported locales
const locales = {
  en,
  it,
};

// Creates the context
const TranslationContext = createContext();

// Define the provider
export const TranslationProvider = ({ children, locale: initialLocale }) => {
  const defaultLocale = locales[initialLocale] ? initialLocale : "en";
  const [locale, setLocale] = useState(defaultLocale);
  const [translations, setTranslations] = useState(locales[defaultLocale]);

  useEffect(() => {
    const supportedLocale = locales[locale] ? locale : "en";
    moment.locale(supportedLocale);
    setLocale(supportedLocale);
    setTranslations(locales[supportedLocale]);
  }, [locale]);

  return (
    <TranslationContext.Provider value={{ locale, translations }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook for using translations
export const useTranslation = () => {
  return useContext(TranslationContext);
};
