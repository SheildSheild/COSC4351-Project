import React, { useState, useEffect } from 'react';
import './adminNotifications.css';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/notifications/admin')
      .then(response => response.json())
      .then(data => setNotifications(data))
      .catch(error => console.error('Error fetching notifications:', error));
  }, []);

  return (
    <div className="admin-notifications">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <h2>Admin Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            <strong>{notification.user}</strong> signed up for <strong>{notification.event}</strong> at <em>{notification.time}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminNotifications;
