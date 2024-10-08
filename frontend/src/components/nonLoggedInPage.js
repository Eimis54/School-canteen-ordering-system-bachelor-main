import React, { useContext } from 'react';
import LanguageContext from '../LanguageContext';

const NonLoggedInPage = () => {
  const {language} = useContext(LanguageContext);
  return (
    <div>
      <h1>{language.Welcome}</h1>
      <p>{language.PleaseLogIn}</p>
    </div>
  );
};

export default NonLoggedInPage;
