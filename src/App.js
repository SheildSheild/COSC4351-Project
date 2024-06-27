import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navBar/navBar';
import LoginPage from './components/Login/Login';
import RegisterPage from './components/Register/Register';
import Profile from './components/ProfileManagement/profileManagement';
import Events from './components/EventManagement/eventManagement';
import logo from './images/volunLogo.png';
import './App.css';

const { TextDecoder, TextEncoder } = require('util');
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-Logo" alt="logo"/>
        <h3>Welcome!</h3>
      </header>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('loggedInUser')));

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('loggedInUser')));
  }, []);
  
  const isLoggedIn = user != null;
  let links = [["", "Home"], ["Login", "Login"], ["Register", "Register"]];
  if (isLoggedIn) {
    if (user.role === 'admin') {
      links = [["", "Home"], ["Profile", "User Profile"], ["Events", "Event Management"], ["adminHistory", "Volunteer History"], ["Notifications", "Notifications"], ["Logout", "Logout"]];
    } else {
      links = [["", "Home"], ["Profile", "User Profile"], ["userHistory", "My History"], ["Notifications", "Notifications"], ["Logout", "Logout"]];
    }
  }

  return (
    <Router>
      <Navbar links={links.map(link => link[0] === "Logout" ? { path: link[0], label: link[1], onClick: handleLogout } : { path: link[0], label: link[1] })} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<Events />} />
      </Routes>
    </Router>
  );
}

export default App;