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

// Get volunteer history for a user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.find(u => u.id === parseInt(userId));

  if (user && user.acceptedEvents) {
    res.status(200).json(user.acceptedEvents);
  } else {
    res.status(404).json({ message: 'User not found or no accepted events' });
  }
});

export default router;