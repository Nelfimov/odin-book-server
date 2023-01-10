import request from 'supertest';
import {postRouter, authRouter} from './index.js';
import {initializeMongoServer, stopMongoServer} from '../config/index.js';
import app from '../app-test.js';

app.use('/posts', postRouter);
app.use('/auth', authRouter);


describe('GET /posts', () => {
  beforeEach(async () => {
    await stopMongoServer();
    await initializeMongoServer();
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
    const responseRegister = await request(app)
        .post('/auth/register')
        .send({
          username: 'Example',
          email: 'example@example.com',
          password: '1234',
        });
    expect(responseRegister.body.success).toBeTruthy();
    const responsePost = await request(app)
        .get('/posts')
        .set('Authorization', responseRegister.body.token);
    expect(responsePost.body.success).toBeTruthy();
  });
});

describe('POST /posts', () => {
  beforeAll(async () => {
    await stopMongoServer();
    await initializeMongoServer();
  });

  afterAll(async () => {
    await stopMongoServer();
  });

  it('creates new post', async () => {
    const responseRegister = await request(app)
        .post('/auth/register')
        .send({
          username: 'Example',
          email: 'example@example.com',
          password: '1234',
        });
    expect(responseRegister.body.success).toBeTruthy();
    const responsePost = await request(app)
        .post('/posts')
        .set('Authorization', responseRegister.body.token)
        .send({
          text: 'this is a new post',
          title: 'title',
        });
    expect(responsePost.body.success).toBeTruthy();
    expect(responsePost.body.post.title).toBe('title');
    expect(responsePost.body.post.author.username).toBe('Example');
  });
});
