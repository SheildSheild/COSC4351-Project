import { strict as assert } from 'assert';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import request from 'supertest';
import router from '../server/routes/volunteerMatchingRoutes.js'; // Update the path to your router file

const app = express();
app.use(express.json());
app.use('/api', router);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to mock file reads
function mockFileRead(filePath, data) {
  fs.__setMockFiles({
    [filePath]: JSON.stringify(data),
  });
}

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
      },
      {
        id: 2,
        skills: [3],
        offeredEvents: [],
        notifications: [],
        role: 'admin',
        fullName: 'Admin User',
      },
    ];

    const events = [
      {
        id: 1,
        name: 'Event 1',
        requiredSkills: [1],
      },
      {
        id: 2,
        name: 'Event 2',
        requiredSkills: [3],
      },
    ];

    const skills = [
      { id: 1, name: 'Skill 1' },
      { id: 2, name: 'Skill 2' },
      { id: 3, name: 'Skill 3' },
    ];

    // Mock file reads
    mockFileRead(path.join(__dirname, '../../client/src/components/mockData/fake_users.json'), users);
    mockFileRead(path.join(__dirname, '../../client/src/components/mockData/fake_event.json'), events);
    mockFileRead(path.join(__dirname, '../../client/src/components/mockData/skills.json'), skills);
  });

  describe('GET /api/events', function () {
    it('should return all events', async function () {
      const response = await request(app).get('/api/events');
      assert.equal(response.status, 200);
      assert.deepEqual(response.body, [
        { id: 1, name: 'Event 1', requiredSkills: [1] },
        { id: 2, name: 'Event 2', requiredSkills: [3] },
      ]);
    });
  });

  describe('GET /api/skills', function () {
    it('should return all skills', async function () {
      const response = await request(app).get('/api/skills');
      assert.equal(response.status, 200);
      assert.deepEqual(response.body, [
        { id: 1, name: 'Skill 1' },
        { id: 2, name: 'Skill 2' },
        { id: 3, name: 'Skill 3' },
      ]);
    });
  });

  describe('POST /api/match', function () {
    it('should return matched volunteers based on event skills', async function () {
      const response = await request(app)
        .post('/api/match')
        .send({ eventIds: [1] });

      assert.equal(response.status, 200);
      assert.deepEqual(response.body, {
        volunteers: [
          {
            id: 1,
            skills: [1, 2],
            offeredEvents: [],
            notifications: [],
            role: 'volunteer',
          },
        ],
      });
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
      const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../client/src/components/mockData/fake_users.json'), 'utf-8'));
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
