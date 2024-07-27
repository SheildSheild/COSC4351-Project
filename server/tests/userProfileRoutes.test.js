import request from 'supertest';
import express from 'express';
import profileRoutes from '../routes/userProfileRoutes.js';

const app = express();
app.use(express.json());
app.use('/profile', profileRoutes);

describe('Profile Routes', () => {
  let users;

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
        offeredEvents: [],
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

  it('should get the user profile', (done) => {
    request(app)
      .get('/profile/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.username).toBe('user');
      })
      .end(done);
  });

  it('should return 404 if user profile not found', (done) => {
    request(app)
      .get('/profile/999')
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('User not found');
      })
      .end(done);
  });

  it('should update the user profile', (done) => {
    const updatedProfile = {
      username: 'updateduser',
      email: 'updateduser@example.com',
      fullName: 'Updated Name',
      address1: 'Updated Address 1',
      address2: 'Updated Address 2',
      city: 'Updated City',
      state: 'Updated State',
      zipCode: 'Updated ZipCode',
      skills: [1, 3],
      preferences: 'Updated preferences',
      availability: ['2024-08-01']
    };

    request(app)
      .put('/profile/1')
      .send(updatedProfile)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Profile updated successfully');
      })
      .end((err) => {
        if (err) return done(err);
        // Verify that the profile was actually updated
        const user = users.find(user => user.id === 1);
        expect(user).toMatchObject(updatedProfile);
        done();
      });
  });

  it('should return 400 if trying to update a non-existent user profile', (done) => {
    const updatedProfile = {
      username: 'updateduser',
      email: 'updateduser@example.com',
      fullName: 'Updated Name',
      address1: 'Updated Address 1',
      address2: 'Updated Address 2',
      city: 'Updated City',
      state: 'Updated State',
      zipCode: 'Updated ZipCode',
      skills: [1, 3],
      preferences: 'Updated preferences',
      availability: ['2024-08-01']
    };

    request(app)
      .put('/profile/999')
      .send(updatedProfile)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('User not found');
      })
      .end(done);
  });

  it('should return 400 if the update data is invalid', (done) => {
    const invalidProfile = {
      username: '',  // Empty username is invalid
      email: 'invalid-email',  // Invalid email format
      fullName: 'Updated Name',
      address1: 'Updated Address 1',
      address2: 'Updated Address 2',
      city: 'Updated City',
      state: 'Updated State',
      zipCode: 'Updated ZipCode',
      skills: [1, 3],
      preferences: 'Updated preferences',
      availability: ['2024-08-01']
    };

    request(app)
      .put('/profile/1')
      .send(invalidProfile)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid profile data');
      })
      .end(done);
  });

  it('should return 400 if required fields are missing in the update', (done) => {
    const incompleteProfile = {
      fullName: 'Updated Name',
      address1: 'Updated Address 1',
      address2: 'Updated Address 2',
      city: 'Updated City',
      state: 'Updated State',
      zipCode: 'Updated ZipCode',
      skills: [1, 3],
      preferences: 'Updated preferences',
      availability: ['2024-08-01']
    };

    request(app)
      .put('/profile/1')
      .send(incompleteProfile)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid profile data');
      })
      .end(done);
  });
});
