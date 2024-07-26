import express from 'express';
import db from '../mongoConnect.js';

const router = express.Router();

router.get('/events', async (req, res) => {
  try {
    const collection = db.collection("events");
    const events = await collection.find({id: { $ne: -1 }}).toArray();
    res.status(200).json(events);
  } catch (e) {
    console.error('Error fetching events:', e);
    res.status(500).json({ message: 'An error occurred while fetching events' });
  }
});

// Get participants for a specific event
router.get('/participants/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try {
    const usersCollection = db.collection("users");
    const participants = await usersCollection.find({
      acceptedEvents: { $elemMatch: { eventId: parseInt(eventId) } }
    }).project({ fullName: 1 }).toArray();

    if (participants.length > 0) {
      res.status(200).json(participants.map(user => user.fullName));
    } else {
      res.status(404).json({ message: 'No participants found for this event' });
    }
  } catch (e) {
    console.error('Error fetching participants:', e);
    res.status(500).json({ message: 'An error occurred while fetching participants' });
  }
});

export default router;