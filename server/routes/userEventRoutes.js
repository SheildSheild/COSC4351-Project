import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFilePath = (fileName) => path.join(__dirname, `../../client/src/components/mockData/${fileName}`);

// Helper function to read JSON data from a file
const readJSONFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    throw new Error(`Error reading file at ${filePath}: ${error.message}`);
  }
};

// Helper function to write JSON data to a file
const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error(`Error writing file at ${filePath}: ${error.message}`);
  }
};

router.post('/', (req, res) => {
  const usersFilePath = getFilePath('fake_users.json');
  const eventsFilePath = getFilePath('fake_event.json');

  let users, events;
  try {
    users = readJSONFile(usersFilePath);
    events = readJSONFile(eventsFilePath);
  } catch (error) {
    return res.status(500).json({ message: 'Error reading data files' });
  }

  const { userId, eventId } = req.body;

  if (!userId || !eventId) {
    return res.status(400).json({ message: 'User ID and Event ID are required' });
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const event = events.find(e => e.id === eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (!user.acceptedEvents) {
    user.acceptedEvents = [];
  }

  const currentTime = dayjs().toISOString();
  user.acceptedEvents.push({ eventId: eventId, signUpTime: currentTime });

  try {
    writeJSONFile(usersFilePath, users);

    // Update notifications for all users
    users = users.map(u => {
      if (u.role === 'admin') {
        const newNotification = {
          id: uuidv4(),  // Generate a unique ID
          user: user.fullName,
          event: event.name,
          time: currentTime,
        };
        u.notifications = u.notifications ? [...u.notifications, newNotification] : [newNotification];
      }
      return u;
    });

    writeJSONFile(usersFilePath, users);

    res.status(200).json({ message: 'User signed up for event successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating data files' });
  }
});

export default router;
