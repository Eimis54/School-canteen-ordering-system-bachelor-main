import React, { useState, useEffect } from 'react';

const ChildrenManagement = () => {
  const [children, setChildren] = useState([]);
  const [newChildName, setNewChildName] = useState('');
  const [newChildSurname, setNewChildSurname] = useState('');
  const [newChildGrade, setNewChildGrade] = useState('');
  const [editName, setEditName] = useState('');
  const [editSurname, setEditSurname] = useState('');
  const [editGrade, setEditGrade] = useState('');
  const [error, setError] = useState('');
  const [editingChildId, setEditingChildId] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem('token');
      const userID = localStorage.getItem('userID'); // Ensure this is correct
  
      if (!userID) {
        setError('UserID is not available. Please log in again.');
        return;
      }
  
      const response = await fetch(`http://localhost:3001/api/children?userID=${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setChildren(data);
      } else {
        setError('Failed to fetch children');
      }
    } catch (error) {
      setError('Failed to fetch children');
    }
  };

  const handleAddChild = async (event) => {
    event.preventDefault();
    if (!newChildName || !newChildSurname || !newChildGrade) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const userID = localStorage.getItem('userID');

      if (!userID) {
        setError('UserID is not available. Please log in again.');
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
        setError('Failed to add child');
      }
    } catch (error) {
      setError('Failed to add child');
    }
  };

  const handleEditChild = async (event) => {
    event.preventDefault();

    if (editingChildId === null) {
      setError('Child ID is not set');
      return;
    }

    const childData = {
      Name: editName,
      Surname: editSurname,
      Grade: editGrade,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/children/${editingChildId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(childData),
      });

      if (!response.ok) {
        throw new Error('Failed to edit child');
      }

      const updatedChild = await response.json();
      fetchChildren();
      setEditingChildId(null);
    } catch (error) {
      setError('Failed to edit child');
    }
  };

  const handleDeleteChild = async (childId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/children/${childId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchChildren();
      } else {
        setError('Failed to delete child');
      }
    } catch (error) {
      setError('Failed to delete child');
    }
  };

  return (
    <div>
      <h2>Your Children</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {children.length > 0 ? (
          children.map((child) => (
            <li key={child.id}>
              {child.Name} {child.Surname} - Grade: {child.Grade}
              {editingChildId !== child.id ? (
                <>
                  <button onClick={() => {
                    setEditName(child.Name);
                    setEditSurname(child.Surname);
                    setEditGrade(child.Grade);
                    setEditingChildId(child.id);
                  }}>Edit</button>
                  <button onClick={() => handleDeleteChild(child.id)}>Delete</button>
                </>
              ) : (
                <form onSubmit={handleEditChild}>
                  <input
                    type="text"
                    placeholder="Edit name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Edit surname"
                    value={editSurname}
                    onChange={(e) => setEditSurname(e.target.value)}
                  />
                  <select value={editGrade} onChange={(e) => setEditGrade(e.target.value)}>
                    <option value="" disabled>Select grade</option>
                    {[...Array(12).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <button type="submit">Update Child</button>
                </form>
              )}
            </li>
          ))
        ) : (
          <p>No children found.</p>
        )}
      </ul>
      <form onSubmit={handleAddChild}>
        <input
          type="text"
          placeholder="Enter name"
          value={newChildName}
          onChange={(e) => setNewChildName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter surname"
          value={newChildSurname}
          onChange={(e) => setNewChildSurname(e.target.value)}
        />
        <select value={newChildGrade} onChange={(e) => setNewChildGrade(e.target.value)}>
          <option value="" disabled>Select grade</option>
          {[...Array(12).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <button type="submit">Add Child</button>
      </form>
    </div>
  );
};

export default ChildrenManagement;
