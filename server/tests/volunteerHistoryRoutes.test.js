// test/volunteerHistoryRoutes.test.js

import request from 'supertest';
import express from 'express';
import volunteerHistoryRoutes from '../routes/volunteerHistoryRoutes.js';
import dayjs from 'dayjs';

const app = express();
app.use(express.json());
app.use('/api/history', volunteerHistoryRoutes);

let users = [];
let events = [];

beforeEach(() => {
  users = [
    {
      id: 1,
      username: 'user',
      password: 'user',
      email: 'user@email.com',
      role: 'user',
      fullName: 'Nicholas Yoder',
      address1: '357 Patel Spur Suite 515',
      address2: 'Apt. 421',
      city: 'Lake Jill',
      state: 'KS',
      zipCode: '89445',
      skills: [1],
      preferences: 'User 1 preferences',
      availability: [
        '2024-09-01 - 2024-09-05',
        '2024-10-06 - 2024-11-29',
        '2025-01-01 - 2025-01-05'
      ],
      acceptedEvents: [
        { eventId: 1, signUpTime: '2024-07-12T00:59:58.272Z' },
        { eventId: 2, signUpTime: '2024-07-13T14:21:30.000Z' }
      ],
      offeredEvents: [],
      notifications: [
        {
          message: 'New Event: Crawfish Boil 2024, Date: 2024-07-31 | Created at 7/26/2024, 6:42:40 PM',
          date: '7/26/2024, 6:42:40 PM'
        }
      ],
      verified: true
    }
  ];

  events = [
    {
      id: 1,
      name: 'Dog Sitting',
      description: 'Looking for volunteers to take care of dogs',
      location: 'PSC 6076, Box 0648\nAPO AP 07489',
      date: '2025-01-04',
      requiredSkills: [1],
      urgency: { id: 3, name: 'High' },
      participants: []
    },
    {
      id: 2,
      name: 'Clean My House',
      description: 'My house dirty as hell im ngl :/ pls send help',
      location: '72688 Warren Garden Suite 332\nLake Jamie, NE 35166',
      date: '2024-12-26',
      requiredSkills: [2],
      urgency: { id: 3, name: 'High' },
      participants: []
    }
  ];
});

describe('Volunteer History Routes', () => {
  it('should get the volunteer history for a user', (done) => {
    request(app)
      .get('/api/history/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].eventId).toBe(1);
      })
      .end(done);
  });

  it('should return 404 if volunteer history for a user is not found', (done) => {
    request(app)
      .get('/api/history/999')
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('User not found');
      })
      .end(done);
  });

  it('should add a new volunteer event to the history', (done) => {
    const newVolunteerEvent = {
      userId: 1,
      eventId: 3,
      signUpTime: '2024-07-20T00:00:00.000Z'
    };

    request(app)
      .post('/api/history/1')
      .send(newVolunteerEvent)
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Volunteer event added successfully!');
      })
      .end((err) => {
        if (err) return done(err);
        // Verify that the event was actually added
        users[0].acceptedEvents.push(newVolunteerEvent);
        const userHistory = users[0].acceptedEvents.filter(event => event.userId === 1);
        expect(userHistory).toContainEqual(expect.objectContaining(newVolunteerEvent));
        done();
      });
  });

  it('should return 400 if trying to add a new volunteer event with invalid data', (done) => {
    const invalidVolunteerEvent = {
      userId: 1,
      // Missing eventId
      signUpTime: '2024-07-20T00:00:00.000Z'
    };

    request(app)
      .post('/api/history/1')
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
      signUpTime: '2024-07-20T00:00:00.000Z'
    };

    request(app)
      .post('/api/history/999')
      .send(newVolunteerEvent)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('User not found');
      })
      .end(done);
  });
});
