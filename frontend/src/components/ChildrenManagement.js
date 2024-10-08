import React, { useState, useEffect, useContext } from 'react';
import LanguageContext from '../LanguageContext';

const ChildrenManagement = () => {
  const {language} = useContext(LanguageContext);
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
      const userID = localStorage.getItem('userId');

      if (!userID) {
        setError(language.UserIDNotAvailableLogIn);
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
        setError(language.FailedToFetchChildren);
      }
    } catch (error) {
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
    } catch (error) {
      setError(language.FailedToAddChild);
    }
  };

  const handleEditChild = async (event) => {
    event.preventDefault();

    if (editingChildId === null) {
      setError(language.ChildIDNotSet);
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
        throw new Error(language.FailedToEditChild);
      }

      const updatedChild = await response.json();
      fetchChildren();
      setEditingChildId(null);
    } catch (error) {
      setError(language.FailedToEditChild);
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
        setError(language.FailedToDeleteChild);
      }
    } catch (error) {
      setError(language.FailedToDeleteChild);
    }
  };

  return (
    <div>
      <h2>{language.YourChildren}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {children.length > 0 ? (
          children.map((child) => (
            <li key={child.id}>
              {child.Name} {child.Surname} - {language.Grade}: {child.Grade}
              {editingChildId !== child.id ? (
                <>
                  <button onClick={() => {
                    setEditName(child.Name);
                    setEditSurname(child.Surname);
                    setEditGrade(child.Grade);
                    setEditingChildId(child.id);
                  }}>{language.Edit}</button>
                  <button onClick={() => handleDeleteChild(child.id)}>{language.Delete}</button>
                </>
              ) : (
                <form onSubmit={handleEditChild}>
                  <input
                    type="text"
                    placeholder={language.EditChildName}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder={language.EditChildSurname}
                    value={editSurname}
                    onChange={(e) => setEditSurname(e.target.value)}
                  />
                  <select value={editGrade} onChange={(e) => setEditGrade(e.target.value)}>
                    <option value="" disabled>{language.Selectgrade}</option>
                    {[...Array(12).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <button type="submit">{language.UpdateChild}</button>
                </form>
              )}
            </li>
          ))
        ) : (
          <p>{language.NoChildrenFound}</p>
        )}
      </ul>
      <form onSubmit={handleAddChild}>
        <input
          type="text"
          placeholder={language.EnterChildName}
          value={newChildName}
          onChange={(e) => setNewChildName(e.target.value)}
        />
        <input
          type="text"
          placeholder={language.EnterChildSurname}
          value={newChildSurname}
          onChange={(e) => setNewChildSurname(e.target.value)}
        />
        <select value={newChildGrade} onChange={(e) => setNewChildGrade(e.target.value)}>
          <option value="" disabled>{language.Selectgrade}</option>
          {[...Array(12).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <button type="submit">{language.AddChild}</button>
      </form>
    </div>
  );
};

export default ChildrenManagement;
