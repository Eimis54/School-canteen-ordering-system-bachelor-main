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

  const getProductName = (productId, productName = '') => {
    const translations = productTranslations.products[productId];
    console.log('Translations:', translations); // Debugging line
    if (translations) {
      const name = translations[language === en ? 'en' : 'lt']?.productname;
      console.log('Translated name:', name); // Debugging line
      if (name) {
        return name;
      }
    }
    console.log('Using fallback product name:', productName); // Debugging line
    return productName || 'Product name not available';
  };
  return (
    <LanguageContext.Provider value={{ language, switchLanguage, getProductName }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
