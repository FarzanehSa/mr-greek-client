import { useState, useEffect } from 'react';
import {Routes, Route, useMatch} from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

import { API_BASE_URL } from './config';
import './App.scss';
import GeneralContext from './contexts/GeneralContext';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Menu from './components/Menu';
import FoodItem from './components/FoodItem';
import AdminLogin from './components/dashboard/AdminLogin';
import NavbarAdmin from './components/dashboard/NavbarAdmin';
import Dashboard from './components/dashboard/Dashboard';
import MenuGroupDashboard from './components/dashboard/MenuGroupDashboard';
import MenuItemDashboard from './components/dashboard/MenuItemDashboard';

function App() {

  const [user, setUser] = useState({});
  const [adminLogin, setAdminLogin] = useState(false);
  const [title, setTitle] = useState("");

  const [menuGroups, setMenuGroups] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [allFeatures, setAllFeatures] = useState([]);

  const storeInfo = {
    imgUrl:'../greek-logo.png',
    storeName: 'Mr.Greek Donair',
    address: '2285 Commercial Dr, Vancouver, BC V5N 4B6',
    tel: '(604) 620-6682'
  };

  console.log("📗", menuGroups);
  console.log("🥙", menuItems);
  console.log(allFeatures);

  const url = API_BASE_URL;

  const matchDashboard = useMatch('/dashboard/*');

  useEffect(() => {
    console.log('Mr.Greek Donair, 💫 v.01 ');

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
    }

    const f1 = axios.get(`${url}/api/menu-groups`);
    const f2 = axios.get(`${url}/api/menu-items`);
    const f3 = axios.get(`${url}/api/features`);

    // const f3 = axios.get(`${url}/api/spec/storeinfo`);


    Promise.all([f1, f2, f3])
      .then(([r1, r2, r3]) => {
        setMenuGroups(prev => r1.data.groups);
        setMenuItems(prev => r2.data.items);
        setAllFeatures(prev => r3.data.features);
      });
    }, []); // eslint-disable-line

  useEffect(() => {
    document.title = title;
  },[title]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
    if (matchDashboard) {
      setTitle("Online Booking Dashboard");
      if (!user.id || user.access !== 0) {
        setAdminLogin(true);
      } 
      else {
        setAdminLogin(false);
      }
    } else {
      setTitle("Online Booking");
      setAdminLogin(false);
    }
  }, [user, matchDashboard]);

  function closeModal() {
    setAdminLogin(false);
  }

  return (
    <div className="App">
      <GeneralContext.Provider value={{ user, storeInfo, url, menuGroups, menuItems }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<FoodItem />} />

          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/dashboard/menu-group' element={<MenuGroupDashboard setMenuGroups={setMenuGroups}/>} />
          <Route path='/dashboard/menu-item' element={<MenuItemDashboard setMenuItems={setMenuItems} allFeatures={allFeatures}/>}/>
        </Routes>
        <Modal
          isOpen={adminLogin}
          onRequestClose={closeModal}
          appElement={document.getElementById('root')}
          className="admin-login"
          shouldCloseOnOverlayClick={false}
        >
          {adminLogin && <AdminLogin onClose={closeModal} setUser={setUser}/>}
        </Modal>
        {/* {matchDashboard && (!user.id || user.access !== 0) && <NavbarAdmin zIndex={-1}/>} */}
        {matchDashboard && user.id  && <NavbarAdmin zIndex={1100} setUser={setUser}/>}
        {!matchDashboard && <Navbar setUser={setUser}/>}
        <Footer storeInfo={storeInfo}/>
      </GeneralContext.Provider>
    </div>
  );
}

export default App;
