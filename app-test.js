import express, {json, urlencoded} from 'express';
import {passport} from './config/index.js';
import {
  startRouter,
  postRouter,
  authRouter,
  profileRouter,
} from './routes/index.js';

const app = express();
app.use(json());
app.use(passport.initialize());
app.use(urlencoded({extended: false}));
app.use('/', startRouter);
app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/profile', profileRouter);
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  // console.error(err.message);
  return res.json({success: false, message: err.message});
});

export default app;
