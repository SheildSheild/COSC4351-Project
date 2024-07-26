import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import db from '../mongoConnect.js';

const router = express.Router();

// Route to sign up a user for an event
router.post('/', async (req, res) => {
  const { userId, eventId } = req.body;

  if (!userId || !eventId) {
    return res.status(400).json({ message: 'User ID and Event ID are required' });
  }

  try {
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
      id: uuidv4(),
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
