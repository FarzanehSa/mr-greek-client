import { useState, useEffect } from 'react';
import {Routes, Route, useMatch} from 'react-router-dom';

import './App.scss';
import GeneralContext from './contexts/GeneralContext';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {

  const [user, setUser] = useState({});
  const [adminLogin, setAdminLogin] = useState(false);
  const [title, setTitle] = useState("");
  const storeInfo = {
    imgUrl:'../greek-logo.png',
    storeName: 'Mr.Greek Donair'
  };

  const matchDashboard = useMatch('/dashboard/*');

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

  return (
    <div className="App">
      <GeneralContext.Provider value={{ user, storeInfo }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<Home />} />
        </Routes>
        {/* {matchDashboard && (!user.id || user.access !== 0) && <NavbarAdmin zIndex={-1}/>} */}
        {/* {matchDashboard && user.id && !user.access && <NavbarAdmin zIndex={1100}/>} */}
        {!matchDashboard && <Navbar setUser={setUser}/>}
        <Footer />
      </GeneralContext.Provider>
    </div>
  );
}

export default App;
