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
  const [sidebar, setSidebar] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 601) {
        setMobile(true);
      } else {
        setMobile(false);
        setSidebar(false);
      }
    }
    
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);


  return (

    <div className={!mobile && sidebar ? "n-wrapper-hidden" : "n-wrapper"}>
      <div className="n-row">
        <div className='logo-name'>
          <img className='logo-image' src={storeInfo.imgUrl} alt="logo" />
          <div className='logo-name'>
            <NavLink className="navlink" to="/">{storeInfo.storeName}</NavLink>
          </div>
          </div>
        <div className="n-right">
          {mobile ?
          <div>
            {sidebar ? <CloseIcon onClick={() => setSidebar(!sidebar)}/> : <MenuIcon onClick={() => setSidebar(!sidebar)}/>}
          </div>
          :
          <ul style={{listStyleType: 'none'}}>
            <Link activeClass="active" to="Home" spy={true} smooth={true} offset={-150}>
              <li>Home</li>
            </Link>
          <Link activeClass="active" to="About" spy={true} smooth={true} offset={-60}>
            <li>About</li>
          </Link>
          <Link activeClass="active" to="Skills" spy={true} smooth={true} offset={-60}>
            <li>Skills</li>
          </Link>
          <Link activeClass="active" to="Projects" spy={true} smooth={true} offset={-60}>
            <li>Projects</li>
          </Link>
          <Link activeClass="active" to="Contact" spy={true} smooth={true} offset={-60}>
            <li>Contact</li>
          </Link>
        </ul>
        }
      </div>
    </div>
    {mobile &&   
    <div className={sidebar ? "n-sidebar active" : "n-sidebar"} onClick={() => {setSidebar(false)}}>
      <ul style={{listStyleType: 'none'}}>
        <Link activeClass="active" to="Home" spy={true} smooth={true} onClick={() => {setSidebar(false)}} offset={-150}>
          <li>Home</li>
        </Link>
        <Link activeClass="active" to="About" spy={true} smooth={true} onClick={() => {setSidebar(false)}} offset={-80}>
          <li>About</li>
        </Link>
        <Link activeClass="active" to="Skills" spy={true} smooth={true} onClick={() => {setSidebar(false)}} offset={-80}>
          <li>Skills</li>
        </Link>
        <Link activeClass="active" to="Projects" spy={true} smooth={true} onClick={() => {setSidebar(false)}} offset={-80}>
          <li>Projects</li>
        </Link>
        <Link activeClass="active" to="Contact" spy={true} smooth={true} onClick={() => {setSidebar(false)}} offset={-80}>
          <li>Contact</li>
        </Link>
      </ul>
    </div>}
  </div>
  )
}

export default Navbar;