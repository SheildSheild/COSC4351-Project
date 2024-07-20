// test/eventRoutes.test.js

import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import eventRoutes from '../server/routes/eventRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock data paths
const eventsFilePath = path.join(__dirname, '../client/src/components/mockData/fake_event.json');
const usersFilePath = path.join(__dirname, '../client/src/components/mockData/fake_users.json');

// Load initial mock data
const initialEvents = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));
const initialUsers = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

// Create an instance of the Express app
const app = express();
app.use(express.json());
app.use('/events', eventRoutes);

// Restore initial mock data after each test
afterEach(() => {
  fs.writeFileSync(eventsFilePath, JSON.stringify(initialEvents, null, 2));
  fs.writeFileSync(usersFilePath, JSON.stringify(initialUsers, null, 2));
});

describe('Event Routes', () => {
  it('should create a new event', (done) => {
    const newEvent = {
      eventName: 'Test Event',
      eventDescription: 'This is a test event',
      location: 'Test Location',
      requiredSkills: [1, 2],
      urgency: 2,
      eventDate: '2024-07-21',
      userId: 1
    };

    request(app)
      .post('/events/create')
      .send(newEvent)
      .expect(201)
      .expect((res) => {
        res.body.message === 'Event created successfully!';
      })
      .end(done);
  });

  it('should get all events', (done) => {
    request(app)
      .get('/events/all')
      .expect(200)
      .expect((res) => {
        res.body.length === initialEvents.length;
      })
      .end(done);
  });
});
