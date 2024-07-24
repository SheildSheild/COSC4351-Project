import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load events from fake_event.json
const eventsFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_event.json');
let events = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));

// Load users from fake_users.json for notifications
const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

// Create a new event
const getUrgencyNameById = (id) => {
  switch (id) {
    case 1: return "Low";
    case 2: return "Medium";
    case 3: return "High";
    default: return "Unknown";
  }
};

// Create a new event
router.post('/create', (req, res) => {
  // Load events from fake_event.json
  const eventsFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_event.json');
  let events = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));

  // Load users from fake_users.json for notifications
  const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
  let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

  const { eventName, eventDescription, location, requiredSkills, urgency, eventDate, userId } = req.body;
  const user = users.find(u => u.id === userId);

  const newEvent = {
    id: events.length + 1,
    name: eventName,
    description: eventDescription,
    location,
    requiredSkills,
    urgency: {
      id: urgency,
      name: getUrgencyNameById(urgency)
    },
    date: eventDate,
    participants: []
  };

  events.push(newEvent);

  // Update the events file
  fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));

  // Notify all users
  const currentTime = new Date().toLocaleString();
  const newNotification = {
    id: uuidv4(),
    message: `New Event: ${eventName}, Date: ${eventDate} | Created at ${currentTime}`,
    date: currentTime,
  };

  users = users.map(user => {
    if (user.role === 'user') {
      return {
        ...user,
        notifications: user.notifications ? [...user.notifications, newNotification] : [newNotification]
      };
    }
    return user;
  });

  // Update the users file
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  res.status(201).json({ message: 'Event created successfully!', event: newEvent });
});

// Get all events
router.get('/all', async (req, res) => {
  try {
    const collection = db.collection("events");
    const events = await collection.find({}).toArray();
    res.status(200).json(events);
  } catch (e) {
    console.error('Error fetching events:', e);
    res.status(500).json({ message: 'An error occurred while fetching events' });
  }
});

export default router;