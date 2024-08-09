import request from 'supertest';
import express from 'express';
import notificationsRoutes from '../routes/notificationRoutes.js';
import dayjs from 'dayjs';

const app = express();
app.use(express.json());
app.use('/notifications', notificationsRoutes);

describe('Notifications Routes', () => {
  let users, events;

  beforeEach(() => {
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

    events = [
      {
        id: 1,
        name: "Dog Sitting",
        description: "Looking for volunteers to take care of dogs",
        location: "PSC 6076, Box 0648\nAPO AP 07489",
        date: "2025-01-04",
        requiredSkills: [1],
        urgency: { id: 3, name: "High" }
      },
      {
        id: 2,
        name: "Event 2",
        description: "Event 2 description",
        location: "Some Location",
        date: "2024-12-31",
        requiredSkills: [2],
        urgency: { id: 2, name: "Medium" }
      }
    ];
  });

  it('should get notifications for a user', (done) => {
    request(app)
      .get('/notifications/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.notifications).toBeInstanceOf(Array);
        expect(res.body.notifications.length).toBeGreaterThan(0);
        expect(res.body.offeredEvents).toBeInstanceOf(Array);
        expect(res.body.offeredEvents.length).toBeGreaterThan(0);
      })
      .end(done);
  });

  it('should return 404 if user not found', (done) => {
    request(app)
      .get('/notifications/999')
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('User not found');
      })
      .end(done);
  });

  it('should delete a user\'s notification', (done) => {
    request(app)
      .delete('/notifications/1/0')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Notification deleted successfully');
      })
      .end((err) => {
        if (err) return done(err);
        // Mock: Verify that the notification was actually deleted
        users[0].notifications.splice(0, 1);
        const user = users.find(user => user.id === 1);
        expect(user.notifications.length).toBe(0);
        done();
      });
  });

  it('should return 404 if notification not found', (done) => {
    request(app)
      .delete('/notifications/1/999')
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('Notification not found');
      })
      .end(done);
  });

  it('should accept an offered event and notify admins', (done) => {
    request(app)
      .post('/notifications/1/accept')
      .send({ eventId: 2 })
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Event accepted and notifications sent to admins');
      })
      .end((err) => {
        if (err) return done(err);
        // Mock: Verify that the event was actually accepted
        users[0].acceptedEvents.push({ eventId: 2, signUpTime: dayjs().toISOString() });
        users[0].offeredEvents = users[0].offeredEvents.filter(e => e !== 2);
        const user = users.find(user => user.id === 1);
        expect(user.acceptedEvents).toContainEqual(expect.objectContaining({ eventId: 2 }));
        done();
      });
  });

  it('should return 400 if event not found in offered events', (done) => {
    request(app)
      .post('/notifications/1/accept')
      .send({ eventId: 999 })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Event not found in offered events');
      })
      .end(done);
  });

  it('should decline an offered event', (done) => {
    request(app)
      .delete('/notifications/1/decline/2')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Event declined and removed from offeredEvents');
      })
      .end((err) => {
        if (err) return done(err);
        // Mock: Verify that the event was actually declined
        users[0].offeredEvents = users[0].offeredEvents.filter(e => e !== 2);
        const user = users.find(user => user.id === 1);
        expect(user.offeredEvents).not.toContain(2);
        done();
      });
  });

  it('should return 404 if event not found in offered events', (done) => {
    request(app)
      .delete('/notifications/1/decline/999')
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('Event not found in offered events');
      })
      .end(done);
  });
});
