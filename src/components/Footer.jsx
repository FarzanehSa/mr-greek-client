import React from "react";

import "./Footer.scss";

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
        ©2023 Mr.Greek Donair | All rights Reserved.
      </span>
    </div>
  );
}

export default Footer;
