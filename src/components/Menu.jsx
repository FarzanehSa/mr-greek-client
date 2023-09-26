import {React, useContext, useState, useEffect} from 'react';

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
    else return (e.groupid === selectedGroup)
  }).map((row, index) => {

    return (
      <div>
        <img 
          src={row.image}
          alt="FoodItem"
          width="100"
          height="100"
        />
        <p>{row.item}</p>
      </div>
    )

  })

  console.log(showItems);

  return (
    <div className="menu">
      <span className='title'>Our menu, a tasty temptation</span>
      <div className='menu-design'>
        <div className={ selectedGroup === -1 ? "menu-div menu-div-select" : "menu-div"} onClick={() => {setSelectedGroup(-1)}}>All</div>
        {menuDivs}
      </div>
      <div>
        {showItems}
      </div>
    </div>
  )
}

export default Menu;