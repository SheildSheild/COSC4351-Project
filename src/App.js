import React from 'react';
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
  const links = [["", "Home"], ["Login", "Login"], ["Register", "Register"], ["Profile", "Profile"], ["Events", "Events"]];
  return (
    <Router>
      <div>
        <Navbar links={links} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
