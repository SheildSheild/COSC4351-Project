import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Load users from fake_users.json
const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

// Handle user login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Handle user registration
router.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  // Check if the user already exists
  const userExists = users.some(u => u.email === email);

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user with basic information
  const newUser = {
    id: users.length + 1,
    username,
    password,
    email,
    role: 'user', // default role, can be changed later
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    skills: [],
    preferences: '',
    availability: [],
    acceptedEvents: []
  };

  // Add the new user to the users array
  users.push(newUser);

  // Write updated users array back to the file
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  res.status(201).json({
    message: 'Registration successful',
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role
    }
  });
});

export default router;