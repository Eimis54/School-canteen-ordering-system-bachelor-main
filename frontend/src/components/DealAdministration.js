import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const API_BASE_URL = 'http://localhost:3001';

const DealAdministration = ({ DealID = null, onCancel = () => {} }) => {
  const [deals, setDeals] = useState([]);
  const [currentDealId, setCurrentDealId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photoUrl: '',
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeals();
    fetchPhotos();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/deals`);
      setDeals(response.data);
    } catch (error) {
      setError('Failed to fetch deals');
    }
  };

  const fetchDeal = async (DealID) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/deals/${DealID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFormData({
        title: response.data.title || '',
        description: response.data.description || '',
        photoUrl: response.data.photoUrl || '',
      });
      setCurrentDealId(DealID);
    } catch (error) {
      setError('Failed to fetch deal');
    }
  };

  const toggleFeatured = async (DealID, isFeatured) => {
    setLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/deals/${DealID}/feature`,
        { isFeatured: !isFeatured },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchDeals();
    } catch (error) {
      setError('Failed to update deal');
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/photo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPhotos(response.data);
    } catch (error) {
      setError('Failed to fetch photos');
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (currentDealId) {
        await axios.put(
          `${API_BASE_URL}/api/deals/${currentDealId}`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/api/deals`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      }
      setFormData({ title: '', description: '', photoUrl: '' });
      setCurrentDealId(null);
      fetchDeals();
      if (typeof onCancel === 'function') {
        onCancel();
      }
    } catch (error) {
      setError('Error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (DealID) => {
    fetchDeal(DealID);
  };

  const handleDelete = async (DealID) => {
    if (!DealID) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/deals/${DealID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFormData({ title: '', description: '', photoUrl: '' });
      setCurrentDealId(null);
      fetchDeals();
    } catch (error) {
      setError('Failed to delete deal');
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {

    setFormData({ title: '', description: '', photoUrl: '' });
    setCurrentDealId(null);
    
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoSelect = (e) => {
    setFormData({ ...formData, photoUrl: e.target.value });
  };

  return (
    <div>
      <h2>{currentDealId ? 'Edit Deal' : 'Create Deal'}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSave}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Photo</label>
          <select name="photoUrl" value={formData.photoUrl} onChange={handlePhotoSelect}>
  <option value="">Select a photo</option>
  {photos.map((photo) => (
    <option key={photo.PhotoID} value={photo.PhotoURL}>
      {photo.AltText || 'No description'}
    </option>
  ))}
</select>
          {formData.photoUrl && 
            <img 
              src={
                formData.photoUrl.startsWith('http')
                  ? formData.photoUrl
                  : `${API_BASE_URL}/${formData.photoUrl.replace(/\\/g, '/')}`
              } 
              alt="Selected" 
              style={{ maxWidth: '200px', marginTop: '10px' }} 
            />
          }
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (currentDealId ? 'Update' : 'Create')}
        </button>
        {currentDealId && (
          <button type="button" onClick={() => handleDelete(currentDealId)} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        )}
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>

      <h2>Deal List</h2>
      {deals.length === 0 ? (
        <p>No deals found</p>
      ) : (
        <ul>
          {deals.map(deal => (
            <li key={deal.DealID}>
              <h3>{deal.title}</h3>
              <p>{deal.description}</p>
              {deal.photoUrl && 
                <img 
                  src={`${API_BASE_URL}/${deal.photoUrl.replace(/\\/g, '/')}`} 
                  alt={deal.title} 
                  style={{ maxWidth: '100px', marginTop: '10px' }} 
                />
              }
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={deal.isFeatured}
                    onChange={() => toggleFeatured(deal.DealID, deal.isFeatured)}
                  />
                  Display in Carousel
                </label>
              </div>
              <button onClick={() => handleEdit(deal.DealID)}>Edit</button>
              <button onClick={() => handleDelete(deal.DealID)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

DealAdministration.propTypes = {
  DealID: PropTypes.string,
  onCancel: PropTypes.func,
};

export default DealAdministration;
