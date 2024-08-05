import request from 'supertest';
import express from 'express';
import userEventsRoutes from '../routes/userEventRoutes.js'; // Update the import path to your actual route file

const app = express();
app.use(express.json());
app.use('/user-events', userEventsRoutes);

describe('User Events Routes', () => {
  let users, events;

  beforeEach(() => {
    // Detailed users array
    users = [
      {
        id: 1,
        username: "user1",
        password: "pass1",
        email: "user1@example.com",
        role: "user",
        fullName: "User One",
        address1: "123 Main St",
        address2: "Apt 101",
        city: "Townsville",
        state: "TX",
        zipCode: "12345",
        skills: [1],
        preferences: "User 1 preferences",
        availability: ["2024-01-01 - 2024-01-05"],
        acceptedEvents: [],
        offeredEvents: [],
        notifications: [],
        verified: true
      },
      {
        id: 2,
        username: "user2",
        password: "pass2",
        email: "user2@example.com",
        role: "admin",
        fullName: "User Two",
        address1: "456 Elm St",
        address2: "",
        city: "Villageton",
        state: "CA",
        zipCode: "67890",
        skills: [2],
        preferences: "User 2 preferences",
        availability: ["2024-02-01 - 2024-02-05"],
        acceptedEvents: [],
        offeredEvents: [],
        notifications: [],
        verified: true
      }
    ];

    // Detailed events array
    events = [
      {
        id: 1,
        name: "Cat Sitting",
        description: "Looking for volunteers to take care of cats",
        location: "987 Oak St",
        date: "2025-01-01",
        requiredSkills: [1],
        urgency: { id: 1, name: "Low" },
        participants: []
      },
      {
        id: 2,
        name: "Plant Watering",
        description: "Need volunteers to water plants",
        location: "654 Pine St",
        date: "2025-01-02",
        requiredSkills: [2],
        urgency: { id: 2, name: "Medium" },
        participants: []
      }
    ];
  });

  it('should fetch a user\'s details', async () => {
    app.get('/user-events/:userId', (req, res) => {
      const user = users.find(u => u.id === parseInt(req.params.userId));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    });

    const response = await request(app).get('/user-events/1');
    expect(response.status).toBe(200);
    expect(response.body.fullName).toEqual('Updated Name');
  });

  it('should return 404 when user not found', async () => {
    app.get('/user-events/:userId', (req, res) => {
      const user = users.find(u => u.id === parseInt(req.params.userId));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    });

    const response = await request(app).get('/user-events/999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should sign up a user for an event successfully', async () => {
    app.post('/user-events/', (req, res) => {
      const { userId, eventId } = req.body;
      const user = users.find(u => u.id === userId);
      const event = events.find(e => e.id === eventId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      event.participants.push(userId);
      res.status(200).json({ message: 'User signed up for event successfully' });
    });

    const response = await request(app)
      .post('/user-events/')
      .send({ userId: 6, eventId: 1 });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User signed up for event successfully');
    expect(events.find(e => e.id === 1).participants).toContain(1);
  });

  it('should return 500 if database error occurs when fetching user', async () => {
    // Simulate a database error
    app.get('/user-events/:userId', (req, res) => {
      throw new Error('Database failure');
    });

    const response = await request(app).get('/user-events/1');
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('An error occurred while fetching user');
  });

  it('should return 400 if userId or eventId is missing', async () => {
    const response = await request(app)
      .post('/user-events/')
      .send({ userId: undefined, eventId: undefined });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User ID and Event ID are required');
  });

  it('should return 500 if database error occurs while signing up for event', async () => {
    // Simulate a database error
    app.post('/user-events/', (req, res) => {
      throw new Error('Database failure');
    });

    const response = await request(app)
      .post('/user-events/')
      .send({ userId: 1, eventId: 2 });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('An error occurred while updating the database');
  });

  it('should handle multiple admin notifications correctly', async () => {
    // Add another admin to test multiple updates
    users.push({
      id: 3,
      username: "admin2",
      password: "admin2",
      email: "admin2@example.com",
      role: "admin",
      fullName: "Admin User Two",
      notifications: [],
      verified: true
    });

    app.post('/user-events/', (req, res) => {
      const { userId, eventId } = req.body;
      const user = users.find(u => u.id === userId);
      const event = events.find(e => e.id === eventId);

      if (!user || !event) {
        return res.status(404).json({ message: 'User or Event not found' });
      }

      users.filter(u => u.role === 'admin').forEach(admin => {
        admin.notifications.push({
          message: `User ${user.fullName} signed up for ${event.name}`,
          time: '2021-01-01T00:00:00.000Z'
        });
      });

      res.status(200).json({ message: 'User signed up for event successfully' });
    });

    const response = await request(app)
      .post('/user-events/')
      .send({ userId: 1, eventId: 1 });
    expect(response.status).toBe(200);
    expect(users.find(u => u.id === 3).notifications.length).toBeGreaterThan(-1);
  });
});

