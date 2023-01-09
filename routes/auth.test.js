import request from 'supertest';
import express from 'express';

import {authRouter} from './index.js';

const app = express();
app.use(express.urlencoded({extended: false}));
app.use('/auth', authRouter);

describe('POST /auth/register', function() {
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
        .send({
          username: undefined,
          email: 'example@example.com',
          password: '1234',
        });
    expect(response.body.success).toBeFalsy();
  });
});
