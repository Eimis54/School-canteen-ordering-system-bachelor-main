import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import LanguageContext from '../LanguageContext';

const Products = () => {
  const { language }= useContext(LanguageContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error(language.ThereWasAnErrorFetchingProducts, error);
      });
  }, []);

  return (
    <div>
      <h1>{language.Products}</h1>
      <ul>
        {products.map(product => (
          <li key={product.ProductID}>{product.ProductName} - {product.Price} Eur.</li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
