import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load mock data
const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
const eventsFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_event.json');
const skillsFilePath = path.join(__dirname, '../../client/src/components/mockData/skills.json');

const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
const events = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));
const skills = JSON.parse(fs.readFileSync(skillsFilePath, 'utf-8'));

router.get('/events', (req, res) => {
  res.status(200).json(events);
});

router.get('/skills', (req, res) => {
  res.status(200).json(skills);
});

router.post('/match', (req, res) => {
  const { eventIds, skillIds } = req.body;

  const matchedVolunteers = users.filter(user =>
    skillIds.every(skill => user.skills.includes(skill)) &&
    eventIds.some(eventId => {
      const event = events.find(e => e.id === eventId);
      return user.availability.some(range => isDateInRange(event.date, range)) &&
             event.requiredSkills.every(skill => user.skills.includes(skill));
    })
  );

  res.status(200).json({ volunteers: matchedVolunteers });
});

const isDateInRange = (date, range) => {
  const [start, end] = range.split(' - ').map(date => new Date(date));
  const checkDate = new Date(date);
  return checkDate >= start && checkDate <= end;
};

export default router;
