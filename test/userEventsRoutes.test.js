import { strict as assert } from 'assert';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import request from 'supertest';
import router from '../server/routes/userEventRoutes.js'; // Update the path to your router file
import dayjs from 'dayjs';

const app = express();
app.use(express.json());
app.use('/api/events/signup', router);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to mock file reads and writes
function mockFileSystem(filePath, data) {
  fs.__setMockFiles({
    [filePath]: JSON.stringify(data),
  });
}

// Mocking fs methods
fs.__setMockFiles = function (mockFiles) {
  fs.readFileSync = (filePath, encoding) => {
    if (mockFiles[filePath]) {
      return mockFiles[filePath];
    }
    throw new Error('File not found');
  };
  fs.writeFileSync = (filePath, data) => {
    if (!mockFiles[filePath]) {
      throw new Error('File not found');
    }
    mockFiles[filePath] = data;
  };
};

describe('Event Signup Routes Tests', function () {
  let usersFilePath, eventsFilePath;

  beforeEach(() => {
    usersFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_users.json');
    eventsFilePath = path.join(__dirname, '../../client/src/components/mockData/fake_event.json');

    const users = [
      {
        id: 1,
        fullName: 'User One',
        role: 'user',
        acceptedEvents: [],
        notifications: [],
      },
      {
        id: 2,
        fullName: 'Admin One',
        role: 'admin',
        notifications: [],
      },
    ];

    const events = [
      {
        id: 1,
        name: 'Event One',
      },
      {
        id: 2,
        name: 'Event Two',
      },
    ];

    mockFileSystem(usersFilePath, users);
    mockFileSystem(eventsFilePath, events);
  });

  describe('POST /api/events/signup', function () {
    it('should sign up a user for an event and notify admins', async function () {
      const response = await request(app)
        .post('/api/events/signup')
        .send({ userId: 1, eventId: 1 });

      assert.equal(response.status, 200);
      assert.deepEqual(response.body, { message: 'User signed up for event successfully' });

      // Verify the user has been signed up for the event
      const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
      const user = users.find(u => u.id === 1);
      assert.deepEqual(user.acceptedEvents, [{ eventId: 1, signUpTime: dayjs().toISOString() }]);

      // Verify admins have been notified
      const admin = users.find(u => u.role === 'admin');
      assert(admin.notifications.some(notification => notification.event === 'Event One'));
    });

    it('should return 400 if userId or eventId is missing', async function () {
      const response1 = await request(app)
        .post('/api/events/signup')
        .send({ userId: 1 });

      assert.equal(response1.status, 400);
      assert.deepEqual(response1.body, { message: 'User ID and Event ID are required' });

      const response2 = await request(app)
        .post('/api/events/signup')
        .send({ eventId: 1 });

      assert.equal(response2.status, 400);
      assert.deepEqual(response2.body, { message: 'User ID and Event ID are required' });
    });

    it('should return 404 if user or event is not found', async function () {
      const response1 = await request(app)
        .post('/api/events/signup')
        .send({ userId: 999, eventId: 1 });

      assert.equal(response1.status, 404);
      assert.deepEqual(response1.body, { message: 'User not found' });

      const response2 = await request(app)
        .post('/api/events/signup')
        .send({ userId: 1, eventId: 999 });

      assert.equal(response2.status, 404);
      assert.deepEqual(response2.body, { message: 'Event not found' });
    });

    it('should return 500 if there is an error reading or writing files', async function () {
      fs.__setMockFiles = () => {
        throw new Error('Error reading file');
      };

      const response = await request(app)
        .post('/api/events/signup')
        .send({ userId: 1, eventId: 1 });

      assert.equal(response.status, 500);
      assert.deepEqual(response.body, { message: 'Error reading data files' });

      fs.__setMockFiles = () => {
        throw new Error('Error writing file');
      };

      const response2 = await request(app)
        .post('/api/events/signup')
        .send({ userId: 1, eventId: 1 });

      assert.equal(response2.status, 500);
      assert.deepEqual(response2.body, { message: 'Error updating data files' });
    });
  });
});
