import React, { useState } from 'react';
import './profileManagement.css';
import state from './state.json';
import skills from './skills.json';

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    skills: [],
    preferences: '',
    availability: []
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
      skills: selectedSkills
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
      case 'fullName':
        if (value.length > 50) {
          errorMsg = 'Full Name cannot exceed 50 characters.';
        }
        break;
      case 'address1':
        if (value.length > 100) {
          errorMsg = 'Address 1 cannot exceed 100 characters.';
        }
        break;
      case 'address2':
        if (value.length > 100) {
          errorMsg = 'Address 2 cannot exceed 100 characters.';
        }
        break;
      case 'city':
        if (value.length > 100) {
          errorMsg = 'City cannot exceed 100 characters.';
        }
        break;
      case 'zipCode':
        if (!isValidZipCode(value)) {
          errorMsg = 'Invalid ZIP Code format.';
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg
    }));
  };

  const isValidZipCode = (value) => {
    // Allow either standard 5-digit ZIP code or ZIP+4 (5 digits followed by a dash and 4 digits)
    return /^\d{5}(-\d{4})?$/.test(value);
  };

  const handleZipCodeChange = (e) => {
    let { value } = e.target;
    // Remove non-numeric characters
    value = value.replace(/\D/g, '');

    // Format ZIP code with hyphen for ZIP+4 if necessary
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }

    setFormData({
      ...formData,
      zipCode: value
    });
    validateInput('zipCode', value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send data to server
    console.log('Form submitted:', formData);
  };

  return (
    <div className="profile-container">
      <h1>Profile Management</h1>

      <div className="form-group">
        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          maxLength="50"
        />
        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
      </div>

      <div className="form-group">
        <label>Address 1:</label>
        <input
          type="text"
          name="address1"
          value={formData.address1}
          onChange={handleChange}
          required
          maxLength="100"
        />
        {errors.address1 && <span className="error-message">{errors.address1}</span>}
      </div>

      <div className="form-group">
        <label>Address 2:</label>
        <input
          type="text"
          name="address2"
          value={formData.address2}
          onChange={handleChange}
          maxLength="100"
        />
        {errors.address2 && <span className="error-message">{errors.address2}</span>}
      </div>

      <div className="form-group">
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          maxLength="100"
        />
        {errors.city && <span className="error-message">{errors.city}</span>}
      </div>

      <div className="form-group">
        <label>State:</label>
        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        >
          <option value="">Select State</option>
          {state.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>ZIP Code:</label>
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleZipCodeChange}
          maxLength="10"
          placeholder="Enter ZIP or ZIP+4"
        />
        {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
      </div>

      <div className="form-group">
        <label>Skills:</label>
        <select
          name="skills"
          value={formData.skills}
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
        <label>Preferences:</label>
        <textarea
          name="preferences"
          value={formData.preferences}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Availability:</label>
        <input
          type="date"
          name="availability"
          onChange={handleDateChange}
        />
        <div>
          {formData.availability.map((date, index) => (
            <span key={index}>{date} </span>
          ))}
        </div>
      </div>

      <button className="save-button" onClick={handleSubmit}>Save Changes</button>
    </div>
  );
};

export default Profile;
