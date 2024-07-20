// test/profileRoutes.test.js

import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import profileRoutes from '../server/routes/userProfileRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock data paths
const usersFilePath = path.join(__dirname, '../client/src/components/mockData/fake_users.json');

// Load initial mock data
const initialUsers = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

// Create an instance of the Express app
const app = express();
app.use(express.json());
app.use('/profile', profileRoutes);

// Restore initial mock data after each test
afterEach(() => {
  fs.writeFileSync(usersFilePath, JSON.stringify(initialUsers, null, 2));
});

describe('Profile Routes', () => {
  it('should get the user profile', (done) => {
    request(app)
      .get('/profile/user/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.username).toBe('user');
      })
      .end(done);
  });

  it('should return 404 if user profile not found', (done) => {
    request(app)
      .get('/profile/user/999')
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
      location: 'Updated Location',
      skills: [1, 3],
      preferences: 'Updated preferences',
      availability: '2024-08-01'
    };

    request(app)
      .put('/profile/user/1')
      .send(updatedProfile)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Profile updated successfully!');
      })
      .end((err) => {
        if (err) return done(err);
        // Verify that the profile was actually updated
        const updatedUsers = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
        const user = updatedUsers.find(user => user.id === 1);
        expect(user).toMatchObject(updatedProfile);
        done();
      });
  });

  it('should return 400 if trying to update a non-existent user profile', (done) => {
    const updatedProfile = {
      username: 'updateduser',
      email: 'updateduser@example.com',
      location: 'Updated Location',
      skills: [1, 3],
      preferences: 'Updated preferences',
      availability: '2024-08-01'
    };

    request(app)
      .put('/profile/user/999')
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
      location: 'Updated Location',
      skills: [1, 3],
      preferences: 'Updated preferences',
      availability: '2024-08-01'
    };

    request(app)
      .put('/profile/user/1')
      .send(invalidProfile)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid profile data');
      })
      .end(done);
  });

  it('should return 400 if required fields are missing in the update', (done) => {
    const incompleteProfile = {
      // Missing username and email
      location: 'Updated Location',
      skills: [1, 3],
      preferences: 'Updated preferences',
      availability: '2024-08-01'
    };

    request(app)
      .put('/profile/user/1')
      .send(incompleteProfile)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid profile data');
      })
      .end(done);
  });
});
