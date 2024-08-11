import express from 'express';
import connectToDatabase from '../mongoConnect.js'; // Commented out due to differences in mongoConnect.js

const router = express.Router();

// Update user role
router.put('/:userId/role', async (req, res) => {
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const { userId } = req.params;
    const { role } = req.body;
  
    try {
      const result = await collection.updateOne(
        { id: parseInt(userId) },
        { $set: { role } }
      );
  
      if (result.matchedCount > 0) {
        const updatedUser = await collection.findOne({ id: parseInt(userId) });
        res.status(200).json({ message: 'User role updated successfully', user: updatedUser });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'An error occurred while updating the user role' });
    }
  });
  
  // Get all users who are not admins
  router.get('/', async (req, res) => {
    const db = await connectToDatabase();
    const collection = db.collection("users");
  
    try {
      const users = await collection.find({ role: { $ne: 'admin' } }).toArray();
      res.status(200).json(users);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'An error occurred while fetching users' });
    }
  });
  
  export default router;  