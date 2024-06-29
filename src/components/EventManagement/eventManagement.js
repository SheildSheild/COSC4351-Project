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
    eventDate: '',
    availability: [] // Include availability in the initial state
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
  
    // Check for errors before submitting
    let hasErrors = false;
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (True) {
        validateInput(key, formData[key]);
        if (formData[key] === '' || errors[key]) {
          hasErrors = true;
          if (formData[key] === '') {
            newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
          }
        }
      }
    });
  
    // Check if skills are selected
    if (formData.skills.length === 0) {
      newErrors.skills = 'Skills are required.';
      hasErrors = true;
    }
  
    if (!hasErrors) {
      console.log('Form submitted successfully!', formData);
      // Here, you can handle the form submission, such as sending data to an API.
    } else {
      console.log('Form has errors.');
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...newErrors
      }));
    }
  };

  const toggleSkills = () => {
    setShowSkills(!showSkills);
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
