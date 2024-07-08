import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import express from 'express';
import authRoutes from './routes/authRoutes.js';

const serviceAccount = JSON.parse(readFileSync('./cosc4353-35f65-firebase-adminsdk-5u4y6-655663d6f4.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
