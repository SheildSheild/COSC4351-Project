import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import express from 'express';
import cors from 'cors';

// Routes
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import profileRoutes from './routes/userProfileRoutes.js';
import historyRoutes from './routes/volunteerHistoryRoutes.js';
import userEventRoutes from './routes/userEventRoutes.js';

const serviceAccount = JSON.parse(readFileSync('./cosc4353-35f65-firebase-adminsdk-5u4y6-655663d6f4.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/signup', userEventRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/history', historyRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
