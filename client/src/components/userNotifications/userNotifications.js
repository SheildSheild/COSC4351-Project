import React, { useEffect, useState } from 'react';
import './userNotifications.css';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [offeredEvents, setOfferedEvents] = useState([]);
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/api/notifications/${user.id}`)
        .then(response => response.json())
        .then(data => {
          setNotifications(data.notifications);
          setOfferedEvents(data.offeredEvents);
        })
        .catch(error => console.error('Error fetching notifications:', error));
    }
  }, [user]);

  const handleAccept = (eventId) => {
    fetch(`http://localhost:3000/api/notifications/${user.id}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Event accepted:', data);
        setOfferedEvents(prevEvents => prevEvents.filter(event => event.eventId !== eventId));
      })
      .catch(error => console.error('Error accepting event:', error));
  };

  const handleDecline = (eventId) => {
    fetch(`http://localhost:3000/api/notifications/${user.id}/decline/${eventId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Event declined:', data);
        setOfferedEvents(prevEvents => prevEvents.filter(event => event.eventId !== eventId));
      })
      .catch(error => console.error('Error declining event:', error));
  };

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

      <h2>Offered Events</h2>
      <ul>
        {offeredEvents.map((event, index) => (
          <li key={index}>
            <div>An admin has assigned you a position at the {event.eventName} event.</div>
            <button onClick={() => handleAccept(event.eventId)}>Accept</button>
            <button onClick={() => handleDecline(event.eventId)}>Decline</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserNotifications;
