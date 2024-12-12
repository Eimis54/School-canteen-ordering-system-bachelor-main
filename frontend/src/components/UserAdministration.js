import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import EditDeal from './DealAdministration';
import LanguageContext from '../LanguageContext';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Snackbar,
} from '@mui/material';

const UserAdministration = () => {
  const { language } = useContext(LanguageContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    roleID: 1,
  });
  const [showEditDeal, setShowEditDeal] = useState(false);
  const [editDealId, setEditDealId] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/user/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 200) {
        setUsers(response.data);
      } else {
        setError(language.FailedToFetchUsers);
      }
    } catch (error) {
      setError(language.ErrorOccured);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/admin/roles', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 200) {
        setRoles(response.data);
      } else {
        setError(language.FailedToFetchRoles);
      }
    } catch (error) {
      console.error(language.FailedToFetchRoles, error);
      setError(language.ErrorOccured);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm(language.WantToDeleteUser)) return;
    try {
      await axios.delete(`http://localhost:3001/api/user/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(users.filter(user => user.UserID !== userId));
    } catch (error) {
      setError(language.ErrorOccured);
    }
  };
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.Name,
      surname: user.Surname,
      email: user.Email,
      roleID: user.RoleID,
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!editingUser) return;

    try {
      const response = await axios.put(`http://localhost:3001/api/user/admin/users/${editingUser.UserID}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        const updatedUser = response.data;
        setUsers(users.map(user => (user.UserID === updatedUser.UserID ? updatedUser : user)));
        setEditingUser(null);
        setFormData({ name: '', surname: '', email: '', roleID: 1 });
      } else {
        setError(language.FailedToUpdateUser);
      }
    } catch (error) {
      setError(language.ErrorOccured);
    }
  };

  const handleViewOrders = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/user/admin/users/${userId}/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        setOrders(response.data);
        setShowOrders(true);
      } else {
        setError(language.FailedToFetchUserOrders);
      }
    } catch (error) {
      console.error(language.ErrorOccured, error);
      setError(language.ErrorOccured);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({ name: '', surname: '', email: '', roleID: 1 });
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  if (loading) return <div>{language.Loading}</div>;
  if (error) {
    return (
      <Snackbar
        open={!!error}
        onClose={handleCloseSnackbar}
        message={error}
        autoHideDuration={6000}
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        {language.UserAdministration}
      </Typography>
      {showOrders && (
        <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6">{language.UserOrders}</Typography>
          {orders.length === 0 ? (
            <Typography>{language.NoExistingOrders}</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{language.OrderID}</TableCell>
                    <TableCell>{language.TotalPrice}</TableCell>
                    <TableCell>{language.TotalCalories}</TableCell>
                    <TableCell>{language.Status}</TableCell>
                    <TableCell>{language.OrderDate}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.OrderID}>
                      <TableCell>{order.OrderID}</TableCell>
                      <TableCell>{order.TotalPrice}</TableCell>
                      <TableCell>{order.TotalCalories}</TableCell>
                      <TableCell>
                        {order.status === 0 ? language.Completed : 
                         order.status === 1 ? language.NotCompleted : 
                         null
                        }
                      </TableCell>
                      <TableCell>{order.OrderDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Button onClick={() => setShowOrders(false)} variant="outlined" sx={{ mt: 2 }}>
            {language.CloseOrders}
          </Button>
        </Paper>
      )}
      <Paper elevation={3} sx={{ p: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>{language.Name}</TableCell>
                <TableCell>{language.Surname}</TableCell>
                <TableCell>{language.Email}</TableCell>
                <TableCell>{language.Role}</TableCell>
                <TableCell>{language.Actions}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {users.map(user => (
    <TableRow key={user.UserID}>
      <TableCell>{user.UserID}</TableCell>
      <TableCell>{user.Name}</TableCell>
      <TableCell>{user.Surname}</TableCell>
      <TableCell>{user.Email}</TableCell>
      <TableCell>{roles.find(role => role.RoleID === user.RoleID)?.RoleName || language.Unknown}</TableCell>
      <TableCell>
        <Button variant="contained" color="error" onClick={() => handleDelete(user.UserID)}>
          {language.Delete}
        </Button>
        <Button variant="contained" color="primary" onClick={() => handleEdit(user)}>
          {language.Edit}
        </Button>
        <Button variant="outlined" onClick={() => handleViewOrders(user.UserID)}>
          {language.ViewOrders}
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

          </Table>
        </TableContainer>
      </Paper>
      {editingUser && (
        <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
          <Typography variant="h6">{language.EditUser}</Typography>
          <form onSubmit={handleSave}>
            <Box>
              <label>
                {language.Name}:
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </label>
            </Box>
            <Box>
              <label>
                {language.Surname}:
                <input
                  type="text"
                  value={formData.surname}
                  onChange={e => setFormData({ ...formData, surname: e.target.value })}
                />
              </label>
            </Box>
            <Box>
              <label>
                {language.Email}:
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </label>
            </Box>
            <Box>
              <label>
                {language.Role}:
                <select
                  value={formData.roleID}
                  onChange={e => setFormData({ ...formData, roleID: Number(e.target.value) })}
                >
                  {roles.map(role => (
                    <option key={role.RoleID} value={role.RoleID}>
                      {role.RoleName}
                    </option>
                  ))}
                </select>
              </label>
            </Box>
            <Button type="submit" variant="contained" color="primary">
              {language.Save}
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
              {language.Cancel}
            </Button>
          </form>
        </Paper>
      )}
    </Container>
  );
};

export default UserAdministration;
