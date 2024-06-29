import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/navBar/navBar';
import LoginPage from './components/Login/Login';
import RegisterPage from './components/Register/Register';
import Profile from './components/ProfileManagement/profileManagement';
import Events from './components/EventManagement/eventManagement';
import UserEventsPage from './components/userEvents/userEvents';
import AdminHistory from './components/adminHistory/adminHistory';
import UserHistory from './components/userHistory/userHistory';
import VolunteerMatchingForm from './components/volunteerMatching/matchingForm';
import logo from './images/volunLogo.png';
import './App.css';

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
  const [update, setUpdate] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false); // State to track logout

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    setUpdate(!update);
    setLoggedOut(true); // Set loggedOut state to true to trigger redirection
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('loggedInUser')));
  }, [update]);

  const isLoggedIn = user != null;
  let links = [["", "Home"], ["Login", "Login"], ["Register", "Register"]];
  if (isLoggedIn) {
    if (user.role === 'admin') {
      links = [["", "Home"], ["Profile", "User Profile"], ["Events", "Event Management"], ["volunteerMatching", "Match Volunteers"], ["AdminHistory", "Volunteer History"], ["Notifications", "Notifications"], ["Logout", "Logout"]];
    } else {
      links = [["", "Home"], ["Profile", "User Profile"], ["UserEventsPage", "View Events"], ["userHistory", "My History"], ["Notifications", "Notifications"], ["Logout", "Logout"]];
    }
  }

  return (
    <Router>
      <Navbar links={links.map(link => link[0] === "Logout" ? { path: link[0], label: link[1], onClick: handleLogout } : { path: link[0], label: link[1] })} />
      <Routes>
        {/* Route for Home */}
        <Route path="/" element={<Home />} />
        
        {/* Route for Login */}
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        
        {/* Route for Register */}
        <Route path="/register" element={<RegisterPage setUpdate={setUpdate}/>} />
        
        {/* Route for Profile */}
        <Route path="/profile" element={<Profile />} />
        
        {/* Route for Events */}
        <Route path="/events" element={<Events />} />
        
        {/* Route for User Events Page */}
        <Route path="/userEventsPage" element={<UserEventsPage />} />
        
        {/* Route for Admin History */}
        <Route path="/AdminHistory" element={<AdminHistory />} />
        
        {/* Route for User History */}
        <Route path="/UserHistory" element={<UserHistory />} />
        
        {/* Route for Volunteer Matching Form */}
        <Route path="/VolunteerMatching" element={<VolunteerMatchingForm />} />

        {/* Conditional rendering of Navigate */}
        {loggedOut && <Navigate to="/" />} 
      </Routes>
    </Router>
  );
}

export default App;
