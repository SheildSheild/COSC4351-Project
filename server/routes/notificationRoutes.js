import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load users from fake_users.json
const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

// Get notifications for a user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.find(u => u.id === parseInt(userId));

  if (user) {
    res.status(200).json(user.notifications || []);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Send a notification
router.post('/', (req, res) => {
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

export default router;
