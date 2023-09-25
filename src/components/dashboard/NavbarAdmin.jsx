import { React, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import GeneralContext from "../../contexts/GeneralContext";
import './NavbarAdmin.scss';

const NavbarAdmin = ({setUser, zIndex}) => {

  const { user, storeInfo } = useContext(GeneralContext);

  return (
    <div className="navbar-admin-page" style={{zIndex:zIndex}}>
      <div className='logo-name-img'>
        {/* <img className='logo-image' src={storeInfo.imgUrl} alt="logo" /> */}
        <div className='logo-name'>
          <NavLink className="navlink" to="/">{storeInfo.storeName}</NavLink>
        </div>
      </div>
      <div className='main-links'>
        <button className='nav-buttons'><NavLink className="navlink" to="/dashboard">Settings</NavLink></button>
      </div>
      <div className='login-part'>
        {user.id && !user.access && 
          <div className='user-log'>
            <div className='welcome-text'>
              <span>Welcome, </span>
              <span>{user.username}!</span>
            </div>
            <button className='nav-buttons' onClick={() => setUser({})}>Logout</button>
          </div>
        }
      </div>
    </div>
  )
}

export default NavbarAdmin;