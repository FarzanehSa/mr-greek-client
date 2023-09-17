import {React, useContext, useState, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from "react-scroll";

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import GeneralContext from "../contexts/GeneralContext";
import './Navbar.scss';

const Navbar = ({setUser}) => {

  const {storeInfo } = useContext(GeneralContext);
  const [showBar, setShowBar] = useState(false);
  const [showSideNav, setShowSideNav] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 601) {
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
        <div className='logo-name'>
          <img className='logo-image' src={storeInfo.imgUrl} alt="logo" />
          <div className='logo-name'>
            <NavLink className="navlink" to="/">{storeInfo.storeName}</NavLink>
          </div>
        </div>
        <div className="n-right">
          {showSideNav ?
          <div>
            {showBar ? <CloseIcon onClick={() => setShowBar(!showBar)}/> : <MenuIcon onClick={() => setShowBar(!showBar)}/>}
          </div>
          :
          <ul style={{listStyleType: 'none'}}>
            <Link activeClass="active" to="Home" spy={true} smooth={true} offset={-150}>
              <li>Home</li>
            </Link>
            <Link activeClass="active" to="Projects" spy={true} smooth={true} offset={-60}>
              <li>Menu</li>
            </Link>
            <Link activeClass="active" to="Contact" spy={true} smooth={true} offset={-60}>
              <li>Contact Us</li>
            </Link>
          </ul>
          }
        </div>
      </div>
      {showSideNav &&   
      <div className={showBar ? "n-sidebar active" : "n-sidebar"} onClick={() => {setShowBar(false)}}>
        <ul style={{listStyleType: 'none'}}>
          <Link activeClass="active" to="Home" spy={true} smooth={true} onClick={() => {setShowBar(false)}} offset={-150}>
            <li>Home</li>
          </Link>
          <Link activeClass="active" to="Projects" spy={true} smooth={true} onClick={() => {setShowBar(false)}} offset={-80}>
            <li>Menu</li>
          </Link>
          <Link activeClass="active" to="Contact" spy={true} smooth={true} onClick={() => {setShowBar(false)}} offset={-80}>
            <li>Contact Us</li>
          </Link>
        </ul>
      </div>}
    </div>
  )
}

export default Navbar;