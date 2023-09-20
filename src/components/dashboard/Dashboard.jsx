import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './Dashboard.scss';

const Dashboard = () => {

  return (
    <div className="dashboard-page">
      <NavLink to="/dashboard/setting" tabIndex="-1">
        <button className="btn-setting">
          <div className="sign"><FontAwesomeIcon icon="fa-solid fa-gear" /></div>
          <span>Setting</span>
        </button>
      </NavLink>
      <NavLink to="/dashboard/menu-group" tabIndex="-1">
        <button className="btn-setting">
          <div className="sign"><FontAwesomeIcon icon="fa-solid fa-gear" /></div>
          <span>Menu Groups</span>
        </button>
      </NavLink>
      <NavLink to="/dashboard/menu-item" tabIndex="-1">
        <button className="btn-setting">
          <div className="sign"><FontAwesomeIcon icon="fa-solid fa-gear" /></div>
          <span>Menu Item</span>
        </button>
      </NavLink>
    </div>
  )
}

export default Dashboard;