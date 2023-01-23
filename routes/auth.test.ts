/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest';
import { initializeMongoServer, stopMongoServer } from '../config/index.js';
import app from '../app-test.js';

describe('POST /auth/register', () => {
  beforeAll(async () => {
    await stopMongoServer();
    await initializeMongoServer();
  });

  afterAll(async () => {
    await stopMongoServer();
  });

  it('error if no email', async () => {
    const response = await request(app).post('/auth/register').send({
      username: 'Example',
      email: undefined,
      password: '1234',
    });
    expect(response.body.success).toBeFalsy();
  });

  it('error if no username', async () => {
    const response = await request(app).post('/auth/register').send({
      username: undefined,
      email: 'example@example.com',
      password: '1234',
    });
    expect(response.body.success).toBeFalsy();
  });

  it('registers', async () => {
    const response = await request(app).post('/auth/register').send({
      password: '123456789',
      username: 'Example',
      email: 'example@example.com',
    });
    expect(response.body.success).toBeTruthy();
  });
});

describe('POST /auth/login', () => {
  let user;

  beforeAll(async () => {
    await initializeMongoServer();
    user = await request(app).post('/auth/register').send({
      username: 'Example',
      email: 'example@example.com',
      password: '1234',
    });
  });

  afterAll(async () => {
    await stopMongoServer();
  });

  it('fails if no username and email provided', async () => {
    const response = await request(app).post('/auth/login').send({
      password: '1234',
    });
    expect(response.body.success).toBeFalsy();
  });

  it('wrong password', async () => {
    const response = await request(app).post('/auth/login').send({
      username: 'Example',
      password: '4321',
    });
    expect(response.body.success).toBeFalsy();
  });

  it('successfully logs in', async () => {
    const response = await request(app).post('/auth/login').send({
      username: 'Example',
      password: '1234',
    });
    expect(response.body.success).toBeTruthy();
  });
});
