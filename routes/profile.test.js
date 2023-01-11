import request from 'supertest';
import {profileRouter, authRouter} from './index.js';
import {initializeMongoServer, stopMongoServer} from '../config/index.js';
import app from '../app-test.js';

app.use('/profile', profileRouter);
app.use('/auth', authRouter);


describe('POST /profile/:id', () => {
  beforeAll(async () => {
    await initializeMongoServer();
    await request(app)
        .post('/auth/register')
        .send({
          username: 'Example 1',
          email: 'example1@example.com',
          password: '123',
        });
    await request(app)
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
    const responseLogin = await request(app)
        .post('/auth/login')
        .send({
          username: 'Example 1',
          password: '123',
        });
    expect(responseLogin.body.success).toBeTruthy();
    const responseLoginFriend = await request(app)
        .post('/auth/login')
        .send({
          username: 'Example 2',
          password: '321',
        });
    expect(responseLoginFriend.body.user.id).toBe();
    const responseFriend = await request(app)
        .post(`/profile/${responseLoginFriend.body.user._id}/request`)
        .set('Authorization', responseLogin.body.token);
    console.log(responseFriend.statusCode);
    expect(responseFriend.body.success).toBeTruthy();
  });
});
