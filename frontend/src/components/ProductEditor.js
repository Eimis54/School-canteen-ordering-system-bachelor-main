import React, { useState } from 'react';
import PhotoUploader from './PhotoUploader';

const ProductEditor = ({ productId }) => {
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const handlePhotoSelect = (photoData) => {
    setSelectedPhotos([...selectedPhotos, photoData]);
  };

  return (
    <div>
      <h2>Product Editor</h2>

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
