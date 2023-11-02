import {React, useContext, useState, useEffect} from 'react';
import { NavLink } from 'react-router-dom';

import GeneralContext from "../contexts/GeneralContext";
import './Menu.scss';

const Menu = () => {

  const { menuGroups, menuItems } = useContext(GeneralContext);
  const [selectedGroup, setSelectedGroup] = useState(-1);

  const menuDivs = menuGroups.map((e, i) => {
    return (
      <div key={i} className={i === selectedGroup ? "menu-div menu-div-select" : "menu-div"} onClick={() => {setSelectedGroup(i)}}>{e.group}</div>
    )
  });

  const showItems = menuItems.filter((e) => {
    if (selectedGroup === -1) return e;
    else return (e.groupid - 1 === selectedGroup)
  }).map((row, index) => {

    return (
      <div key={index} className="item-box">
        <NavLink  to={`${row.item.split(' ').join('_')}`}>
          <img 
            src={row.image}
            alt="FoodItem"
            className='food-img'
          />
          <div className='item-name'>
            <p>{row.item}</p>
          </div>
        </NavLink>
      </div>
    )
  });

  return (
    <div className="menu">
      <img
        src="../wave.jpg"
        alt="wave"
        className="wave-img"
      />
      <span className='title'>Our menu, a tasty temptation</span>
      <div className='menu-design'>
        <div className={ selectedGroup === -1 ? "menu-div menu-div-select" : "menu-div"} onClick={() => {setSelectedGroup(-1)}}>All</div>
        {menuDivs}
      </div>
      <div className='show-items-part'>
        {showItems}
      </div>
    </div>
  )
}

export default Menu;