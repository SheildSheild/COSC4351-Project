import React, { useState } from 'react';
import './eventManagement.css'; // Update CSS file path as needed
import skills from '../mockData/skills.json'; // Update path to skills data

const Event = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    location: '',
    requiredSkills: [],
    urgency: '',
    eventDate: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    validateInput(name, value);
  };

  const handleSkillsChange = (e) => {
    const { options } = e.target;
    const selectedSkills = [];
    for (const option of options) {
      if (option.selected) {
        selectedSkills.push(option.value);
      }
    }
    setFormData({
      ...formData,
      requiredSkills: selectedSkills
    });
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setFormData({
      ...formData,
      availability: [...formData.availability, date]
    });
  };

  const validateInput = (name, value) => {
    let errorMsg = '';
  
    switch (name) {
      case 'eventName':
        if (value.length > 100) {
          errorMsg = 'Event Name cannot exceed 100 characters.';
        }
        break;
      case 'eventDescription':
        break;
      case 'location':
        break;
      case 'urgency':
        break;
      case 'eventDate':
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg
    }));
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send data to server
    console.log('Form submitted:', formData);
  };

  return (
    <div className="event-container">
      <h1>Event Management</h1>

      <div className="form-group">
        <label>Event Name:</label>
        <input
        type="text"
        name="eventName"
        value={formData.eventName}
        onChange={handleChange}
        required
        maxLength="100"
      />
      {errors.eventName && <span className="error-message">{errors.eventName}</span>}
    </div>

    <div className="form-group">
      <label>Event Description:</label>
      <textarea
        name="eventDescription"
        value={formData.eventDescription}
        onChange={handleChange}
        required
      />
      {errors.eventDescription && <span className="error-message">{errors.eventDescription}</span>}
    </div>

    <div className="form-group">
      <label>Location:</label>
      <textarea
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
      />
      {errors.location && <span className="error-message">{errors.location}</span>}
    </div>

    <div className="form-group">
      <label>Required Skills:</label>
      <select
        name="requiredSkills"
        value={formData.requiredSkills}
        onChange={handleSkillsChange}
        multiple
        required
      >
        {skills.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Urgency:</label>
      <select
        name="urgency"
        value={formData.urgency}
        onChange={handleChange}
        required
      >
        <option value="">Select Urgency</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    <div className="form-group">
      <label>Event Date:</label>
      <input
        type="date"
        name="eventDate"
        value={formData.eventDate}
        onChange={handleDateChange}
        required
      />
      {errors.eventDate && <span className="error-message">{errors.eventDate}</span>}
    </div>

    <button className="save-button" onClick={handleSubmit}>Create Event</button>
  </div>
);
};

export default Event;
