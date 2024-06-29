import React, { useState } from 'react';
import './eventManagement.css'; // Update CSS file path as needed
import skills from '../mockData/skills.json'; // Update path to skills data
import users from '../mockData/fake_users.json'; // Update path to users data

const Event = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    location: '',
    requiredSkills: [],
    urgency: '',
    eventDate: '',
  });

  const [errors, setErrors] = useState({});
  const [showSkills, setShowSkills] = useState(false); // State to toggle skills visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    validateInput(name, value);
  };

  const handleSkillsChange = (skillId) => {
    setFormData((prevData) => {
      const newSkills = prevData.requiredSkills.includes(skillId)
        ? prevData.requiredSkills.filter(id => id !== skillId)
        : [...prevData.requiredSkills, skillId];
      return {
        ...prevData,
        requiredSkills: newSkills
      };
    });
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setFormData({
      ...formData,
      eventDate: date // Update eventDate directly
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
      // Add validation cases for other fields as needed
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

    // Add a confirmation prompt for the admin
    if (window.confirm('Are you sure you want to create this event?')) {
      // Push the event into the users' notification system
      const currentTime = new Date().toLocaleString();
      const newNotification = {
        message: `New Event: ${formData.eventName}, Date: ${formData.eventDate} | Created at ${currentTime}`,
        date: currentTime,
      };

      // Update users with the new notification
      const storedUsers = JSON.parse(localStorage.getItem('users')) || users;
      const updatedUsers = storedUsers.map(user => ({
        ...user,
        notifications: user.notifications ? [...user.notifications, newNotification] : [newNotification]
      }));

      localStorage.setItem('users', JSON.stringify(updatedUsers));
      alert('Event created successfully! Notifications have been sent to users.');
    }
  };

  const toggleSkills = () => {
    setShowSkills(!showSkills);
  };

  return (
    <div className="event-container">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <h1>Event Management</h1>
      <div className="form-group">
        <label>Event Name: <span className="required">* required</span></label>
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
        <label>Event Description: <span className="required">* required</span></label>
        <textarea
          name="eventDescription"
          value={formData.eventDescription}
          onChange={handleChange}
          required
        />
        {errors.eventDescription && <span className="error-message">{errors.eventDescription}</span>}
      </div>

      <div className="form-group">
        <label>Location: <span className="required">* required</span></label>
        <textarea
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        {errors.location && <span className="error-message">{errors.location}</span>}
      </div>

      <div className="form-group">
        <label>Required Skills: <span className="required">* required</span> </label>
        <div className="multi-select-dropdown">
          <button
            type="button"
            onClick={toggleSkills}
            className={errors.requiredSkills ? "error" : ""}
          >
            {formData.requiredSkills.length === 0 ? 'Select Skills' : `Selected Skills: ${formData.requiredSkills.map(skillId => skills.find(skill => skill.id === skillId).name).join(', ')}`}
          </button>
          {showSkills && (
            <div className="multi-select-options">
              {skills.map((skill) => (
                <label key={skill.id}>
                  <input
                    type="checkbox"
                    checked={formData.requiredSkills.includes(skill.id)}
                    onChange={() => handleSkillsChange(skill.id)}
                  />
                  {skill.name}
                </label>
              ))}
            </div>
          )}
        </div>
        {errors.requiredSkills && <span className="error-message">{errors.requiredSkills}</span>}
      </div>

      <div className="form-group">
        <label>Urgency: <span className="required">* required</span> </label>
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
