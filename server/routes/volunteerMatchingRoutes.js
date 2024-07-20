import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

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
  const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
  const eventsFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_event.json');

  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
  const events = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));

  const { eventIds } = req.body;

  const matchedVolunteers = users.filter(user =>
    eventIds.some(eventId => {
      const event = events.find(e => e.id === eventId);
      return event.requiredSkills.every(skill => user.skills.includes(skill)) &&
             !user.acceptedEvents.some(acceptedEvent => acceptedEvent.eventId === eventId);
    })
  );

  res.json({ volunteers: matchedVolunteers });
});

const isDateInRange = (date, range) => {
  const [start, end] = range.split(' - ').map(date => new Date(date));
  const checkDate = new Date(date);
  return checkDate >= start && checkDate <= end;
};

router.post('/assign', (req, res) => {

  const usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
  const eventsFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_event.json');

  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
  const events = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));

  const { volunteerId, eventId } = req.body;
  if (!volunteerId || !eventId) {
    return res.status(400).json({ message: 'Volunteer ID and Event ID are required' });
  }

  const volunteer = users.find(u => u.id === volunteerId);
  if (!volunteer) {
    return res.status(404).json({ message: 'Volunteer not found' });
  }
  
  const event = events.find(e => e.id === eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (!volunteer.offeredEvents) {
    volunteer.offeredEvents = [];
  }

  const currentTime = new Date().toISOString();
  volunteer.offeredEvents.push(eventId);

  const admin = users.find(u => u.role === 'admin'); // Assuming the first admin is assigning
  const notification = {
    id: uuidv4(),
    message: `Admin ${admin.fullName} has assigned you a position in the ${event.name} event. | ${currentTime}`,
    date: currentTime
  };
  volunteer.notifications.push(notification);
  
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  
  res.status(200).json({ message: 'Volunteer assigned successfully and notification sent' });
});


export default router;
