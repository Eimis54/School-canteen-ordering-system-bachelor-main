import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Paper,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import LanguageContext from '../LanguageContext';

const ChildrenManagement = () => {
  const { language } = useContext(LanguageContext);
  const [children, setChildren] = useState([]);
  const [newChildName, setNewChildName] = useState('');
  const [newChildSurname, setNewChildSurname] = useState('');
  const [newChildGrade, setNewChildGrade] = useState('');
  const [editName, setEditName] = useState('');
  const [editSurname, setEditSurname] = useState('');
  const [editGrade, setEditGrade] = useState('');
  const [error, setError] = useState('');
  const [editingChildId, setEditingChildId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem('token');
      const userID = localStorage.getItem('userId');
      if (!userID) {
        setError(language.UserIDNotAvailableLogIn);
        return;
      }
      const response = await fetch(`http://localhost:3001/api/children?userID=${userID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setChildren(data);
        setError('');
      } else {
        setError(language.FailedToFetchChildren);
      }
    } catch {
      setError(language.FailedToFetchChildren);
    }
  };

  const handleAddChild = async (event) => {
    event.preventDefault();
    if (!newChildName || !newChildSurname || !newChildGrade) {
      setError(language.FillAllFields);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const userID = localStorage.getItem('userId');
      if (!userID) {
        setError(language.UserIDNotAvailableLogIn);
        return;
      }
      const response = await fetch('http://localhost:3001/api/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Name: newChildName,
          Surname: newChildSurname,
          Grade: newChildGrade,
          UserID: userID,
        }),
      });
      if (response.ok) {
        fetchChildren();
        setNewChildName('');
        setNewChildSurname('');
        setNewChildGrade('');
        setError('');
      } else {
        setError(language.FailedToAddChild);
      }
    } catch {
      setError(language.FailedToAddChild);
    }
  };

  const handleEditClick = (child) => {
    setEditName(child.Name);
    setEditSurname(child.Surname);
    setEditGrade(child.Grade);
    setEditingChildId(child.id);
    setOpenEditDialog(true);
  };

  const handleEditChild = async () => {
    if (!editingChildId) {
      setError(language.ChildIDNotSet);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/children/${editingChildId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Name: editName,
          Surname: editSurname,
          Grade: editGrade,
        }),
      });
      if (response.ok) {
        fetchChildren();
        setOpenEditDialog(false);
        setError('');
      } else {
        setError(language.FailedToEditChild);
      }
    } catch {
      setError(language.FailedToEditChild);
    }
  };

  const handleDeleteChild = async (childId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/children/${childId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchChildren();
      } else {
        setError(language.FailedToDeleteChild);
      }
    } catch {
      setError(language.FailedToDeleteChild);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h4" gutterBottom>
          {language.YourChildren}
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <List>
          {children.length > 0 ? (
            children.map((child) => (
              <ListItem key={child.id} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography>
                    {child.Name} {child.Surname} - {language.Grade}: {child.Grade}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleEditClick(child)}>
                  <Edit />
                </IconButton>
                {/* <IconButton onClick={() => handleDeleteChild(child.id)}>
                  <Delete />
                </IconButton> */}
              </ListItem>
            ))
          ) : (
            <Typography>{language.NoChildrenFound}</Typography>
          )}
        </List>
        
        <Box component="form" onSubmit={handleAddChild} sx={{ display: 'flex', gap: '10px', mt: 3 }}>
          <TextField
            label={language.EnterChildName}
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            required
          />
          <TextField
            label={language.EnterChildSurname}
            value={newChildSurname}
            onChange={(e) => setNewChildSurname(e.target.value)}
            required
          />
          <Select
            value={newChildGrade}
            onChange={(e) => setNewChildGrade(e.target.value)}
            displayEmpty
            required
          >
            <MenuItem value="" disabled>{language.Selectgrade}</MenuItem>
            {[...Array(12).keys()].map((i) => (
              <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
            ))}
          </Select>
          <Button type="submit" variant="contained" sx={{backgroundColor: "black", color: "white"}}>
            {language.AddChild}
          </Button>
        </Box>

        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>{language.EditChild}</DialogTitle>
          <DialogContent>
            <TextField
              label={language.EditChildName}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
              margin="dense"
            />
            <TextField
              label={language.EditChildSurname}
              value={editSurname}
              onChange={(e) => setEditSurname(e.target.value)}
              fullWidth
              margin="dense"
            />
            <Select
              value={editGrade}
              onChange={(e) => setEditGrade(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>{language.Selectgrade}</MenuItem>
              {[...Array(12).keys()].map((i) => (
                <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)} sx={{color: "black"}}>{language.Cancel}</Button>
            <Button onClick={handleEditChild} variant="contained" sx={{backgroundColor: "black", color: "white"}}>
              {language.UpdateChild}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default ChildrenManagement;
