jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn((mailOptions, callback) => {
        callback(null, { response: 'Mock email sent' });
      })
    })
  };
});

import express from 'express';
import request from 'supertest';
import authRoutes from '../routes/authRoutes.js';
import connectToDatabase from '../mongoConnect.js';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

const jwtSecret = 'my_secret';

let db;

beforeAll(async () => {
  db = await connectToDatabase();
});

afterEach(async () => {
  const usersCollection = db.collection("users");

  // Remove the newly registered user
  await usersCollection.deleteMany({ email: "newuser@example.com" });
});

afterAll(async () => {
  // Cleanup the database connection
  await db.client.close();
});

// Tests for auth routes
describe('Auth Routes', () => {
  it('should login a user with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'user@email.com', password: 'user' })
      .expect(200);

    expect(response.body.message).toBe('Login successful');
    expect(response.body.user).toMatchObject({
      email: 'user@email.com',
      role: 'user'
    });
  });

  it('should not login a user with invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'invalid@example.com', password: 'wrongpassword' })
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'newuser', email: 'newuser@example.com', password: 'newpassword' })
      .expect(201);

    expect(response.body.message).toBe('Registration successful. Please check your email for verification link.');
    expect(response.body.user).toMatchObject({
      email: 'newuser@example.com',
      username: 'newuser',
      role: 'user'
    });
  }, 10000); // Set timeout to 10 seconds

  it('should not register an existing user', async () => {
    const existingUser = {
      username: 'user',
      password: 'user',
      email: 'user@email.com'
    };

    const response = await request(app)
      .post('/auth/register')
      .send(existingUser)
      .expect(400);

    expect(response.body.message).toBe('User already exists');
  });

  it('should fail email verification with invalid token', async () => {
    const response = await request(app)
      .get('/auth/verify-email?token=invalidtoken')
      .expect(500);

    expect(response.body.message).toBe('An error occurred while verifying email');
  });

  it('should fail login if email is not verified', async () => {
    await request(app)
      .post('/auth/register')
      .send({ username: 'unverifieduser', email: 'unverified@example.com', password: 'password' })

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'unverified@example.com', password: 'password' })
      .expect(403);

    expect(response.body.message).toBe('Email not verified. Please check your email.');
  });

  it('should fail registration if user data is incomplete', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ username: '', email: 'newuser3@example.com', password: 'newpassword' })
      .expect(400);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: 'Username is required' })
        ])
      );
    });
  
    it('should return error for invalid token', async () => {
      const response = await request(app)
        .get('/auth/verify-email?token=invalidtoken')
        .expect(500);
  
      expect(response.body.message).toBe('An error occurred while verifying email');
    });
  
    it('should return error for already verified user', async () => {
      // Register and verify a new user
      await request(app)
        .post('/auth/register')
        .send({ username: 'newuser', email: 'newuser@example.com', password: 'newpassword' });
  
      const userId = 1; // Replace with logic to get the actual user ID if needed
      const email = 'newuser@example.com';
      const token = jwt.sign({ userId, email }, jwtSecret, { expiresIn: '1h' });
  
      // Verify email with the generated token
      await request(app)
        .get(`/auth/verify-email?token=${token}`);
  
      // Attempt to verify again
      const response = await request(app)
        .get(`/auth/verify-email?token=${token}`)
        .expect(404);
  
      expect(response.body.message).toBe('User not found or already verified.');
    });
  });