import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';

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

// Helper function to check if a date is within a range
const isDateInRange = (date, range) => {
  const [start, end] = range.split(' - ').map(dayjs);
  const checkDate = dayjs(date);
  return checkDate.isAfter(start) && checkDate.isBefore(end);
};

// Match volunteers to events
router.get('/match/:eventId', (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const selectedEvent = events.find(e => e.id === eventId);

  if (!selectedEvent) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const matchedVolunteers = users.filter(user =>
    user.skills.some(skill => selectedEvent.requiredSkills.includes(skill)) &&
    user.availability.some(range => isDateInRange(selectedEvent.date, range))
  );

  res.status(200).json({
    event: selectedEvent,
    volunteers: matchedVolunteers
  });
});

router.get('/events', (req, res) => {
  res.status(200).json(events);
});

router.get('/skills', (req, res) => {
  res.status(200).json(skills);
});

export default router;