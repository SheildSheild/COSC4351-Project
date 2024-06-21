const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/volunteerDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define schema and model
const userProfileSchema = new mongoose.Schema({
  fullName: { type: String, required: true, maxlength: 50 },
  address1: { type: String, required: true, maxlength: 100 },
  address2: { type: String, maxlength: 100 },
  city: { type: String, required: true, maxlength: 100 },
  state: { type: String, required: true, maxlength: 2 },
  zipCode: { type: String, required: true, maxlength: 9 },
  skills: { type: [String], required: true },
  preferences: { type: String },
  availability: { type: [String], required: true }
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

// Routes
app.post('/api/user-profile', async (req, res) => {
  const userProfile = new UserProfile(req.body);
  try {
    await userProfile.save();
    res.status(201).send('Profile created successfully');
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
