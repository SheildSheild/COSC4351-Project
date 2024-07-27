import express from 'express';
// import db from '../mongoConnect.js';
import connectToDatabase from '../mongoConnect.js'; // Commented out due to differences in mongoConnect.js

const router = express.Router();

// Get all events
router.get('/events', async (req, res) => {
  try {
    const db = await connectToDatabase(); // Commented out due to differences in mongoConnect.js
    const eventsCollection = db.collection("events");
    const events = await eventsCollection.find({ id: { $ne: -1 } }).toArray();
    res.status(200).json(events);
  } catch (e) {
    console.error('Error fetching events:', e);
    res.status(500).json({ message: 'An error occurred while fetching events' });
  }
});

// Get all skills
router.get('/skills', async (req, res) => {
  try {
    const db = await connectToDatabase(); // Commented out due to differences in mongoConnect.js
    const skillsCollection = db.collection("skills");
    const skills = await skillsCollection.find({}).toArray();
    res.status(200).json(skills);
  } catch (e) {
    console.error('Error fetching skills:', e);
    res.status(500).json({ message: 'An error occurred while fetching skills' });
  }
});

// Match volunteers to events
router.post('/match', async (req, res) => {
  const { eventIds } = req.body;

  try {
    const db = await connectToDatabase(); // Commented out due to differences in mongoConnect.js
    const usersCollection = db.collection("users");
    const eventsCollection = db.collection("events");

    const events = await eventsCollection.find({ id: { $in: eventIds, $ne: -1 } }).toArray();
    const users = await usersCollection.find({ id: { $ne: -1 } }).toArray();

    const matchedVolunteers = users.filter(user =>
      eventIds.some(eventId => {
        const event = events.find(e => e.id === eventId);
        return event.requiredSkills.every(skill => user.skills.includes(skill)) &&
               !user.acceptedEvents.some(acceptedEvent => acceptedEvent.eventId === eventId);
      })
    );

    res.json({ volunteers: matchedVolunteers });
  } catch (e) {
    console.error('Error matching volunteers:', e);
    res.status(500).json({ message: 'An error occurred while matching volunteers' });
  }
});

// Assign a volunteer to an event
router.post('/assign', async (req, res) => {
  const { volunteerId, eventId } = req.body;

  if (!volunteerId || !eventId) {
    return res.status(400).json({ message: 'Volunteer ID and Event ID are required' });
  }

  try {
    const db = await connectToDatabase(); // Commented out due to differences in mongoConnect.js
    const usersCollection = db.collection("users");
    const eventsCollection = db.collection("events");

    const volunteer = await usersCollection.findOne({ id: volunteerId });
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    const event = await eventsCollection.findOne({ id: eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const currentTime = new Date().toISOString();
    
    await usersCollection.updateOne(
      { id: volunteerId },
      { $push: { offeredEvents: eventId, notifications: { message: `You have been assigned to the ${event.name} event.`, date: currentTime } } }
    );

    res.status(200).json({ message: 'Volunteer assigned successfully and notification sent' });
  } catch (e) {
    console.error('Error assigning volunteer:', e);
    res.status(500).json({ message: 'An error occurred while assigning the volunteer' });
  }
});

export default router;