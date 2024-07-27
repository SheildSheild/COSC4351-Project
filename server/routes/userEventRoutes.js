import express from 'express';
import dayjs from 'dayjs';
// import db from '../mongoConnect.js';
import connectToDatabase from '../mongoConnect.js'; // Commented out due to differences in mongoConnect.js

const router = express.Router();

// Gets the user's information
router.get('/:userId', async (req, res) => {
  const {userId} = req.params;

  try {
    const db = await connectToDatabase(); // Commented out due to differences in mongoConnect.js
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ id: parseInt(userId)});
    if (!user){
      return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json(user);
  } catch (e) {
    console.error('Error fetching user:', e);
    res.status(500).json({ message: 'An error occurred while fetching user' });
  }
});

// Route to sign up a user for an event
router.post('/', async (req, res) => {
  const { userId, eventId } = req.body;

  if (!userId || !eventId) {
    return res.status(400).json({ message: 'User ID and Event ID are required' });
  }

  try {
    const db = await connectToDatabase(); // Commented out due to differences in mongoConnect.js
    const usersCollection = db.collection("users");
    const eventsCollection = db.collection("events");

    const user = await usersCollection.findOne({ id: parseInt(userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const event = await eventsCollection.findOne({ id: parseInt(eventId) });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const currentTime = dayjs().toISOString();

    // Update user with the event they signed up for
    await usersCollection.updateOne(
      { id: parseInt(userId) },
      { $push: { acceptedEvents: { eventId: parseInt(eventId), signUpTime: currentTime } } }
    );

    // Update notifications for all admin users
    const newNotification = {
      user: user.fullName,
      event: event.name,
      time: currentTime,
    };

    await usersCollection.updateMany(
      { role: 'admin' },
      { $push: { notifications: newNotification } }
    );

    res.status(200).json({ message: 'User signed up for event successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the database' });
  }
});

export default router;