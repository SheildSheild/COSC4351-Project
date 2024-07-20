import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getEvents = () => {
  const eventsFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_event.json');
  return JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));
};

router.get('/events', (req, res) => {
    const events = getEvents();
    res.status(200).json(events);
  });

const getUsers = () => {
  const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
  return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
};

// Get participants for a specific event
router.get('/participants/:eventId', (req, res) => {
  const { eventId } = req.params;
  const users = getUsers();

  const participants = users.filter(user => {
    return user.acceptedEvents && user.acceptedEvents.some(event => event.eventId === parseInt(eventId));
  }).map(user => user.fullName);

  if (participants.length > 0) {
    res.status(200).json(participants);
  } else {
    res.status(404).json({ message: 'No participants found for this event' });
  }
});

export default router;
