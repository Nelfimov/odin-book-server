import request from 'supertest';
import {postRouter, authRouter} from './index.js';
import {initializeMongoServer, stopMongoServer} from '../config/index.js';
import app from '../app-test.js';

app.use('/posts', postRouter);
app.use('/auth', authRouter);


describe('/comments', () => {
  beforeAll(async () => {
    await stopMongoServer();
    await initializeMongoServer();
  });

  afterAll(async () => {
    await stopMongoServer();
  });

  it('can view comments with authorization', async () => {
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
          title: 'test',
          text: 'text',
          author: responseRegister.body.user._id,
        });
    expect(responsePost.body.success).toBeTruthy();
    const responseComment = await request(app)
        .get(`/posts/${responsePost.body.post._id}/comments`)
        .set('Authorization', responseRegister.body.token);
    expect(responseComment.body.success).toBeTruthy();
  });

  it('can create comments', async () => {
    const responseLogin = await request(app)
        .post('/auth/login')
        .send({
          username: 'Example',
          password: '1234',
        });
    expect(responseLogin.body.success).toBeTruthy();
    const responsePost = await request(app)
        .post('/posts')
        .set('Authorization', responseLogin.body.token)
        .send({
          title: 'test',
          text: 'text',
          author: responseLogin.body.user._id,
        });
    expect(responsePost.body.success).toBeTruthy();
    const responseComment = await request(app)
        .post(`/posts/${responsePost.body.post._id}/comments`)
        .set('Authorization', responseLogin.body.token)
        .send({
          text: 'comment text',
        });
    expect(responseComment.body.success).toBeTruthy();
    expect(responseComment.body.comment.author.username).toBe('Example');
  });
});
