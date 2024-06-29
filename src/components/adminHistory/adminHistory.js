import React, { useState } from 'react';
import './adminHistory.css';
import fakeEvents from '../mockData/fake_event.json';

const AdminHistory = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (eventId) => {
    if (selectedEvent === eventId) {
      setSelectedEvent(null); // Deselect event if already selected
    } else {
      setSelectedEvent(eventId); // Select the clicked event
    }
  };

  return (
    <div className="admin-history-container">
      <h1>Volunteer History</h1>
      <table className="event-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Location</th>
            <th>Date</th>
            <th>Urgency</th>
          </tr>
        </thead>
        <tbody>
          {fakeEvents.map((event) => (
            <React.Fragment key={event.id}>
              <tr onClick={() => handleEventClick(event.id)} className={selectedEvent === event.id ? 'selected' : ''}>
                <td>{event.id}</td>
                <td>{event.name}</td>
                <td>{event.description}</td>
                <td>{event.location}</td>
                <td>{event.date}</td>
                <td>{event.urgency.name}</td>
              </tr>
              {selectedEvent === event.id && (
                <tr className="participants-row">
                  <td colSpan="6">
                    <ul>
                      {event.participants.map((participant, index) => (
                        <li key={index}>{participant}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHistory;
