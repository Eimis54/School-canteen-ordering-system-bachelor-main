import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditDeal from './DealAdministration';

const UserAdministration = () => {
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
    roleID: 1
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
        setError('Failed to fetch users');
      }
    } catch (error) {
      setError('Error occurred. Please try again later.');
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
        setError('Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error occurred while fetching roles:', error);
      setError('Error occurred. Please try again later.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await axios.delete(`http://localhost:3001/api/user/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        setUsers(users.filter(user => user.UserID !== userId));
      } else {
        setError('Failed to delete user');
      }
    } catch (error) {
      setError('Error occurred. Please try again later.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.Name,
      surname: user.Surname,
      email: user.Email,
      roleID: user.RoleID
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
        setError('Failed to update user');
      }
    } catch (error) {
      setError('Error occurred. Please try again later.');
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
        setError('Failed to fetch user orders');
      }
    } catch (error) {
      console.error('Error occurred while fetching orders:', error);
      setError('Error occurred. Please try again later.');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({ name: '', surname: '', email: '', roleID: 1 });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>User Administration</h2>
      {showOrders && (
        <div>
          <h3>User Orders</h3>
          {orders.length === 0 ? (
            <p>No existing orders</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>OrderID</th>
                  <th>TotalPrice</th>
                  <th>TotalCalories</th>
                  <th>Status</th>
                  <th>OrderDate</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.OrderID}>
                    <td>{order.OrderID}</td>
                    <td>{order.TotalPrice}</td>
                    <td>{order.TotalCalories}</td>
                    <td>{order.Status}</td>
                    <td>{order.OrderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button onClick={() => setShowOrders(false)}>Close Orders</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.UserID}>
              <td>{user.UserID}</td>
              <td>{user.Name}</td>
              <td>{user.Surname}</td>
              <td>{user.Email}</td>
              <td>{roles.find(role => role.RoleID === user.RoleID)?.RoleName || 'Unknown'}</td>
              <td>
                <button onClick={() => handleDelete(user.UserID)}>Delete</button>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleViewOrders(user.UserID)}>View Orders</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingUser && (
        <div>
          <h3>Edit User</h3>
          <form onSubmit={handleSave}>
            <label>
              Name:
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </label>
            <label>
              Surname:
              <input
                type="text"
                value={formData.surname}
                onChange={e => setFormData({ ...formData, surname: e.target.value })}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </label>
            <label>
              Role:
              <select
                value={formData.roleID}
                onChange={e => setFormData({ ...formData, roleID: parseInt(e.target.value, 10) })}
              >
                {roles.map(role => (
                  <option key={role.RoleID} value={role.RoleID}>{role.RoleName}</option>
                ))}
              </select>
            </label>
            <button type="submit">Save</button>
            <button type="button" onClick={handleCancelEdit}>Cancel</button>
          </form>

        </div>
      )}
      {showEditDeal && (
        <EditDeal dealId={editDealId} onCancel={handleCancelEdit} />
      )}
    </div>
  );
};

export default UserAdministration;
