import express from 'express';
// import db from '../mongoConnect.js';
import connectToDatabase from '../mongoConnect.js'; // Commented out due to differences in mongoConnect.js

const router = express.Router();

// Get volunteer history for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const db = await connectToDatabase(); // Commented out due to differences in mongoConnect.js
    const usersCollection = db.collection("users");
    const eventsCollection = db.collection("events");
    const skillsCollection = db.collection("skills");

    // Find the user by ID
    const user = await usersCollection.findOne({ id: parseInt(userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user skills
    const userSkills = await skillsCollection.find({ id: { $in: user.skills } }).toArray();
    const userSkillsNames = userSkills.map(skill => skill.name).join(', ');

    // Get details of accepted events
    const acceptedEventsDetails = await Promise.all(user.acceptedEvents.map(async (acceptedEvent) => {
      const event = await eventsCollection.findOne({ id: acceptedEvent.eventId });

      const requiredSkills = await skillsCollection.find({ id: { $in: event.requiredSkills } }).toArray();
      const requiredSkillsNames = requiredSkills.map(skill => skill.name).join(', ');
      if (event.id == -1) return null;
      return {
        eventId: acceptedEvent.eventId,
        eventName: event.name,
        eventDate: event.date,
        signUpTime: acceptedEvent.signUpTime,
        skills: requiredSkillsNames,
        location: event.location || 'N/A',
        description: event.description || 'N/A'
      };
    }));

    res.status(200).json(acceptedEventsDetails);
  } catch (e) {
    console.error('Error fetching volunteer history:', e);
    res.status(500).json({ message: 'An error occurred while fetching volunteer history' });
  }
});

export default router;