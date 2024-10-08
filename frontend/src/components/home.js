import React, {useContext} from 'react';
import LanguageContext from '../LanguageContext';

const Home = () => {
  const {language}=useContext(LanguageContext);
  return (
    <div>
      <h1>{language.WelcometotheSchoolCanteenOrderingSystem}</h1>
      <p>{language.ThisIsHomePage}</p>
    </div>
  );
};

export default Home;
