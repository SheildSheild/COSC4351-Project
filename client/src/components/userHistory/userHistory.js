import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './userHistory.css';

const UserHistory = () => {
  const [acceptedEvents, setAcceptedEvents] = useState([]);
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:3000/api/history/${user.id}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setAcceptedEvents(data);
          }
        })
        .catch(error => console.error('Error fetching user history:', error));
    }
  }, [user]);

  return (
    <div className="user-history-page">
      <br></br>
      <br></br>
      <h2>My Volunteer History</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Event Date</th>
              <th>Sign-Up Time</th>
            </tr>
          </thead>
          <tbody>
            {acceptedEvents.length > 0 ? (
              acceptedEvents.map((event, index) => (
                <tr key={index}>
                  <td>{event.eventName}</td>
                  <td>{dayjs(event.eventDate).format('MMMM D, YYYY')}</td>
                  <td>{dayjs(event.signUpTime).format('MMMM D, YYYY HH:mm:ss')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No events signed up yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserHistory;