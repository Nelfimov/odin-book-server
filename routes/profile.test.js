import request from 'supertest';
import {profileRouter, authRouter} from './index.js';
import {initializeMongoServer, stopMongoServer} from '../config/index.js';
import app from '../app-test.js';

app.use('/profile', profileRouter);
app.use('/auth', authRouter);


describe('POST /profile/:id', () => {
  let you;
  let friend;

  beforeAll(async () => {
    await initializeMongoServer();
    you = await request(app)
        .post('/auth/register')
        .send({
          username: 'Example 1',
          email: 'example1@example.com',
          password: '123',
        });
    friend = await request(app)
        .post('/auth/register')
        .send({
          username: 'Example 2',
          email: 'example2@example.com',
          password: '321',
        });
  });

  afterAll(async () => {
    await stopMongoServer();
  });

  it('can send friend request', async () => {
    const response = await request(app)
        .post(`/profile/${friend.body.user._id}/request`)
        .set('Authorization', you.body.token);
    expect(response.body.success).toBeTruthy();
  });
});
