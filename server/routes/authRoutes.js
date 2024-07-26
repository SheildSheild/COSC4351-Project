import express from 'express';
import db from '../mongoConnect.js';
// import connectToDatabase from '../mongoConnect.js'; // Commented out due to differences in mongoConnect.js
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const router = express.Router();

const jwtSecret = 'my_secret'; // Replace with your secret
const jwtExpiresIn = '1h'; // Token expiry time

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "coscverify4353@gmail.com", // 
    pass: "rqdp emcy ugdu pqvg" // 
  }
});

// Handles user registration
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // const db = await connectToDatabase(); // Commented out due to differences in mongoConnect.js
    const usersCollection = db.collection("users");

    const userExists = await usersCollection.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Find the last user ID and increment
    const lastUser = await usersCollection.findOne({}, { sort: { id: -1 } });
    const newUserId = lastUser ? lastUser.id + 1 : 1;

    // Create a new user
    const newUser = {
      id: newUserId,
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
      offeredEvents: [],
      notifications: [],
      verified: false
    };

    const result = await usersCollection.insertOne(newUser);

    // Verification token
    const token = jwt.sign({ userId: newUserId, email }, jwtSecret, { expiresIn: jwtExpiresIn });

    const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${token}`;
    const mailOptions = {
      from: 'coscverify4353@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: ${verificationUrl}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending verification email' });
      }
      console.log('Email sent:', info.response);
      res.status(201).json({
        message: 'Registration successful. Please check your email for verification link.',
        user: {
          id: result.insertedId,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role
        }
      });
    });
  } catch (e) {
    console.error('Error registering user:', e);
    res.status(500).json({ message: 'An error occurred while registering the user' });
  }
});

// Handles email verification
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);
    const { userId, email } = decoded;

    // const db = await connectToDatabase(); // Commented out due to differences in mongoConnect.js
    const usersCollection = db.collection("users");

    // Find the user and update the verified status
    const result = await usersCollection.updateOne(
      { id: userId, email },
      { $set: { verified: true } }
    );

    if (result.matchedCount > 0) {
      res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } else {
      res.status(404).json({ message: 'User not found or already verified.' });
    }
  } catch (e) {
    console.error('Error verifying email:', e);
    res.status(500).json({ message: 'An error occurred while verifying email' });
  }
});


// Handles user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // const db = await connectToDatabase(); // Commented out due to differences in mongoConnect.js
    const usersCollection = db.collection("users");

    // Find the user by email and password
    const user = await usersCollection.findOne({ email, password });

    if (user) {
      if (!user.verified) {
        return res.status(403).json({ message: 'Email not verified. Please check your email.' });
      }
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

export default router;