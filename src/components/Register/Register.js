import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase/firebaseConfig';
// import './Register.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Registered
        const user = userCredential.user;
        console.log('Registered:', user);
        })
        .catch((error) => {
        console.error('Error registering:', error);
        });
    };

    return (
    <form onSubmit={handleSubmit}>
        <h2>Register</h2>
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
    );
};

export default Register;
