import request from 'supertest';
import {postRouter, authRouter} from './index.js';
import {initializeMongoServer, stopMongoServer} from '../config/index.js';
import app from '../app-test.js';

app.use('/posts', postRouter);
app.use('/auth', authRouter);

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

/*
describe('POST /posts', () => {

});
*/
