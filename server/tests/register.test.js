import request from 'supertest';
import app from '../server.js'; // Adjust the path to your server.js

test('POST /api/auth/registerTest', () => { // Updated route for the test
  it('should register a new user', async () => {
    const newUser = {
      username: 'testuser',
      password: 'password123',
      email: 'testuser@example.com'
    };

    const response = await request(app)
      .post('/api/auth/registerTest')
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Registration successful');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('email', newUser.email);
    expect(response.body.user).toHaveProperty('username', newUser.username);
  });

  it('should not register a user with an existing email', async () => {
    const existingUser = {
      username: 'existinguser',
      password: 'password123',
      email: 'testuser@example.com' // Use the same email as the previous test
    };

    const response = await request(app)
      .post('/api/auth/registerTest')
      .send(existingUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'User already exists');
  });
});
