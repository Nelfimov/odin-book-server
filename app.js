import createError from 'http-errors';
import express, {json, urlencoded} from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import * as dotenv from 'dotenv';

dotenv.config();

import {connectMongoose, passport} from './config/index.js';
import {authRouter, postRouter,
  profileRouter, startRouter} from './routes/index.js';

const app = express();

connectMongoose(process.env.MONGODB_URL);

app.use(logger('dev'));
app.use(json());
app.use(passport.initialize());
app.use(cookieParser());
app.use(urlencoded({extended: false}));

app.use('/', startRouter);
app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/profile', profileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err.message);
  return res.json({success: false, message: err.message});
});

export default app;
