import React, { useState, createContext } from 'react';
import en from './translations/en.json';
import lt from './translations/lt.json';
import productTranslations from './translations/productTranslations.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(en);

  const switchLanguage = (lang) => {
    if (lang === 'en') {
      setLanguage(en);
    } else if (lang === 'lt') {
      setLanguage(lt);
    }
  };

  const getProductName = (productId) => {
    console.log("Getting product name for ProductID:", productId); // Debug line
    const translations = productTranslations.products[productId];
    if (translations) {
      const name = translations[language === en ? 'en' : 'lt'].productname;
      console.log("Found product name:", name); // Debug line
      return name;
    }
    console.log("Product name not available for ProductID:", productId); // Debug line
    return 'Product name not available';
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, getProductName }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
