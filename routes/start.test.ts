import request from 'supertest';
import app from '../app-test.js';

describe('GET /', function () {
  it('responds with success', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBeTruthy();
  });
});
