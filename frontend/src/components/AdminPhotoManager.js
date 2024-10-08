import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import LanguageContext from '../LanguageContext';

const API_BASE_URL = 'http://localhost:3001';

const AdminPhotoManager = () => {
  const [photos, setPhotos] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [productId, setProductId] = useState('');
  const [altText, setAltText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {language} = useContext(LanguageContext);

  useEffect(() => {
    fetchPhotos();
    fetchProducts();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/photo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPhotos(response.data);
    } catch (error) {
      console.error(language.ErrorFetchingPhotos, error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error(language.ErrorFetchingProducts, error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!productId) {
      setErrorMessage(language.SelectProduct);
      return;
    }

    if (!selectedFile) {
      console.error(language.FileIsRequired);
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append('photo', selectedFile);
    formData.append('productId', productId);
    formData.append('altText', altText);

    try {
      await axios.post(`${API_BASE_URL}/api/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      fetchPhotos();
      setErrorMessage('');
    } catch (error) {
      console.error(language.ErrorUploadingPhoto, error);
      setErrorMessage(language.FailedToUploadPhoto);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photoId) => {
    if (!Number.isInteger(Number(photoId))) {
      setErrorMessage(language.InvalidPhotoID);
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/photo/${photoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchPhotos();
      setErrorMessage('');
    } catch (error) {
      console.error(language.ErrorDeletingPhoto, error);
      setErrorMessage(language.FailedToDeletePhoto);
    }
  };

  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    setProductId(selectedProductId);
  };

  return (
    <div>
      <h2>{language.PhotoManager}</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <input type="file" onChange={handleFileChange} />
      <select value={productId} onChange={handleProductChange}>
        <option value="">{language.SelectProduct}</option>
        {products.map(product => (
          <option key={product.ProductID} value={product.ProductID}>
            {product.ProductName}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder={language.AltText}
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
      />
      <button onClick={handleUpload}>{language.UploadPhoto}</button>
      {loading && <p>{language.Uploading}</p>}
      <div>
        <h3>{language.ExistingPhotos}</h3>
        {photos.map((photo) => (
          <div key={photo.PhotoID}>
            {photo.PhotoURL ? (
              <img src={`${API_BASE_URL}/${photo.PhotoURL}`} alt={photo.AltText || language.Photo} width="100" />
            ) : (
              <p>language.NoImage</p>
            )}
            <p>{photo.AltText || language.NoDescription}</p>
            <button onClick={() => handleDelete(photo.PhotoID)}>{language.Delete}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPhotoManager;
