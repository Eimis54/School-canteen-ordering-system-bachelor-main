import React, {useContext} from 'react';
import LanguageContext from '../LanguageContext';

const FAQ = () => {
  const {language}=useContext(LanguageContext);
  return (
    <div>
      <h1>this is FAQ page</h1>
      <p>Welcome</p>
    </div>
  );
};

export default FAQ;
