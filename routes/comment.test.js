import request from 'supertest';
import {initializeMongoServer, stopMongoServer} from '../config/index.js';
import app from '../app-test.js';


describe('/comments', () => {
  let user;
  let post;

  beforeAll(async () => {
    await initializeMongoServer();
    user = await request(app)
        .post('/auth/register')
        .send({
          username: 'Example',
          email: 'example@example.com',
          password: '1234',
        });
    post = await request(app)
        .post('/posts')
        .set('Authorization', user.body.token)
        .send({
          title: 'test',
          text: 'text',
          author: user.body.user._id,
        });
  });

  afterAll(async () => {
    await stopMongoServer();
  });

  it('can view comments with authorization', async () => {
    const response = await request(app)
        .get(`/posts/${post.body.post._id}/comments`)
        .set('Authorization', user.body.token);
    expect(response.body.success).toBeTruthy();
  });

  it('can create comments', async () => {
    const response = await request(app)
        .post(`/posts/${post.body.post._id}/comments`)
        .set('Authorization', user.body.token)
        .send({
          text: 'comment text',
        });
    expect(response.body.success).toBeTruthy();
    expect(response.body.comment.author.username).toBe('Example');
  });
});
