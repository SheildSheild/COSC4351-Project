// backend/routes/volunteerHistoryRoutes.js

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getUserHistory = () => {
  const historyFilePath = path.join(__dirname, '../../client/src/components/mockData/userHistory.json');
  return JSON.parse(fs.readFileSync(historyFilePath, 'utf-8'));
};

const getSkills = () => {
  const skillsFilePath = path.join(__dirname, '../../client/src/components/mockData/skillmapping.json');
  return JSON.parse(fs.readFileSync(skillsFilePath, 'utf-8'));
};

// Get volunteer history for a user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const userHistory = getUserHistory();
  const skills = getSkills();

  const userHistoryDetails = userHistory
    .filter(event => event.participants.some(participant => participant.userId === parseInt(userId)))
    .map(event => {
      const skillNames = event.skillsRequired
        ? event.skillsRequired.map(skillId => skills[skillId] || 'Unknown Skill').join(', ')
        : 'N/A';

      const participant = event.participants.find(p => p.userId === parseInt(userId));

      return {
        eventName: event.eventName || 'N/A',
        eventDate: event.date || 'N/A',
        signUpTime: participant ? participant.status : 'N/A',
        skills: skillNames,
        location: event.location || 'N/A',
        description: event.description || 'N/A'
      };
    });

  res.status(200).json(userHistoryDetails);
});

export default router;
