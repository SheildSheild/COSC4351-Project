// test/authRoutes.test.js

import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from '../server/routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock data paths
const usersFilePath = path.join(__dirname, '../client/src/components/mockData/fake_users.json');

// Load initial mock data
const initialUsers = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

// Create an instance of the Express app
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

// Restore initial mock data after each test
afterEach(() => {
  fs.writeFileSync(usersFilePath, JSON.stringify(initialUsers, null, 2));
});

describe('Auth Routes', () => {
  it('should login a user with valid credentials', (done) => {
    request(app)
      .post('/auth/login')
      .send({ email: 'user@email.com', password: 'user' })
      .expect(200)
      .expect((res) => {
        res.body.message === 'Login successful';
      })
      .end(done);
  });

  it('should not login a user with invalid credentials', (done) => {
    request(app)
      .post('/auth/login')
      .send({ email: 'invalid@example.com', password: 'wrongpassword' })
      .expect(401)
      .expect((res) => {
        res.body.message === 'Invalid credentials';
      })
      .end(done);
  });

  it('should register a new user', (done) => {
    const newUser = {
      username: 'newuser',
      password: 'newpassword',
      email: 'newuser@example.com'
    };

    request(app)
      .post('/auth/register')
      .send(newUser)
      .expect(201)
      .expect((res) => {
        res.body.message === 'Registration successful';
      })
      .end(done);
  });

  it('should not register an existing user', (done) => {
    const existingUser = {
      username: 'user',
      password: 'user',
      email: 'user@email.com'
    };

    request(app)
      .post('/auth/register')
      .send(existingUser)
      .expect(400)
      .expect((res) => {
        res.body.message === 'User already exists';
      })
      .end(done);
  });
});
