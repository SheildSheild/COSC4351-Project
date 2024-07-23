import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../mongoConnect.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get user profile
router.get('/:userId', async (req, res) => {
  const collection = db.collection("users");
  const { userId } = req.params;
  let user = await collection.find({id: parseInt(userId)})
    .limit(1).toArray();

  console.log(user);
  if (user) {
    res.status(200).json(user[0]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Update user profile
router.put('/:userId', (req, res) => {
  const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
  let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
  const { userId } = req.params;
  const updatedData = req.body;
  let userIndex = users.findIndex(u => u.id === parseInt(userId));

  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedData };

    // Update the users file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.status(200).json({ message: 'Profile updated successfully', user: users[userIndex] });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export default router;
