import React, { useState } from 'react';
import './profileManagement.css';
import state from '../mockData/state.json';
import skills from '../mockData/skills.json';

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
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      const newSkills = prevData.skills.includes(skillId)
        ? prevData.skills.filter(id => id !== skillId)
        : [...prevData.skills, skillId];
      return {
        ...prevData,
        skills: newSkills
      };
    });
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    if (!formData.availability.includes(date)) {
      setFormData({
        ...formData,
        availability: [...formData.availability, date]
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        availability: '' // Clear any existing error message
      }));
    }
  };

  const removeDate = (date) => {
    setFormData({
      ...formData,
      availability: formData.availability.filter(d => d !== date)
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

    // Check for errors before submitting
    let hasErrors = false;
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'address2' && key !== 'preferences') {
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <form className="profile-container" onSubmit={handleSubmit}>
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
          required
        />
        {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
      </div>

      <div className="form-group">
        <label>Skills:</label>
        <div className="multi-select-dropdown">
          <button
            type="button"
            onClick={toggleDropdown}
            className={errors.skills ? "error" : ""}
          >
            {formData.skills.length === 0 ? 'Select Skills' : `Selected Skills: ${formData.skills.map(skillId => skills.find(skill => skill.id === skillId).name).join(', ')}`}
          </button>
          {dropdownOpen && (
            <div className="multi-select-options">
              {skills.map((skill) => (
                <label key={skill.id}>
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill.id)}
                    onChange={() => handleSkillsChange(skill.id)}
                  />
                  {skill.name}
                </label>
              ))}
            </div>
          )}
        </div>
        {errors.skills && <span className="error-message">{errors.skills}</span>}
      </div>

      <div className="selected-skills">
        {formData.skills.length > 0 ? (
          formData.skills.map((skillId) => {
            const skill = skills.find((s) => s.id === skillId);
            return (
              skill && (
                <div key={skill.id} className="selected-skill">
                  {skill.name}
                </div>
              )
            );
          })
        ) : (
          <div className="placeholder-text">No skills selected</div>
        )}
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
          {formData.availability.length === 0 && errors.availability && (
            <span className="error-message">{errors.availability}</span>
          )}
          {formData.availability.map((date, index) => (
            <div key={index} className="selected-date">
              <span>{date}</span>
              <button type="button" onClick={() => removeDate(date)}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default Profile;
