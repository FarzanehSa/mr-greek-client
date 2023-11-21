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
import Contact from './components/Contact';
import FoodItem from './components/FoodItem';
import AdminLogin from './components/dashboard/AdminLogin';
import NavbarAdmin from './components/dashboard/NavbarAdmin';
import Dashboard from './components/dashboard/Dashboard';
import StoreSettingDashboard from './components/dashboard/StoreSettingDashboard';
import MenuGroupDashboard from './components/dashboard/MenuGroupDashboard';
import MenuItemDashboard from './components/dashboard/MenuItemDashboard';

function App() {

  const [user, setUser] = useState({});
  const [adminLogin, setAdminLogin] = useState(false);
  const [title, setTitle] = useState("");

  const [menuGroups, setMenuGroups] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [allFeatures, setAllFeatures] = useState([]);

  const [storeInfo, setStoreInfo] = useState({storename:"", logo:"", address:"", tel:""});
  const [slides, setSlides] = useState([]);

  console.log("📗", menuGroups);
  console.log("🥙", menuItems);
  console.log("🏪", storeInfo);

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
    const f4 = axios.get(`${url}/api/store-settings`);

    // const f3 = axios.get(`${url}/api/spec/storeinfo`);


    Promise.all([f1, f2, f3, f4])
      .then(([r1, r2, r3, r4]) => {
        setMenuGroups(prev => r1.data.groups);
        setMenuItems(prev => r2.data.items);
        setAllFeatures(prev => r3.data.features);
        setStoreInfo(prev => r4.data.settings[0]);
        setSlides(prev => r4.data.newSlides);
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
          <Route path="/" element={<Home slides={slides}/>} />
          <Route path="/*" element={<Home slides={slides}/>} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<FoodItem allFeatures={allFeatures}/>} />
          <Route path="/contact" element={<Contact storeInfo={storeInfo}/>} />

          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/dashboard/store-setting' element={<StoreSettingDashboard storeInfo={storeInfo} setStoreInfo={setStoreInfo} slides={slides} setSlides={setSlides}/>} />
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
