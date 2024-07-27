import express from 'express';
import request from 'supertest';
import adminHistoryRoutes from '../routes/adminHistoryRoutes.js';
import connectToDatabase from '../mongoConnect.js';

// Create an instance of the Express app
const app = express();
app.use(express.json());
app.use('/admin', adminHistoryRoutes);

let db;

beforeAll(async () => {
  db = await connectToDatabase();
});

// Tests for admin history routes
describe('Admin History Routes', () => {
  it('should fetch all events except those with id -1', async () => {
    const response = await request(app)
      .get('/admin/events')
      .expect(200);

    // Add assertions based on your expectations
    expect(response.body).toBeInstanceOf(Array);
    // Further assertions to check the response data
  });

  it('should fetch participants for a specific event', async () => {
    // Insert a test event and participants
    const eventsCollection = db.collection('events');
    const usersCollection = db.collection('users');
    
    const response = await request(app)
      .get('/admin/participants/1')
      .expect(200);

    expect(response.body).toEqual(["Nicholas Yoder"],["Keean Smith"]);
  });

  it('should return 404 if no participants are found for an event', async () => {
    const response = await request(app)
      .get('/admin/participants/999') // Use a non-existent event ID
      .expect(404);

    expect(response.body.message).toBe('No participants found for this event');
  });
});