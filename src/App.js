import { useState, useEffect } from 'react';
import {Routes, Route, useMatch} from 'react-router-dom';
import Modal from 'react-modal';

import { API_BASE_URL } from './config';
import './App.scss';
import GeneralContext from './contexts/GeneralContext';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLogin from './components/dashboard/AdminLogin'
import NavbarAdmin from './components/dashboard/NavbarAdmin'

function App() {

  const [user, setUser] = useState({});
  const [adminLogin, setAdminLogin] = useState(false);
  const [title, setTitle] = useState("");
  const storeInfo = {
    imgUrl:'../greek-logo.png',
    storeName: 'Mr.Greek Donair',
    address: '2285 Commercial Dr, Vancouver, BC V5N 4B6',
    tel: '(604) 620-6682'
  };

  const url = API_BASE_URL;

  const matchDashboard = useMatch('/dashboard/*');

  useEffect(() => {
    console.log('Mr.Greek Donair, 💫 v.01 ');

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
    }

    // const f1 = axios.get(`${url}/api/stylists`);
    // const f2 = axios.get(`${url}/api/service-groups`);
    // const f3 = axios.get(`${url}/api/spec/storeinfo`);


    // Promise.all([f1, f2, f3])
    //   .then(([r1, r2, r3]) => {
    //     setTimeTable(r2.data.timeTable);
    //     setStylists(prev => r1.data.stylists);
    //     setAvailability(prev => r1.data.availability);
    //     setServiceGroups(prev => r2.data.groups);
    //     setServices(prev => r2.data.services);
    //     setStoreInfo(prev => r3.data.storeInfo);
    //   });
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
      <GeneralContext.Provider value={{ user, storeInfo, url }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<Home />} />
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
        {matchDashboard && user.id  && <NavbarAdmin zIndex={1100}/>}
        {!matchDashboard && <Navbar setUser={setUser}/>}
        <Footer storeInfo={storeInfo}/>
      </GeneralContext.Provider>
    </div>
  );
}

export default App;
