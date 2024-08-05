import request from 'supertest';
import express from 'express';
import eventRoutes from '../routes/eventRoutes.js';

const app = express();
app.use(express.json());
app.use('/events', eventRoutes);

describe('Event Routes', () => {
  let events, users;

  beforeEach(() => {
    events = [
      {
        id: 1,
        name: 'Event One',
        description: 'Description for Event One',
        location: 'Location One',
        requiredSkills: [1, 2],
        urgency: {id: 2, name: "Medium"},
        date: '2024-07-21',
      },
      {
        id: 2,
        name: 'Event Two',
        description: 'Description for Event Two',
        location: 'Location Two',
        requiredSkills: [3],
        urgency: {id: 3, name: "High"},
        date: '2024-08-15',
      },
    ];

    users = [
      {
        id: 1,
        username: "user",
        password: "user",
        email: "user@email.com",
        role: "user",
        fullName: "Nicholas Yoder",
        address1: "357 Patel Spur Suite 515",
        address2: "Apt. 421",
        city: "Lake Jill",
        state: "KS",
        zipCode: "89445",
        skills: [1],
        preferences: "User 1 preferences",
        availability: ["2024-09-01 - 2024-09-05", "2024-10-06 - 2024-11-29", "2025-01-01 - 2025-01-05"],
        acceptedEvents: [
          { eventId: 12, signUpTime: "2024-07-12T00:59:58.272Z" },
          { eventId: 1, signUpTime: "2024-07-13T14:21:30.000Z" },
          { eventId: 6, signUpTime: "2024-07-19T08:35:12.684Z" },
          { eventId: 13, signUpTime: "2024-07-19T17:53:57.250Z" },
          { eventId: 3, signUpTime: "2024-07-19T18:16:14.735Z" }
        ],
        offeredEvents: [2],
        notifications: [
          { message: "New Event: Crawfish Boil 2024, Date: 2024-07-31 | Created at 7/26/2024, 6:42:40 PM", date: "7/26/2024, 6:42:40 PM" }
        ],
        verified: true
      },
      {
        id: 2,
        username: "admin",
        password: "admin",
        email: "admin@example.com",
        role: "admin",
        fullName: "Admin User",
        address1: "123 Admin St",
        address2: "",
        city: "Admin City",
        state: "CA",
        zipCode: "12345",
        skills: [2],
        preferences: "Admin preferences",
        availability: ["2024-09-01 - 2024-09-05", "2024-10-06 - 2024-11-29"],
        acceptedEvents: [],
        offeredEvents: [],
        notifications: [],
        verified: true
      }
    ];
  });

  it('should create a new event', (done) => {
    const newEvent = {
      name: 'Test Event',
      description: 'This is a test event',
      location: 'Test Location',
      requiredSkills: [1, 2],
      urgency: {id: 2, name: "Medium"},
      date: '2024-07-21',
      userId: 1,
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
        res.body.length === events.length;
      })
      .end(done);
  });

  it('deny event creation due to no selected skills', (done) => {
    const noSkillEvent = {
      name: 'No Skill Event',
      description: 'This is a test event',
      location: 'Test Location',
      requiredSkills: [],
      urgency: {id: 2, name: "Medium"},
      date: '2024-07-21',
      userId: 1,
    };

    request(app)
      .post('/events/create')
      .send(noSkillEvent)
      .expect(400)
      .expect((res) => {
        res.body.message === 'One or more required skills are invalid';
      })
      .end(done);
  });
});
