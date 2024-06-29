import React, { useState, useEffect } from 'react';
import './adminNotifications.css';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    setNotifications(storedNotifications);
  }, []);

  return (
    <div className="admin-notifications">
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
