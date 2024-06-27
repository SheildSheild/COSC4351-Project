import React from 'react';
import './adminHistory.css'; // Ensure you have appropriate CSS styles
import fakeEvents from '../mockData/fake_event.json'; // Adjust the path as per your file structure

const AdminHistory = () => {
  return (
    <div className="admin-history-container">
      <h2 className='volunteer-history-heading'>Volunteer History</h2>
      {fakeEvents.map((event) => (
        <div key={event.id} className="event-box">
          <div className="event-info">
            <div><strong>Event Name:</strong> {event.name}</div>
            <div><strong>Description:</strong> {event.description}</div>
            <div><strong>Location:</strong> {event.location}</div>
            <div><strong>Date:</strong> {event.date}</div>
            <div><strong>Urgency:</strong> {event.urgency.name}</div>
          </div>
          <hr className="line" />
        </div>
      ))}
    </div>
  );
};

export default AdminHistory;
