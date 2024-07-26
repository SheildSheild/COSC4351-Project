import express from 'express';
import request from 'supertest';
import authRoutes from '../routes/authRoutes.js';
import connectToDatabase from '../mongoConnect.js';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

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
    const newUser = {
      username: 'newuser',
      password: 'newpassword',
      email: 'newuser@example.com'
    };

    const response = await request(app)
      .post('/auth/register')
      .send(newUser)
      .expect(201);

    expect(response.body.message).toBe('Registration successful');
    expect(response.body.user).toMatchObject({
      email: newUser.email,
      username: newUser.username,
      role: 'user'
    });
  });

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
});
