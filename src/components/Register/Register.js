import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase/firebaseConfig';
import './Register.css';
import users from '../mockData/fake_users.json';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Checks if the user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      alert('User already exists');
      return;
    }

    const newUser = {
      id: users.length + 1,
      username: username,
      email: email,
      password: password,
      role: 'user',
      fullName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      skills: [],
      preferences: '',
      availability: []
    };

    // Adds the new user into mock data
    users.push(newUser);

    // Store the new user in local storage
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));

    // Redirects to homepage
    navigate('/');
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;