import createError from 'http-errors';
import express, {json, urlencoded} from 'express';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import * as dotenv from 'dotenv';

dotenv.config();

import {startRouter} from './routes/index.js';

const app = express();

// view engine setup
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use('/', startRouter);

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
  res.render('error');
});

export default app;
