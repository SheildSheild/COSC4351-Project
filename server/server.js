import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./cosc4353-35f65-firebase-adminsdk-5u4y6-655663d6f4.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Example endpoint to list users
import express from 'express';
const app = express();
const port = 3000;

app.get('/users', async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    res.json(listUsersResult.users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
