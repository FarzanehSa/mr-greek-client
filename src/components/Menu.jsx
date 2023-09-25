import {React, useContext, useState, useEffect} from 'react';

import GeneralContext from "../contexts/GeneralContext";
import './Menu.scss';

const Menu = () => {

  const { menuGroups } = useContext(GeneralContext);

  const menuDivs = menuGroups.map((e, i) => {
    return (
      <div key={i} className="menu-div">{e.group}</div>
    )
  });

  return (
    <div className="menu">
      <span className='title'>Our menu, a tasty temptation</span>
      <div className='menu-design'>
        {menuDivs}
      </div>
    </div>
  )
}

export default Menu;