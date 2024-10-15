import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import EditDeal from './DealAdministration';
import LanguageContext from '../LanguageContext';

const UserAdministration = () => {
  const {language}=useContext(LanguageContext);
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
      const response = await axios.delete(`http://localhost:3001/api/user/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        setUsers(users.filter(user => user.UserID !== userId));
      } else {
        setError(language.FailedToDeleteUser);
      }
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

  if (loading) return <div>{language.Loading}</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>{language.UserAdministration}</h2>
      {showOrders && (
        <div>
          <h3>{language.UserOrders}</h3>
          {orders.length === 0 ? (
            <p>{language.NoExistingOrders}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>{language.OrderID}</th>
                  <th>{language.TotalPrice}</th>
                  <th>{language.TotalCalories}</th>
                  <th>{language.Status}</th>
                  <th>{language.OrderDate}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.OrderID}>
                    <td>{order.OrderID}</td>
                    <td>{order.TotalPrice}</td>
                    <td>{order.TotalCalories}</td>
                    <td>
                {order.status === 0 ? language.Completed : 
                 order.status === 1 ? language.NotCompleted :
                 null
                }
            </td>
                    <td>{order.OrderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button onClick={() => setShowOrders(false)}>{language.CloseOrders}</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>{language.Name}</th>
            <th>{language.Surname}</th>
            <th>{language.Email}</th>
            <th>{language.Role}</th>
            <th>{language.Actions}</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.UserID}>
              <td>{user.UserID}</td>
              <td>{user.Name}</td>
              <td>{user.Surname}</td>
              <td>{user.Email}</td>
              <td>{roles.find(role => role.RoleID === user.RoleID)?.RoleName || language.Unknown}</td>
              <td>
                <button onClick={() => handleDelete(user.UserID)}>{language.Delete}</button>
                <button onClick={() => handleEdit(user)}>{language.Edit}</button>
                <button onClick={() => handleViewOrders(user.UserID)}>{language.ViewOrders}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingUser && (
        <div>
          <h3>{language.EditUser}</h3>
          <form onSubmit={handleSave}>
            <label>
              {language.Name}:
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </label>
            <label>
              {language.Surname}:
              <input
                type="text"
                value={formData.surname}
                onChange={e => setFormData({ ...formData, surname: e.target.value })}
              />
            </label>
            <label>
              {language.Email}:
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </label>
            <label>
              {language.Role}:
              <select
                value={formData.roleID}
                onChange={e => setFormData({ ...formData, roleID: parseInt(e.target.value, 10) })}
              >
                {roles.map(role => (
                  <option key={role.RoleID} value={role.RoleID}>{role.RoleName}</option>
                ))}
              </select>
            </label>
            <button type="submit">{language.Save}</button>
            <button type="button" onClick={handleCancelEdit}>{language.Cancel}</button>
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
