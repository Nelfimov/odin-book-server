import request from 'supertest';
import {profileRouter, authRouter} from './index.js';
import {initializeMongoServer, stopMongoServer} from '../config/index.js';
import app from '../app-test.js';
import {User} from '../models/index.js';

app.use('/profile', profileRouter);
app.use('/auth', authRouter);


describe('GET /profile/:id', () => {
  let you;
  let friend;
  let enemy;

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
    enemy = await request(app)
        .post('/auth/register')
        .send({
          username: 'Example 3',
          email: 'example3@example.com',
          password: '111',
        });
  });

  afterAll(async () => {
    await stopMongoServer();
  });

  it('cannot send friend request to yourself', async () => {
    const response = await request(app)
        .get(`/profile/${you.body.user._id}/request`)
        .set('Authorization', you.body.token);
    expect(response.body.success).toBeFalsy();
    const user = await User.findById(you.body.user._id)
        .populate({path: 'friends', populate: {path: 'user'}}).lean().exec();
    expect(user.friends.length).toBe(0);
  });

  it('can send friend request', async () => {
    const response = await request(app)
        .get(`/profile/${friend.body.user._id}/request`)
        .set('Authorization', you.body.token);
    expect(response.body.success).toBeTruthy();
    const user1 = await User.findById(you.body.user._id)
        .populate({path: 'friends', populate: {path: 'user'}}).lean().exec();
    expect(user1.friends[0].status).toBe('requested');
    const user2 = await User.findById(friend.body.user._id)
        .populate({path: 'friends', populate: {path: 'user'}}).lean().exec();
    expect(user2.friends[0].status).toBe('pending');
  });

  it('can accept friend request', async () => {
    const response = await request(app)
        .get(`/profile/${you.body.user._id}/accept`)
        .set('Authorization', friend.body.token);
    expect(response.body.success).toBeTruthy();
    const user1 = await User.findById(you.body.user._id)
        .populate({path: 'friends', populate: {path: 'user'}}).lean().exec();
    expect(user1.friends[0].status).toBe('friends');
    const user2 = await User.findById(friend.body.user._id)
        .populate({path: 'friends', populate: {path: 'user'}}).lean().exec();
    expect(user2.friends[0].status).toBe('friends');
  });

  it('can reject friend request', async () => {
    const responseEnemy = await request(app)
        .get(`/profile/${you.body.user._id}/request`)
        .set('Authorization', enemy.body.token);
    expect(responseEnemy.body.success).toBeTruthy();
    const response = await request(app)
        .get(`/profile/${enemy.body.user._id}/reject`)
        .set('Authorization', you.body.token);
    expect(response.body.success).toBeTruthy();
    const user1 = await User.findById(you.body.user._id)
        .populate({path: 'friends', populate: {path: 'user'}})
        .lean().exec();
    expect(user1.friends[1].status).toBe('rejected');
    const user2 = await User.findById(enemy.body.user._id)
        .populate({path: 'friends', populate: {path: 'user'}})
        .lean().exec();
    expect(user2.friends[0].status).toBe('requested');
  });

  it('can delete from friends list', async () => {
    const response = await request(app)
        .get(`/profile/${enemy.body.user._id}/delete`)
        .set('Authorization', you.body.token);
    expect(response.body.success).toBeTruthy();
    const user1 = await User.findById(you.body.user._id)
        .populate({path: 'friends', populate: {path: 'user'}})
        .lean().exec();
    expect(user1.friends.length).toBe(1);
    const user2 = await User.findById(enemy.body.user._id)
        .populate({path: 'friends', populate: {path: 'user'}})
        .lean().exec();
    expect(user2.friends.length).toBe(0);
  });
});
