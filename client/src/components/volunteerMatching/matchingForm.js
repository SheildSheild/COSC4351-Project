import React, { useState } from 'react';
import users from '../mockData/fake_users.json';
import events from '../mockData/fake_event.json';
import skills from '../mockData/skills.json';
import dayjs from 'dayjs';
import './matchingForm.css';

const VolunteerMatchingForm = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [matchingVolunteers, setMatchingVolunteers] = useState([]);

  const isDateInRange = (date, range) => {
    const [start, end] = range.split(' - ').map(dayjs);
    const checkDate = dayjs(date);
    return checkDate.isAfter(start) && checkDate.isBefore(end);
  };

  const getSkillNames = (skillIds) => {
    return skillIds.map(skillId => {
      const skill = skills.find(skill => skill.id === skillId);
      return skill ? skill.name : '';
    }).join(', ');
  };

  const handleEventChange = (event) => {
    const eventId = parseInt(event.target.value);
    const selectedEvent = events.find(e => e.id === eventId);
    setSelectedEvent(selectedEvent);

    const matchedVolunteers = users.filter(user =>
      user.skills.some(skill => selectedEvent.requiredSkills.includes(skill)) &&
      user.availability.some(range => isDateInRange(selectedEvent.date, range))
    );

    setMatchingVolunteers(matchedVolunteers);
  };

  return (
    <div className="volunteer-matching-form">
        <br></br>
        <br></br>
        <br></br>
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
