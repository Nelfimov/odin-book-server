import request from 'supertest';
import express from 'express';

import {startRouter} from './index.js';

const app = express();
app.use(express.urlencoded({extended: false}));
app.use('/', startRouter);

describe('GET /', function() {
  it('responds with success', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBeTruthy();
  });
});
