import React, { useEffect, useState } from 'react';
import './userNotifications.css';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    if (user) {
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const currentUser = storedUsers.find(u => u.id === user.id);
      if (currentUser) {
        setNotifications(currentUser.notifications || []);
      }
    }
  }, [user]);

  return (
    <div className="notifications-container">
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            <div>{notification.message}</div>
            <div>{notification.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserNotifications;
