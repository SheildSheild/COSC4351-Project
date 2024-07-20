// test/volunteerHistoryRoutes.test.js

import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import volunteerHistoryRoutes from '../server/routes/volunteerHistoryRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock data paths
const volunteerHistoryFilePath = path.join(__dirname, '../client/src/components/mockData/fake_volunteer_history.json');

// Load initial mock data
const initialVolunteerHistory = JSON.parse(fs.readFileSync(volunteerHistoryFilePath, 'utf-8'));

// Create an instance of the Express app
const app = express();
app.use(express.json());
app.use('/volunteerHistory', volunteerHistoryRoutes);

// Restore initial mock data after each test
afterEach(() => {
  fs.writeFileSync(volunteerHistoryFilePath, JSON.stringify(initialVolunteerHistory, null, 2));
});

describe('Volunteer History Routes', () => {
  it('should get the volunteer history for a user', (done) => {
    request(app)
      .get('/volunteerHistory/user/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].userId).toBe(1);
      })
      .end(done);
  });

  it('should return 404 if volunteer history for a user is not found', (done) => {
    request(app)
      .get('/volunteerHistory/user/999')
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Volunteer history not found');
      })
      .end(done);
  });

  it('should add a new volunteer event to the history', (done) => {
    const newVolunteerEvent = {
      userId: 1,
      eventId: 3,
      date: '2024-07-20',
      hours: 4
    };

    request(app)
      .post('/volunteerHistory/user/1')
      .send(newVolunteerEvent)
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Volunteer event added successfully!');
      })
      .end((err) => {
        if (err) return done(err);
        // Verify that the event was actually added
        const updatedVolunteerHistory = JSON.parse(fs.readFileSync(volunteerHistoryFilePath, 'utf-8'));
        const userHistory = updatedVolunteerHistory.filter(event => event.userId === 1);
        expect(userHistory).toContainEqual(expect.objectContaining(newVolunteerEvent));
        done();
      });
  });

  it('should return 400 if trying to add a new volunteer event with invalid data', (done) => {
    const invalidVolunteerEvent = {
      userId: 1,
      // Missing eventId and date
      hours: 4
    };

    request(app)
      .post('/volunteerHistory/user/1')
      .send(invalidVolunteerEvent)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid volunteer event data');
      })
      .end(done);
  });

  it('should return 400 if trying to add a new volunteer event for a non-existent user', (done) => {
    const newVolunteerEvent = {
      userId: 999,
      eventId: 3,
      date: '2024-07-20',
      hours: 4
    };

    request(app)
      .post('/volunteerHistory/user/999')
      .send(newVolunteerEvent)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('User not found');
      })
      .end(done);
  });
});
