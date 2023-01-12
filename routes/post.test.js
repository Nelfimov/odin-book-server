import request from 'supertest';
import {postRouter, authRouter} from './index.js';
import {initializeMongoServer, stopMongoServer} from '../config/index.js';
import app from '../app-test.js';
import {Post} from '../models/index.js';

app.use('/posts', postRouter);
app.use('/auth', authRouter);


describe('GET /posts', () => {
  let user;

  beforeAll(async () => {
    await initializeMongoServer();
    user = await request(app)
        .post('/auth/register')
        .send({
          username: 'Example',
          email: 'example@example.com',
          password: '1234',
        });
  });

  afterAll(async () => {
    await stopMongoServer();
  });

  it('no access without authorization', async () => {
    const response = await request(app)
        .get('/posts');
    expect(response.body.success).toBeFalsy();
  });

  it('has access with authorization', async () => {
    const response = await request(app)
        .get('/posts')
        .set('Authorization', user.body.token);
    expect(response.body.success).toBeTruthy();
  });
});

describe('POST /posts', () => {
  let user;
  let enemy;

  beforeAll(async () => {
    await initializeMongoServer();
    user = await request(app)
        .post('/auth/register')
        .send({
          username: 'Example',
          email: 'example@example.com',
          password: '1234',
        });
    enemy = await request(app)
        .post('/auth/register')
        .send({
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
});
