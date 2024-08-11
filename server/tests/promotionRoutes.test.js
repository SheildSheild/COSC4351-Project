import express from 'express';
import request from 'supertest';
import userRouter from '../routes/promotionRoutes.js'; // Adjust the path to your router file
import connectToDatabase from '../mongoConnect.js';

const app = express();
app.use(express.json());
app.use('/users', userRouter);

let db;

beforeAll(async () => {
  db = await connectToDatabase();
});

afterEach(async () => {
  const usersCollection = db.collection("users");

  // Clean up test users
  await usersCollection.deleteMany({ username: { $in: ["testUser", "adminUser"] } });
});

afterAll(async () => {
  // Cleanup the database connection
  await db.client.close();
});

describe('User Routes', () => {
  beforeEach(async () => {
    const usersCollection = db.collection("users");
    await usersCollection.insertMany([
      { id: 1, username: "testUser", role: "user" },
      { id: 2, username: "adminUser", role: "admin" }
    ]);
  });

  it('should update a user role', async () => {
    const response = await request(app)
      .put('/users/1/role')
      .send({ role: 'admin' })
      .expect(200);

    expect(response.body.message).toBe('User role updated successfully');
    expect(response.body.user).toMatchObject({
      id: 1,
      role: 'admin'
    });
  });

  it('should return 404 if user not found when updating role', async () => {
    const response = await request(app)
      .put('/users/999/role')
      .send({ role: 'admin' })
      .expect(404);

    expect(response.body.message).toBe('User not found');
  });

  it('should fetch all users who are not admins', async () => {
    const response = await request(app)
      .get('/users')
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ username: 'testUser', role: 'user' })
      ])
    );

    expect(response.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ username: 'adminUser', role: 'admin' })
      ])
    );
  });

  it('should return 500 if error occurs during fetching users', async () => {
    jest.spyOn(db.collection("users"), 'find').mockImplementationOnce(() => {
      throw new Error('Fetch error');
    });

    const response = await request(app)
      .get('/users')
      .expect(500);

    expect(response.body.message).toBe('An error occurred while fetching users');
  });
});
