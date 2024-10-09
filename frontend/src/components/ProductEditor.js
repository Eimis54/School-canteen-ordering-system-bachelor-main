import React, { useState, useContext } from 'react';
import PhotoUploader from './PhotoUploader';
import LanguageContext from '../LanguageContext';

const ProductEditor = ({ productId }) => {
  const {language}=useContext(LanguageContext);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const handlePhotoSelect = (photoData) => {
    setSelectedPhotos([...selectedPhotos, photoData]);
  };

  return (
    <div>
      <h2>{language.ProductEditor}</h2>

      <PhotoUploader productId={productId} onPhotoSelect={handlePhotoSelect} />

      <div>
        {selectedPhotos.map(photo => (
          <img key={photo.photoId} src={photo.photoUrl} alt={photo.altText} />
        ))}
      </div>
    </div>
  );
};

export default ProductEditor;
