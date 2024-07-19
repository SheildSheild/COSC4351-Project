import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get notifications for a user
router.get('/:userId', (req, res) => {

  const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
  let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

  const eventsFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_event.json');
  let events = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));

  const { userId } = req.params;
  const user = users.find(u => u.id === parseInt(userId));

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

router.delete('/:id', (req, res) => {

  const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
  let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

  const notificationId = req.params.id;
  let notificationFound = false;

  users = users.map(user => {
    if (user.notifications) {
      const initialLength = user.notifications.length;
      user.notifications = user.notifications.filter(notification => notification.id !== notificationId);
      if (user.notifications.length < initialLength) {
        notificationFound = true;
      }
    }
    return user;
  });

  if (notificationFound) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.status(200).json({ message: 'Notification deleted successfully' });
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
});

// Accepting offered events
router.post('/:userId/accept', (req, res) => {

  const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
  let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

  const { userId } = req.params;
  const { eventId } = req.body;
  const user = users.find(u => u.id === parseInt(userId));
  const currentTime = new Date().toISOString();

  if (user) {
    user.acceptedEvents = user.acceptedEvents || [];
    user.acceptedEvents.push({ eventId: eventId, signUpTime: currentTime });
    user.offeredEvents = user.offeredEvents.filter(id => id !== eventId);

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.status(200).json({ message: 'Event accepted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Declining offered events

router.delete('/:userId/decline/:eventId', (req, res) => {
  const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
  let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

  const { userId, eventId } = req.params; // Extract userId and eventId from request parameters
  let eventFound = false;

  users = users.map(user => {
    if (user.id === parseInt(userId) && user.offeredEvents) {
      const initialLength = user.offeredEvents.length;
      user.offeredEvents = user.offeredEvents.filter(id => id !== parseInt(eventId));
      if (user.offeredEvents.length < initialLength) {
        eventFound = true;
      }
    }
    return user;
  });

  if (eventFound) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.status(200).json({ message: 'Event declined and removed from offeredEvents' });
  } else {
    res.status(404).json({ message: 'Event or User not found' });
  }
});

export default router;
