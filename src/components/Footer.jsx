import React from "react";

import "./Footer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
library.add(faGithub, faLinkedin);

function Footer({storeInfo}) {

  return (
    <div className="footer-bar">
      <img src={storeInfo.logo} alt='logo' className="logo"/>
      <span className="address">
        {storeInfo.address}
      </span>
      <span className="tel">
        {storeInfo.tel}
      </span>
      <span className="copywrite">
        {/* ©2023 Mr.Greek Donair | All rights Reserved. */}
        Handcrafted by Farzaneh &ensp;
        <a href="https://github.com/FarzanehSa/" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon="fa-brands fa-github" className='h-icon'/>
        </a>,  ©2023
      </span>
    </div>
  );
}

export default Footer;
