// backend/routes/volunteerHistoryRoutes.js

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getSkills = () => {
  const skillsFilePath = path.join(__dirname, '../../client/src/components/mockData/skills.json');
  return JSON.parse(fs.readFileSync(skillsFilePath, 'utf-8'));
};

const getEvents = () => {
  const eventsFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_event.json');
  return JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));
}

const getUsers = () => {
  const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
  return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
}

// Get volunteer history for a user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const users = getUsers();
  const events = getEvents();
  const skills = getSkills();

  const user = users.find(u => u.id === parseInt(userId));
  const userSkills = user.skills.map(skillId => {
    const skill = skills.find(s => s.id === skillId);
    return skill ? skill.name : 'Unknown Skill';
  }).join(', ');

  if (user) {
    const acceptedEventsDetails = user.acceptedEvents.map(acceptedEvent => {
      const event = events.find(e => e.id === acceptedEvent.eventId);
      return {
        eventId: acceptedEvent.eventId,
        eventName: event.name,
        eventDate: event.date,
        signUpTime: acceptedEvent.signUpTime,
        skills: userSkills,
        location: event.location || 'N/A',
        description: event.description || 'N/A'
      };
    });
    res.status(200).json(acceptedEventsDetails);
  } else {
    res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(userHistoryDetails);

});

export default router;
