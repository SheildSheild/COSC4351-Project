import React, { useState, useEffect } from 'react';
import states from './states.json';
import skillsData from './skills.json'; // Assuming skills JSON file is in the same directory


const skillsOptions = [
  "Skill 1",
  "Skill 2",
  "Skill 3",
  // Add more skills as needed
];

//user profile structure Initialization
const UserProfileForm = () => {
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

    // State to hold skills options
    const [skillsOptions, setSkillsOptions] = useState([]);

    useEffect(() => {
      // Load skills data from JSON file (or from API if backend is implemented)
      setSkillsOptions(skillsData);
    }, []);
  

 //Update data when there is a change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  //Update skills array
  const handleSkillsChange = (e) => {
    const options = e.target.options;
    const selectedSkills = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selectedSkills.push(options[i].value);
      }
    }
    setFormData({
      ...formData,
      skills: selectedSkills
    });
  };

  //Update date changes
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFormData({
      ...formData,
      availability: [...formData.availability, selectedDate]
    });
  };

  //handles verifing changes
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit}>

      <div>
        <label>Full Name:</label>
        <input 
          type="text" 
          name="fullName" 
          value={formData.fullName} 
          onChange={handleChange} 
          required 
          maxLength="50" 
        />
      </div>

      <div>
        <label>Address 1:</label>
        <input 
          type="text" 
          name="address1" 
          value={formData.address1} 
          onChange={handleChange} 
          required 
          maxLength="100" 
        />
      </div>

      <div>
        <label>Address 2:</label>
        <input 
          type="text" 
          name="address2" 
          value={formData.address2} 
          onChange={handleChange} 
          maxLength="100" 
        />
      </div>

      <div>
        <label>City:</label>
        <input 
          type="text" 
          name="city" 
          value={formData.city} 
          onChange={handleChange} 
          required 
          maxLength="100" 
        />
      </div>

      <div>
        <label>State:</label>
        <select 
          name="state" 
          value={formData.state} 
          onChange={handleChange} 
          required
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Zip Code:</label>
        <input 
          type="text" 
          name="zipCode" 
          value={formData.zipCode} 
          onChange={handleChange} 
          required 
          pattern="\d{5}(-\d{4})?" 
          maxLength="9" 
        />
      </div>

       <div>
        <label>Skills:</label>
        <select 
          name="skills" 
          value={formData.skills} 
          onChange={handleSkillsChange} 
          multiple 
          required
        >
          {skillsOptions.map((skill) => (
            <option key={skill.id} value={skill.name}>
              {skill.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Preferences:</label>
        <textarea 
          name="preferences" 
          value={formData.preferences} 
          onChange={handleChange} 
        />
      </div>

      <div>
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

      <button type="submit">Submit</button>
    </form>
  );
};

export default UserProfileForm;
