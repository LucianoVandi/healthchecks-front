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
export const TranslationProvider = ({ children }) => {
  const [locale, setLocale] = useState("en"); // Default locale
  const [translations, setTranslations] = useState(locales["en"]);

  useEffect(() => {
    const browserLocale = navigator.language.split("-")[0];
    const supportedLocale = locales[browserLocale] ? browserLocale : "en";
    moment.locale(supportedLocale);
    setLocale(supportedLocale);
    setTranslations(locales[supportedLocale]);
  }, []);

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
