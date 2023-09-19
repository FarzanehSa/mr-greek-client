import {React, useContext, useState, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from "react-scroll";

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import GeneralContext from "../contexts/GeneralContext";
import './Navbar.scss';

const Navbar = ({setUser}) => {

  const {storeInfo, user } = useContext(GeneralContext);
  const [showBar, setShowBar] = useState(false);
  const [showSideNav, setShowSideNav] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 801) {
        setShowSideNav(true);
      } else {
        setShowBar(false);
        setShowSideNav(false);
      }
    }
    
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);


  return (

    <div className="n-wrapper">
      <div className="n-row">
        <div className='logo-name-img'>
          {/* <img className='logo-image' src={storeInfo.imgUrl} alt="logo" /> */}
          <span className='logo-name'>
            {storeInfo.storeName}
          </span>
        </div>
        <div className="n-right">
          {showSideNav ?
          <div>
            {showBar ? <CloseIcon onClick={() => setShowBar(!showBar)}/> : <MenuIcon onClick={() => setShowBar(!showBar)}/>}
          </div>
          :
          <ul style={{listStyleType: 'none'}}>
            <li>
              <button className='nav-buttons'><NavLink tabIndex="-1" className="navlink" to="/">Home</NavLink></button>
            </li>
            <li>
              <button className='nav-buttons'><NavLink tabIndex="-1" className="navlink" to="/menu">Menu</NavLink></button>
            </li>
            <li>
              <button className='nav-buttons'><NavLink tabIndex="-1" className="navlink" to="/contact">Contact Us</NavLink></button>
            </li>
            {user.id && 
              <li>
                <button className='nav-buttons' onClick={() => setUser({})}>Logout</button>
              </li>
            }
          </ul>
          }
        </div>
      </div>
      {showSideNav &&   
      <div className={showBar ? "n-sidebar active" : "n-sidebar"} onClick={() => {setShowBar(false)}}>
        <ul style={{listStyleType: 'none'}}>
          <li>
            <button className='nav-buttons' onClick={() => {setShowBar(false)}}><NavLink tabIndex="-1" className="navlink" to="/">Home</NavLink></button>
          </li>
          <li>
            <button className='nav-buttons' onClick={() => {setShowBar(false)}}><NavLink tabIndex="-1" className="navlink" to="/menu">Menu</NavLink></button>
          </li>
          <li>
            <button className='nav-buttons' onClick={() => {setShowBar(false)}}><NavLink tabIndex="-1" className="navlink" to="/contact">Contact Us</NavLink></button>
           </li>
           {user.id && 
              <li>
                <button className='nav-buttons' onClick={() => setUser({})}>Logout</button>
              </li>
            }
        </ul>
      </div>}
    </div>
  )
}

export default Navbar;