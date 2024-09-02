import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const AdminPhotoManager = () => {
  const [photos, setPhotos] = useState([]);
  const [products, setProducts] = useState([]); // State for storing products
  const [selectedFile, setSelectedFile] = useState(null);
  const [productId, setProductId] = useState('');
  const [altText, setAltText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchPhotos();
    fetchProducts(); // Fetch products on component mount
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/photo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Fetched photos:', response.data);
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts(response.data); // Store products in state
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!productId) {
      setErrorMessage('Please select a product.');
      return;
    }

    if (!selectedFile) {
      console.error('File is required');
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append('photo', selectedFile);
    formData.append('productId', productId); // Use the selected product ID
    formData.append('altText', altText);

    try {
      await axios.post(`${API_BASE_URL}/api/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      fetchPhotos();
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error uploading photo:', error);
      setErrorMessage('Failed to upload photo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photoId) => {
    if (!Number.isInteger(Number(photoId))) {
      setErrorMessage('Invalid Photo ID. It must be an integer.');
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/photo/${photoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchPhotos();
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error deleting photo:', error);
      setErrorMessage('Failed to delete photo.');
    }
  };

  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    setProductId(selectedProductId); // Update state with selected product ID
  };

  return (
    <div>
      <h2>Photo Manager</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
      <input type="file" onChange={handleFileChange} />
      <select value={productId} onChange={handleProductChange}>
        <option value="">Select Product</option>
        {products.map(product => (
          <option key={product.ProductID} value={product.ProductID}>
            {product.ProductName}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Alt Text"
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
      />
      <button onClick={handleUpload}>Upload Photo</button>
      {loading && <p>Uploading...</p>}
      <div>
        <h3>Existing Photos</h3>
        {photos.map((photo) => (
          <div key={photo.PhotoID}>
            {photo.PhotoURL ? (
              <img src={`${API_BASE_URL}/${photo.PhotoURL}`} alt={photo.AltText || 'Photo'} width="100" />
            ) : (
              <p>No image available</p>
            )}
            <p>{photo.AltText || 'No description'}</p>
            <button onClick={() => handleDelete(photo.PhotoID)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPhotoManager;
