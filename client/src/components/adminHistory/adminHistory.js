import React, { useState, useEffect } from 'react';
import './adminHistory.css';

const AdminHistory = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventParticipants, setEventParticipants] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/adminHistory/events');
      const eventsData = await response.json();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEventClick = (eventId) => {
    if (selectedEvent === eventId) {
      setSelectedEvent(null); // Deselect event if already selected
    } else {
      setSelectedEvent(eventId); // Select the clicked event
      fetchEventParticipants(eventId); // Fetch participants for the selected event
    }
  };

  const fetchEventParticipants = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/adminHistory/participants/${eventId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const participants = await response.json();
      setEventParticipants(participants);
    } catch (error) {
      console.error('Error fetching event participants:', error);
      setEventParticipants([]); // Set to an empty array in case of error
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
          {events.map((event) => (
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
                    {eventParticipants.length > 0 ? (
                      <ul>
                        {eventParticipants.map((participant, index) => (
                          <li key={index}>{participant}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No participants for this event.</p>
                    )}
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
