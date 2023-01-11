import request from 'supertest';
import {postRouter, authRouter} from './index.js';
import {initializeMongoServer, stopMongoServer} from '../config/index.js';
import app from '../app-test.js';

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
});
