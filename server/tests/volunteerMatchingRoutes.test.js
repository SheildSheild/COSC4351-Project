import { strict as assert } from 'assert';
import express from 'express';
import request from 'supertest';
import router from '../routes/volunteerMatchingRoutes.js'; // Update the path to your router file
import fs from 'fs';

const app = express();
app.use(express.json());
app.use('/api', router);

describe('Router Tests', function () {
  beforeEach(() => {
    // Setup mock data
    const users = [
      {
        id: 1,
        skills: [1, 2],
        offeredEvents: [],
        notifications: [],
        role: 'volunteer',
        username: "user",
        password: "user",
        email: "user@email.com",
        fullName: "Nicholas Yoder",
        address1: "357 Patel Spur Suite 515",
        address2: "Apt. 421",
        city: "Lake Jill",
        state: "KS",
        zipCode: "89445",
        preferences: "User 1 preferences",
        availability: ["2024-09-01 - 2024-09-05", "2024-10-06 - 2024-11-29", "2025-01-01 - 2025-01-05"],
        acceptedEvents: [],
        verified: true
      },
      {
        id: 2,
        skills: [3],
        offeredEvents: [],
        notifications: [],
        role: 'admin',
        fullName: 'Admin User',
        username: "admin",
        password: "admin",
        email: "admin@example.com",
        fullName: "Admin User",
        address1: "123 Admin St",
        address2: "",
        city: "Admin City",
        state: "CA",
        zipCode: "12345",
        preferences: "",
        availability: [],
        acceptedEvents: [],
        verified: true
      },
    ];

    const events = [
      {
        id: 1,
        name: 'Dog Sitting',
        description: 'Looking for volunteers to take care of dogs',
        location: 'PSC 6076, Box 0648\nAPO AP 07489',
        date: '2025-01-04',
        requiredSkills: [1],
        urgency: { id: 3, name: 'High' },
        participants: ['Nicholas Yoder', 'Keean Smith']
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
      },
      {
        id: 3,
        name: 'Crawfish Boil 2024',
        description: 'Come and boil crawfish at the sugar land HEB',
        location: 'HEB',
        date: '2024-07-31',
        requiredSkills: [5],
        urgency: { id: 2, name: 'Medium' },
        participants: []
      },
    ];

    const skills = [
      { id: 1, name: 'Dog Sitting' },
      { id: 2, name: 'Mopping' },
      { id: 3, name: 'Mowing Lawn' },
      { id: 4, name: 'Cleaning' },
      { id: 5, name: 'Cooking' },
    ];

    jest.mock('fs', () => ({
      readFileSync: jest.fn((filePath) => {
        if (filePath.includes('fake_users.json')) {
          return JSON.stringify(users);
        } else if (filePath.includes('fake_event.json')) {
          return JSON.stringify(events);
        } else if (filePath.includes('skills.json')) {
          return JSON.stringify(skills);
        }
        return null;
      }),
    }));
  });

  describe('GET /api/events', function () {
    it('should return all events', async function () {
      const response = await request(app).get('/api/events');
      assert.equal(response.status, 200);
      const expectedEvents = [
        {
          id: 1,
          name: 'Dog Sitting',
          description: 'Looking for volunteers to take care of dogs',
          location: 'PSC 6076, Box 0648\nAPO AP 07489',
          date: '2025-01-04',
          requiredSkills: [1],
          urgency: { id: 3, name: 'High' },
          participants: ['Nicholas Yoder', 'Keean Smith']
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
        },
        {
          id: 3,
          name: 'Crawfish Boil 2024',
          description: 'Come and boil crawfish at the sugar land HEB',
          location: 'HEB',
          date: '2024-07-31',
          requiredSkills: [5],
          urgency: { id: 2, name: 'Medium' },
          participants: []
        }
      ];
      assert.deepEqual(response.body, expectedEvents);
    });
  });

  describe('GET /api/skills', function () {
    it('should return all skills', async function () {
      const response = await request(app).get('/api/skills');
      assert.equal(response.status, 200);
      const expectedSkills = [
        { id: 1, name: 'Dog Sitting' },
        { id: 2, name: 'Mopping' },
        { id: 3, name: 'Mowing Lawn' },
        { id: 4, name: 'Cleaning' },
        { id: 5, name: 'Cooking' }
      ];
      assert.deepEqual(response.body, expectedSkills);
    });
  });

  describe('POST /api/match', function () {
    it('should return matched volunteers based on event skills', async function () {
      const response = await request(app)
        .post('/api/match')
        .send({ eventIds: [1] });

      assert.equal(response.status, 200);
      const expectedVolunteers = [
        {
          id: 1,
          skills: [1, 2],
          offeredEvents: [],
          notifications: [],
          role: 'volunteer',
          username: "user",
          password: "user",
          email: "user@email.com",
          fullName: "Nicholas Yoder",
          address1: "357 Patel Spur Suite 515",
          address2: "Apt. 421",
          city: "Lake Jill",
          state: "KS",
          zipCode: "89445",
          preferences: "User 1 preferences",
          availability: ["2024-09-01 - 2024-09-05", "2024-10-06 - 2024-11-29", "2025-01-01 - 2025-01-05"],
          acceptedEvents: [],
          verified: true
        }
      ];
      assert.deepEqual(response.body.volunteers, expectedVolunteers);
    });
  });

  describe('POST /api/assign', function () {
    it('should assign event to volunteer and send notification', async function () {
      const response = await request(app)
        .post('/api/assign')
        .send({ volunteerId: 1, eventId: 1 });

      assert.equal(response.status, 200);
      assert.deepEqual(response.body, { message: 'Volunteer assigned successfully and notification sent' });

      // Check if the volunteer has been assigned the event and notification is added
      const users = JSON.parse(fs.readFileSync('../../client/src/components/mockData/fake_users.json', 'utf-8'));
      const volunteer = users.find(user => user.id === 1);
      assert(volunteer.offeredEvents.includes(1));
      assert(volunteer.notifications.length > 0);
    });

    it('should return 400 when missing volunteerId or eventId', async function () {
      const response = await request(app)
        .post('/api/assign')
        .send({ volunteerId: 1 });

      assert.equal(response.status, 400);
      assert.deepEqual(response.body, { message: 'Volunteer ID and Event ID are required' });
    });

    it('should return 404 when volunteer or event not found', async function () {
      const response = await request(app)
        .post('/api/assign')
        .send({ volunteerId: 9999, eventId: 9999 });

      assert.equal(response.status, 404);
      assert.deepEqual(response.body, { message: 'Volunteer not found' });
    });
  });
});
