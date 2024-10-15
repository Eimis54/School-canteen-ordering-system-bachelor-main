import React, {useContext} from 'react';
import LanguageContext from '../LanguageContext';

const Help = () => {
  const {language}=useContext(LanguageContext);
  return (
    <div>
      <h1>this is HELP page</h1>
      <p>Welcome</p>
    </div>
  );
};

export default Help;
