  import React, {useContext} from 'react';
  import { Link, Outlet } from 'react-router-dom';
import LanguageContext from '../LanguageContext';

  const AdminDashboard = () => {
    const {language} = useContext(LanguageContext);
    return (
      <div>
        <h1>{language.AdminDashboard}</h1>
        <nav>
          <ul>
            <li><Link to="users">{language.EditUsers}</Link></li>
            <li><Link to="deals">{language.EditDeals}</Link></li>
            <li><Link to="menu">{language.EditMenu}</Link></li>
            <li><Link to="photos">{language.ManagePhotos}</Link></li>
          </ul>
        </nav>
        <Outlet />
      </div>
    );
  };

  export default AdminDashboard;
