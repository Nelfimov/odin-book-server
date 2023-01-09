import passport from 'passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import {User} from '../models/index.js';

const customPassport = passport;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};

customPassport.use(new Strategy(opts, (req, payload, done) => {
  User.findById(payload.sub, (err, user) => {
    if (err) return done(err, false);

    if (user) {
      req.user = user;
      return done(null, user);
    };

    return done(null, false);
  });
}));

export default customPassport;
