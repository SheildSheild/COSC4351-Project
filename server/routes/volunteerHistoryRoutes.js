import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load users and events from fake_users.json and fake_event.json
const getUsers = () => {
  const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
  return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
};

const getEvents = () => {
  const eventsFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_event.json');
  return JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));
};

// Get volunteer history for a user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const users = getUsers();
  const events = getEvents();

  const user = users.find(u => u.id === parseInt(userId));

  if (user) {
    const acceptedEventsDetails = user.acceptedEvents.map(acceptedEvent => {
      const event = events.find(e => e.id === acceptedEvent.eventId);
      return {
        eventId: acceptedEvent.eventId,
        eventName: event.name,
        eventDate: event.date,
        signUpTime: acceptedEvent.signUpTime
      };
    });

    res.status(200).json(acceptedEventsDetails);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});


export default router;