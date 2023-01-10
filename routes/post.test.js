import request from 'supertest';
import {postRouter} from './index.js';
import {initializeMongoServer, stopMongoServer} from '../config/index.js';
import app from '../app-test.js';

app.use('/posts', postRouter);

describe('GET /posts', () => {
  beforeAll(async () => {
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
        .post({
          username: 'Example',
          email: 'example@example.com',
          password: '1234',
        });
    const responsePost = await request(app)
        .get('/posts')
        .auth(responseRegister.body.token, {type: 'bearer'});
    expect(responsePost.body.success).toBeTruthy();
  });
});

describe('POST /posts', () => {

});
