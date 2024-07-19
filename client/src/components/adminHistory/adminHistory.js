import React, { useState } from 'react';
import './adminHistory.css';
import fakeEvents from '../mockData/fake_event.json';
import users from '../mockData/fake_users.json';

const AdminHistory = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventParticipants, setEventParticipants] = useState([]);

  const handleEventClick = (eventId) => {
    if (selectedEvent === eventId) {
      setSelectedEvent(null); // Deselect event if already selected
    } else {
      setSelectedEvent(eventId); // Select the clicked event
      fetchEventParticipants(eventId); // Fetch participants for the selected event
    }
  };

  const fetchEventParticipants = async (eventId) => {
    // Assuming the eventId is the same as the event index in the fakeEvents array
    const event = fakeEvents.find(event => event.id === eventId);
    if (event) {
      const participants = event.participants.map(participantId => {
        const user = users.find(u => u.id === participantId);
        return user ? user.fullName : 'Unknown User';
      });
      setEventParticipants(participants);
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
                      {eventParticipants.map((participant, index) => (
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