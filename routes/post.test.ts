import request from 'supertest';
import { initializeMongoServer, stopMongoServer } from '../config/index.js';
import app from '../app-test.js';
import { Post } from '../models/index.js';

describe('GET /posts', () => {
  let user;
  let friend;

  beforeAll(async () => {
    await initializeMongoServer();
    user = await request(app).post('/auth/register').send({
      username: 'Example',
      email: 'example@example.com',
      password: '1234',
    });
    friend = await request(app).post('/auth/register').send({
      username: 'Example Friend',
      email: 'exampleFriend@example.com',
      password: '1111',
    });
  });

  afterAll(async () => {
    await stopMongoServer();
  });

  it('no access without authorization', async () => {
    const response = await request(app).get('/posts');
    expect(response.body.success).toBeFalsy();
  });

  it('has access with authorization', async () => {
    const response = await request(app)
      .get('/posts')
      .set('Authorization', user.body.token);
    expect(response.body.success).toBeTruthy();
  });

  it('can get posts from friends', async () => {
    const createPost = await request(app)
      .post('/posts')
      .set('Authorization', user.body.token)
      .send({
        text: 'this is a new post',
        title: 'title',
      });
    expect(createPost.body.success).toBeTruthy();

    const createFriend = await request(app)
      .get(`/profile/${friend.body.user._id}/request`)
      .set('Authorization', user.body.token);
    expect(createFriend.body.success).toBeTruthy();

    const acceptFriend = await request(app)
      .get(`/profile/${user.body.user._id}/accept`)
      .set('Authorization', friend.body.token);
    expect(acceptFriend.body.success).toBeTruthy();

    const response = await request(app)
      .get('/posts/friends')
      .set('Authorization', friend.body.token);
    expect(response.body.success).toBeTruthy();
    expect(response.body.posts.length).toBe(1);
  });
});

describe('POST /posts', () => {
  let user;
  let enemy;

  beforeAll(async () => {
    await initializeMongoServer();
    user = await request(app).post('/auth/register').send({
      username: 'Example',
      email: 'example@example.com',
      password: '1234',
    });
    enemy = await request(app).post('/auth/register').send({
      username: 'Example Enemy',
      email: 'exampleEnemy@example.com',
      password: '4321',
    });
  });

  afterAll(async () => {
    await stopMongoServer();
  });

  it('creates new post', async () => {
    const response = await request(app)
      .post('/posts')
      .set('Authorization', user.body.token)
      .send({
        text: 'this is a new post',
        title: 'title',
      });
    expect(response.body.success).toBeTruthy();
    expect(response.body.post.title).toBe('title');
    expect(response.body.post.author.username).toBe('Example');
  });

  it('cannot like own post', async () => {
    const post = await Post.findOne({}).populate('author').lean().exec();
    expect(post.author.username).toBe(user.body.user.username);

    const response = await request(app)
      .get(`/posts/${post._id}/like`)
      .set('Authorization', user.body.token);
    expect(response.body.success).toBeFalsy();
  });

  it('changes post', async () => {
    const post = await Post.findOne({}).exec();
    expect(post.author._id.equals(user.body.user._id)).toBeTruthy();

    const response = await request(app)
      .patch(`/posts/${post._id}`)
      .send({
        text: 'new text',
        title: 'new title',
      })
      .set('Authorization', user.body.token);
    expect(response.body.success).toBeTruthy();
  });

  it('cannot change others post', async () => {
    const post = await Post.findOne({}).exec();
    expect(post.author._id.equals(enemy.body.user._id)).toBeFalsy();

    const response = await request(app)
      .patch(`/posts/${post._id}`)
      .send({
        text: 'new text new',
        title: 'new title new',
      })
      .set('Authorization', enemy.body.token);
    expect(response.body.success).toBeFalsy();
    expect(response.statusCode).toBe(400);
  });

  it('cannot publish other posts', async () => {
    let post = await Post.findOne({}).exec();
    expect(post.author._id.equals(enemy.body.user._id)).toBeFalsy();

    const response = await request(app)
      .patch(`/posts/${post._id}/publish`)
      .set('Authorization', enemy.body.token);
    expect(response.body.success).toBeFalsy();
    post = await Post.findOne({}).exec();
    expect(post.isPublished).toBeFalsy();
  });

  it('can publish own posts', async () => {
    const post = await Post.findOne({}).exec();
    expect(post.author._id.equals(user.body.user._id)).toBeTruthy();

    const response = await request(app)
      .patch(`/posts/${post._id}/publish`)
      .set('Authorization', user.body.token);
    expect(response.body.success).toBeTruthy();
    expect(response.body.post.isPublished).toBeTruthy();
  });
});
