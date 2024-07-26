import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../mongoConnect.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get notifications for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  const usersCollection = db.collection("users");
  const eventsCollection = db.collection("events");
  const events = await eventsCollection.find({id: { $ne: -1 }}).toArray();
  const user = await usersCollection.findOne({ id: parseInt(userId) });

  if(user && user.role == 'user'){
    if (user) {
      const offeredEventsDetails = user.offeredEvents.map(eventId => {
        const event = events.find(e => e.id === eventId);
        return {
          eventId: event.id,
          eventName: event.name
        };
      });

      res.status(200).json({
        notifications: user.notifications || [],
        offeredEvents: offeredEventsDetails
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else if(user && user.role == 'admin'){
    if (user) {
      res.status(200).json({
        notifications: Array.isArray(user.notifications) ? user.notifications : []
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }
});

// Send a notification
router.post('/', (req, res) => {

  const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
  let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

  const { userId, message } = req.body;
  const user = users.find(u => u.id === parseInt(userId));

  if (user) {
    const currentTime = new Date().toLocaleString();
    const newNotification = {
      message,
      date: currentTime,
    };

    user.notifications = user.notifications ? [...user.notifications, newNotification] : [newNotification];

    // Update the users file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.status(201).json({ message: 'Notification sent successfully', notification: newNotification });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Deletes a user's selected notification
router.delete('/:userId/:index', async (req, res) => {
  const { userId, index } = req.params;

  const usersCollection = db.collection("users");

  try {
    // Convert index to integer
    const notificationIndex = parseInt(index);

    // Find the user by userId
    const user = await usersCollection.findOne({ id: parseInt(userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.notifications || user.notifications.length <= notificationIndex || notificationIndex < 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Remove the notification by index
    user.notifications.splice(notificationIndex, 1);

    // Update the user's notifications array
    await usersCollection.updateOne(
      { id: parseInt(userId) },
      { $set: { notifications: user.notifications } }
    );

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (e) {
    console.error('Error deleting notification:', e);
    res.status(500).json({ message: 'An error occurred while deleting the notification' });
  }
});


// Accepting offered events
router.post('/:userId/accept', async (req, res) => {
  const { userId } = req.params;
  const { eventId } = req.body;
  const currentTime = new Date().toISOString();

  const usersCollection = db.collection("users");
  const eventsCollection = db.collection("events");

  try {
    // Find the user by userId
    const user = await usersCollection.findOne({ id: parseInt(userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the event is in the offeredEvents array
    if (!user.offeredEvents.includes(parseInt(eventId))) {
      return res.status(400).json({ message: 'Event not found in offered events' });
    }

    const event = await eventsCollection.findOne({ id: parseInt(eventId) });
    const newNotification = {
      message: `${user.fullName} has accepted the offered event: ${event.name}`,
      date: currentTime,
    };

    // Add the event to the acceptedEvents array and remove it from the offeredEvents array
    await usersCollection.updateOne(
      { id: parseInt(userId) },
      {
        $push: { acceptedEvents: { eventId: parseInt(eventId), signUpTime: currentTime } },
        $pull: { offeredEvents: parseInt(eventId) }
      }
    );

    // Find all admin users
    const admins = await usersCollection.find({ role: 'admin' }).toArray();

    // Send notification to all admins
    await Promise.all(admins.map(admin => 
      usersCollection.updateOne(
        { id: admin.id },
        { $push: { notifications: newNotification } }
      )
    ));

    res.status(200).json({ message: 'Event accepted and notifications sent to admins' });
  } catch (e) {
    console.error('Error accepting event:', e);
    res.status(500).json({ message: 'An error occurred while accepting the event' });
  }
});

// Declining offered events
router.delete('/:userId/decline/:eventId', async (req, res) => {
  const { userId, eventId } = req.params; // Extract userId and eventId from request parameters

  const usersCollection = db.collection("users");

  try {
    // Find the user by userId
    const user = await usersCollection.findOne({ id: parseInt(userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.offeredEvents || !user.offeredEvents.includes(parseInt(eventId))) {
      return res.status(404).json({ message: 'Event not found in offered events' });
    }

    // Remove the event from the offeredEvents array
    await usersCollection.updateOne(
      { id: parseInt(userId) },
      { $pull: { offeredEvents: parseInt(eventId) } }
    );

    res.status(200).json({ message: 'Event declined and removed from offeredEvents' });
  } catch (e) {
    console.error('Error declining event:', e);
    res.status(500).json({ message: 'An error occurred while declining the event' });
  }
});

export default router;
