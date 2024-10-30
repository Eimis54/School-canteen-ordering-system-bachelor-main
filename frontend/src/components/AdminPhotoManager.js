import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import LanguageContext from '../LanguageContext';
import {
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';

const API_BASE_URL = 'http://localhost:3001';

const AdminPhotoManager = () => {
  const [photos, setPhotos] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [productId, setProductId] = useState('');
  const [altText, setAltText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { language } = useContext(LanguageContext);

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

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>{language.PhotoManager}</Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
        <Button variant="contained" component="label">
          {language.SelectFile}
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <Select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          displayEmpty
          sx={{ width: 200 }}
        >
          <MenuItem value="">{language.SelectProduct}</MenuItem>
          {products.map(product => (
            <MenuItem key={product.ProductID} value={product.ProductID}>
              {product.ProductName}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label={language.AltText}
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          sx={{ width: 300 }}
        />
        <Button variant="contained" onClick={handleUpload}>
          {language.UploadPhoto}
        </Button>
        {loading && <CircularProgress size={24} />}
      </Box>

      <Typography variant="h5" sx={{ mt: 4 }}>{language.ExistingPhotos}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        {photos.map((photo) => (
          <Card key={photo.PhotoID} sx={{ width: 200 }}>
            {photo.PhotoURL ? (
              <CardMedia
                component="img"
                height="140"
                image={`${API_BASE_URL}/${photo.PhotoURL}`}
                alt={photo.AltText || language.Photo}
              />
            ) : (
              <Typography variant="body2" sx={{ p: 2 }}>{language.NoImage}</Typography>
            )}
            <CardContent>
              <Typography variant="body2">{photo.AltText || language.NoDescription}</Typography>
            </CardContent>
            <CardActions>
              <Button color="error" onClick={() => handleDelete(photo.PhotoID)}>
                {language.Delete}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default AdminPhotoManager;
