import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import LanguageContext from '../LanguageContext';

const API_BASE_URL = 'http://localhost:3001';

const DealAdministration = ({ DealID = null, onCancel = () => {} }) => {
  const {language}=useContext(LanguageContext);
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
      setError(language.FailedToFetchDeals);
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
      setError(language.FailedToFetchDeals);
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
      setError(language.FailedToUpdateDeal);
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
      setError(language.FailedToFetchPhotos);
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
      setError(language.ErrorOccured);
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
      setError(language.FailedToDeleteDeal);
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
      <h2>{currentDealId ? language.EditDeal : language.CreateDeal}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSave}>
        <div>
          <label>{language.Title}</label>
          <input
            type="text"
            name="title"
            placeholder={language.Title}
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{language.Description}</label>
          <textarea
            name="description"
            placeholder={language.Description}
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>{language.Photo}</label>
          <select name="photoUrl" value={formData.photoUrl} onChange={handlePhotoSelect}>
  <option value="">{language.SelectAPhoto}</option>
  {photos.map((photo) => (
    <option key={photo.PhotoID} value={photo.PhotoURL}>
      {photo.AltText || language.NoDescription}
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
              alt={language.Selected} 
              style={{ maxWidth: '200px', marginTop: '10px' }} 
            />
          }
        </div>
        <button type="submit" disabled={loading}>
          {loading ? language.Saving : (currentDealId ? language.Update : language.Create)}
        </button>
        {currentDealId && (
          <button type="button" onClick={() => handleDelete(currentDealId)} disabled={loading}>
            {loading ? language.Deleting : language.Delete}
          </button>
        )}
        <button type="button" onClick={handleCancel}>
          {language.Cancel}
        </button>
      </form>

      <h2>{language.DealList}</h2>
      {deals.length === 0 ? (
        <p>{language.NoDealsFound}</p>
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
                  {language.DisplayInCarousel}
                </label>
              </div>
              <button onClick={() => handleEdit(deal.DealID)}>{language.Edit}</button>
              <button onClick={() => handleDelete(deal.DealID)}>{language.Delete}</button>
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
