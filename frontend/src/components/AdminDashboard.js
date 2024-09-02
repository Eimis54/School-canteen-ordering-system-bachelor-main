  import React from 'react';
  import { Link, Outlet } from 'react-router-dom';

  const AdminDashboard = () => {
    return (
      <div>
        <h1>Admin Dashboard</h1>
        <nav>
          <ul>
            <li><Link to="users">Edit Users</Link></li>
            <li><Link to="deals">Edit Deals</Link></li>
            <li><Link to="menu">Edit Menu</Link></li>
            <li><Link to="photos">Manage Photos</Link></li>
          </ul>
        </nav>
        <Outlet />
      </div>
    );
  };

  export default AdminDashboard;
