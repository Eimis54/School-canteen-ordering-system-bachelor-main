import React, {useContext} from 'react';
import LanguageContext from '../LanguageContext';

const Cancel = () => {
  const {language} = useContext(LanguageContext);
  return (
    <div>
      <h1>{language.PaymentCanceled}</h1>
      <p>{language.YourPaymentCanceled}</p>
    </div>
  );
};

export default Cancel;
