import React, { useState } from 'react';
import axios from 'axios';

const PhotoUploader = ({ productId, onPhotoSelect }) => {
  const [file, setFile] = useState(null);
const [altText, setAltText] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleFileChange = (e) => {
  setFile(e.target.files[0]);
};

const handleAltTextChange = (e) => {
  setAltText(e.target.value);
};

const handleUpload = async () => {
  setLoading(true);
  const formData = new FormData();
  formData.append('photo', file);
  formData.append('altText', altText);

  try {
    const response = await axios.post('http://localhost:3001/api/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    onPhotoSelect(response.data);
    setFile(null);
    setAltText('');
  } catch (err) {
    setError('Failed to upload photo');
  } finally {
    setLoading(false);
  }
};

return (
  <div>
    <h3>Upload Photo</h3>
    <input type="file" onChange={handleFileChange} />
    <input type="text" value={altText} onChange={handleAltTextChange} placeholder="Alt Text" />
    <button onClick={handleUpload} disabled={!file || loading}>Upload</button>
    {error && <div>{error}</div>}
  </div>
);
};

export default PhotoUploader;
