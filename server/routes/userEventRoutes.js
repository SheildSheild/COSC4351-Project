import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.post('/', (req, res) => {
  const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
  const eventsFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_event.json');
  let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
  let events = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));
  
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
  user.acceptedEvents.push({eventId: eventId, signUpTime: currentTime});

  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

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
  
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  res.status(200).json({ message: 'User signed up for event successfully' });
});

export default router;