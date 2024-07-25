import express from 'express';
import db from '../mongoConnect.js';

const router = express.Router();

// Handles user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const usersCollection = db.collection("users");

    // Find the user by email and password
    const user = await usersCollection.findOne({ email, password });

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
  } catch (e) {
    console.error('Error logging in user:', e);
    res.status(500).json({ message: 'An error occurred while logging in the user' });
  }
});

// Handles user registration
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const usersCollection = db.collection("users");

    const userExists = await usersCollection.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const autoIncrement = await usersCollection.find({id: -1}).toArray();
    const newUserId = autoIncrement.map(newID => newID.globalUserId);

    // Create a new user
    const newUser = {
      id: parseInt(newUserId) + 1,
      username,
      password,
      email,
      role: 'user',
      fullName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      skills: [],
      preferences: '',
      availability: [],
      acceptedEvents: [],
      notifications: []
    };

    const result = await usersCollection.insertOne(newUser);

    usersCollection.findOneAndUpdate(
      { id: -1 },
      { $inc: { globalUserId: 1 } },
      { returnOriginal: false, upsert: true }
    );

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: result.insertedId,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
      }
    });
  } catch (e) {
    console.error('Error registering user:', e);
    res.status(500).json({ message: 'An error occurred while registering the user' });
  }
});

export default router;