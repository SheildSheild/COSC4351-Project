import React, { useState, useEffect } from 'react';
import './matchingForm.css';

const VolunteerMatchingForm = () => {
  const [events, setEvents] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [matchingVolunteers, setMatchingVolunteers] = useState([]);
  const [allSkillsSelected, setAllSkillsSelected] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch events from the server
    fetch('http://localhost:3000/api/volunteer-matching/events')
      .then(response => response.json())
      .then(data => {
        console.log('Events fetched:', data);
        setEvents(data);
      })
      .catch(error => console.error('Error fetching events:', error));

    // Fetch skills from the server
    fetch('http://localhost:3000/api/volunteer-matching/skills')
      .then(response => response.json())
      .then(data => {
        console.log('Skills fetched:', data);
        setSkills(data);
      })
      .catch(error => console.error('Error fetching skills:', error));
  }, []);

  const handleSkillChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    let updatedSelectedSkills;
  
    if (value === 'all') {
      if (isChecked) {
        setSelectedSkills([]);
        setFilteredEvents(events);
      }
      setAllSkillsSelected(isChecked);
    } else {
      updatedSelectedSkills = isChecked
        ? [...selectedSkills, value]
        : selectedSkills.filter(skill => skill !== value);
  
      setSelectedSkills(updatedSelectedSkills);
  
      if (updatedSelectedSkills.length === 0) {
        setAllSkillsSelected(true);
        setFilteredEvents(events);
      } else {
        setAllSkillsSelected(false);
        const filtered = events.filter(event =>
          updatedSelectedSkills.every(skill => event.requiredSkills.includes(parseInt(skill)))
        );
        setFilteredEvents(filtered);
      }
    }
  };

  const handleEventChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(option => parseInt(option.value));
    setSelectedEvents(selectedOptions);

    fetch('http://localhost:3000/api/volunteer-matching/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventIds: selectedOptions})
    })
      .then(response => response.json())
      .then(data => {
        console.log('Matching volunteers fetched:', data);
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm)
  );

  const handleAssignClick = (volunteerId, eventId) => {
    fetch('http://localhost:3000/api/volunteer-matching/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ volunteerId, eventId })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Assignment successful:', data);
        alert(`Volunteer assigned successfully and notification sent.`);
        setMatchingVolunteers(prevVolunteers => prevVolunteers.filter(volunteer => volunteer.id !== volunteerId));
      })
      .catch(error => console.error('Error assigning volunteer:', error));
  };

  return (
    <div className="volunteer-matching-form">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <h1>Volunteer Matching Form</h1>
      <div className="form-section">
        <label htmlFor="skills">Select your desired skills:</label>
        <input
          type="text"
          placeholder="Search for skills..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <div className="checkbox-container">
          <div className="checkbox-item">
            <label>
              <input
                type="checkbox"
                value="all"
                onChange={handleSkillChange}
                checked={allSkillsSelected}
              />
              All
            </label>
          </div>
          {filteredSkills.map(skill => (
            <div key={skill.id} className="checkbox-item">
              <label>
                <input
                  type="checkbox"
                  value={skill.id}
                  onChange={handleSkillChange}
                  checked={selectedSkills.includes(skill.id.toString())}
                />
                {skill.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      {filteredEvents.length > 0 && (
        <div className="form-section">
          <label htmlFor="events">Select events:</label>
          <select
            id="events"
            multiple
            onChange={handleEventChange}
            className="events-dropdown"
          >
            {filteredEvents.map(event => (
              <option key={event.id} value={event.id}>{event.name}</option>
            ))}
          </select>
        </div>
      )}
      {matchingVolunteers.length > 0 && (
        <div className="form-section">
          <h3>Matching Volunteers</h3>
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
                    <td><button className="assign-button" onClick={() => handleAssignClick(volunteer.id, selectedEvents[0])}>Assign</button></td>
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