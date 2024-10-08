import React, { useState, createContext } from 'react';
import en from './translations/en.json';
import lt from './translations/lt.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(en);  // Default to English

  const switchLanguage = (lang) => {
    if (lang === 'en') {
      setLanguage(en);
    } else if (lang === 'lt') {
      setLanguage(lt);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
