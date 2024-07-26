import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './adminNotifications.css';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:3000/api/notifications/${user.id}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data.notifications)) {
            setNotifications(data.notifications);
          } else {
            console.error('Expected array but received:', data);
          }
        })
        .catch(error => console.error('Error fetching notifications:', error));
    } else {
      console.error('User ID not found in localStorage');
    }
  }, [user]);
  

  const handleDelete = async (id) => {
    console.log('Deleting notification with ID:', id);  // Log the ID
    try {
      const response = await fetch(`http://localhost:3000/api/notifications/${user.id}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }

      setNotifications(user.notifications.filter(notification => notification.id !== id));
      const data = await response.json();
      console.log('Delete successful:', data);

      // Remove the deleted notification from the state
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  

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
              <h3>{notification.message} at {dayjs(notification.date).format('MMMM D, YYYY h:mm A')}</h3>
              <button onClick={() => handleDelete(index)}>Acknowledge</button>
            </li>
        ))}
      </ul>
    </div>
  );
  
};

export default AdminNotifications;
