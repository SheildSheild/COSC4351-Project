import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './matchingForm.css';

const VolunteerMatchingForm = () => {
  const [events, setEvents] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [matchingVolunteers, setMatchingVolunteers] = useState([]);

  useEffect(() => {
    // Fetch events from the server
    fetch('/api/volunteer-matching/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
    
    // Fetch skills from the server
    fetch('/api/volunteer-matching/skills')
      .then(response => response.json())
      .then(data => setSkills(data))
      .catch(error => console.error('Error fetching skills:', error));
  }, []);

  const handleEventChange = (event) => {
    const eventId = parseInt(event.target.value);
    fetch(`/api/volunteer-matching/match/${eventId}`)
      .then(response => response.json())
      .then(data => {
        setSelectedEvent(data.event);
        setMatchingVolunteers(data.volunteers);
      })
      .catch(error => console.error('Error fetching matching volunteers:', error));
  };

  const getSkillNames = (skillIds) => {
    return skillIds.map(skillId => {
      const skill = skills.find(skill => skill.id === skillId);
      return skill ? skill.name : '';
    }).join(', ');
  };

  return (
    <div className="volunteer-matching-form">
      <br />
      <br />
      <br />
      <div className="dropdown-container">
        <select onChange={handleEventChange}>
          <option value="">Select an event</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
      </div>
      {selectedEvent && (
        <div>
          <h3>Matching Volunteers for {selectedEvent.name}</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Skills</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {matchingVolunteers.map(volunteer => (
                  <tr key={volunteer.id}>
                    <td>{volunteer.fullName}</td>
                    <td>{getSkillNames(volunteer.skills)}</td>
                    <td><button className="assign-button">Assign</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerMatchingForm;