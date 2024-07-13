import React, { useState, useEffect } from 'react';
import './adminNotifications.css';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:3000/api/notifications/${user.id}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setNotifications(data);
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
      const response = await fetch(`http://localhost:3000/api/notifications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }

      const data = await response.json();
      console.log('Delete successful:', data);

      // Remove the deleted notification from the state
      setNotifications(user.notifications.filter(notification => notification.id !== id));
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
        {user.notifications.map(notification => (
          <li key={notification.id}>
            <strong>{notification.user}</strong> signed up for <strong>{notification.event}</strong> at <em>{notification.time}</em>
            <button onClick={() => handleDelete(notification.id)}>Acknowledge</button>
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default AdminNotifications;
