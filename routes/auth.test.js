import request from 'supertest';
import {authRouter} from './index.js';
import {initializeMongoServer, stopMongoServer} from '../config/index.js';
import app from '../app-test.js';

app.use('/auth', authRouter);

describe('POST /auth/register', function() {
  beforeAll(async () => {
    await stopMongoServer();
    await initializeMongoServer();
  });

  afterAll(async () => {
    await stopMongoServer();
  });

  it('error if no email', async () => {
    const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'Example',
          email: undefined,
          password: '1234',
        });
    expect(response.body.success).toBeFalsy();
  });

  it('error if no username', async () => {
    const response = await request(app)
        .post('/auth/register')
        .send({username: undefined,
          email: 'example@example.com', password: '1234'});
    expect(response.body.success).toBeFalsy();
  });

  it('registers', async () => {
    const response = await request(app)
        .post('/auth/register')
        .send({password: '123456789', username: 'Example',
          email: 'example@example.com'});
    expect(response.body.success).toBeTruthy();
    expect(response.body.user.username).toBe('Example');
  });
});
