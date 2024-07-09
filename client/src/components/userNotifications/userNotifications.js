import React, { useEffect, useState } from 'react';
import './userNotifications.css';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/api/notifications/${user.id}`)
        .then(response => response.json())
        .then(data => setNotifications(data))
        .catch(error => console.error('Error fetching notifications:', error));
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
