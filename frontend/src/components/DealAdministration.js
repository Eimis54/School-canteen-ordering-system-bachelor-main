import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Container, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Snackbar, CircularProgress, Paper, List, ListItem, ListItemText, Checkbox } from '@mui/material';
import LanguageContext from '../LanguageContext';

const API_BASE_URL = 'http://localhost:3001';

const DealAdministration = ({ DealID = null, onCancel = () => {} }) => {
  const { language } = useContext(LanguageContext);
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
      setSnackbarOpen(true);
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
      setSnackbarOpen(true);
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
      setSnackbarOpen(true);
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
      setSnackbarOpen(true);
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
      setSnackbarOpen(true);
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
      setSnackbarOpen(true);
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          {currentDealId ? language.EditDeal : language.CreateDeal}
        </Typography>
        {error && (
          <Snackbar
            open={snackbarOpen}
            onClose={handleSnackbarClose}
            message={error}
            autoHideDuration={6000}
          />
        )}
        <form onSubmit={handleSave}>
          <TextField
            label={language.Title}
            name="title"
            placeholder={language.Title}
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label={language.Description}
            name="description"
            placeholder={language.Description}
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>{language.Photo}</InputLabel>
            <Select name="photoUrl" value={formData.photoUrl} onChange={handlePhotoSelect}>
              <MenuItem value="">{language.SelectAPhoto}</MenuItem>
              {photos.map((photo) => (
                <MenuItem key={photo.PhotoID} value={photo.PhotoURL}>
                  {photo.AltText || language.NoDescription}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {formData.photoUrl && (
            <img
              src={
                formData.photoUrl.startsWith('http')
                  ? formData.photoUrl
                  : `${API_BASE_URL}/${formData.photoUrl.replace(/\\/g, '/')}`
              }
              alt={language.Selected}
              style={{ maxWidth: '200px', marginTop: '10px' }}
            />
          )}
          <div>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : (currentDealId ? language.Update : language.Create)}
            </Button>
            {currentDealId && (
              <Button variant="contained" color="secondary" onClick={() => handleDelete(currentDealId)} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : language.Delete}
              </Button>
            )}
            <Button variant="contained" color="error" onClick={handleCancel}>
              {language.Cancel}
            </Button>
          </div>
        </form>

        <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
          {language.DealList}
        </Typography>
        {deals.length === 0 ? (
          <Typography>{language.NoDealsFound}</Typography>
        ) : (
          <List>
            {deals.map(deal => (
              <ListItem key={deal.DealID} sx={{ border: '1px solid #ccc', marginBottom: 1, padding: 1 }}>
                <ListItemText
                  primary={deal.title}
                  secondary={
                    <>
                      <Typography variant="body2">{deal.description}</Typography>
                      {deal.photoUrl && (
                        <img
                          src={`${API_BASE_URL}/${deal.photoUrl.replace(/\\/g, '/')}`}
                          alt={deal.title}
                          style={{ maxWidth: '100px', marginTop: '10px' }}
                        />
                      )}
                    </>
                  }
                />
                <div>
                  <Checkbox
                    checked={deal.isFeatured}
                    onChange={() => toggleFeatured(deal.DealID, deal.isFeatured)}
                  />
                  <Typography variant="body2">{language.DisplayInCarousel}</Typography>
                </div>
                <Button variant="contained" onClick={() => handleEdit(deal.DealID)}>
                  {language.Edit}
                </Button>
                <Button variant="contained" color="error" onClick={() => handleDelete(deal.DealID)}>
                  {language.Delete}
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

DealAdministration.propTypes = {
  DealID: PropTypes.string,
  onCancel: PropTypes.func,
};

export default DealAdministration;
