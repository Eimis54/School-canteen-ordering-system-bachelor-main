import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Container, Typography, Box, List, ListItem, ListItemButton, ListItemText, Paper } from '@mui/material';
import LanguageContext from '../LanguageContext';

const AdminDashboard = () => {
  const { language } = useContext(LanguageContext);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h4" gutterBottom>
          {language.AdminDashboard}
        </Typography>

        <Box component="nav" sx={{ mb: 4 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="users">
                <ListItemText primary={language.EditUsers} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="deals">
                <ListItemText primary={language.EditDeals} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="menu">
                <ListItemText primary={language.EditMenu} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="photos">
                <ListItemText primary={language.ManagePhotos} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        <Outlet />
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
