import express, {json, urlencoded} from 'express';
import {passport} from './config/index.js';

const app = express();
app.use(json());
app.use(passport.initialize());
app.use(urlencoded({extended: false}));
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({success: false, message: err.message});
});

export default app;
