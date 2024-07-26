import express from 'express';
import db from '../mongoConnect.js';

const router = express.Router();

const getUrgencyNameById = (id) => {
  switch (id) {
    case 1: return "Low";
    case 2: return "Medium";
    case 3: return "High";
    default: return "Unknown";
  }
};

// Create a new event
router.post('/create', async (req, res) => {
  const { eventName, eventDescription, location, requiredSkills, urgency, eventDate } = req.body;

  try {
    const eventsCollection = db.collection("events");
    const usersCollection = db.collection("users");
    const skillsCollection = db.collection("skills");

    const skills = await skillsCollection.find({ id: { $in: requiredSkills } }).toArray();

    if (skills.length !== requiredSkills.length) {
      return res.status(400).json({ message: 'One or more required skills are invalid' });
    }

    const autoIncrement = await eventsCollection.find({id: -1}).toArray();
    const newEventId = autoIncrement.map(newID => newID.globalEventId);

    const newEvent = {
      id: parseInt(newEventId),
      name: eventName,
      description: eventDescription,
      location,
      requiredSkills: skills.map(skill => skill.id),
      urgency: {
        id: urgency,
        name: getUrgencyNameById(urgency)
      },
      date: eventDate,
      participants: []
    };

    const eventResult = await eventsCollection.insertOne(newEvent);

    // Create notification
    const currentTime = new Date().toLocaleString();
    const newNotification = {
      message: `New Event: ${eventName}, Date: ${eventDate} | Created at ${currentTime}`,
      date: currentTime,
    };

    // Update all users with the new notification
    await usersCollection.updateMany(
      { role: 'user' },
      { $push: { notifications: newNotification } }
    );

    eventsCollection.findOneAndUpdate(
      { id: -1 },
      { $inc: { globalEventId: 1 } },
      { returnOriginal: false, upsert: true }
    );

    res.status(201).json({ message: 'Event created successfully!', event: eventResult[0] });
  } catch (e) {
    console.error('Error creating event:', e);
    res.status(500).json({ message: 'An error occurred while creating the event' });
  }
});

// Get all events
router.get('/all', async (req, res) => {
  try {
    const collection = db.collection("events");
    const events = await collection.find({ id: { $ne: -1 } }).toArray();
    res.status(200).json(events);
  } catch (e) {
    console.error('Error fetching events:', e);
    res.status(500).json({ message: 'An error occurred while fetching events' });
  }
});

export default router;