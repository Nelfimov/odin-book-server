import passport from 'passport';
import {Strategy, ExtractJwt} from 'passport-jwt';

const customPassport = passport;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};

customPassport.use(new Strategy(opts, (req, payload, done) => {

}));

export default customPassport;
