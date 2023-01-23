/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { User } from '../models/index.js';
import * as dotenv from 'dotenv';
import { Request } from 'express';
import { Token } from '../types/common/index.js';

dotenv.config();

const customPassport = passport;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};

customPassport.use(
  new Strategy(opts, (req: Request, payload: Token, done: VerifiedCallback) => {
    User.findById(payload.sub, (err: Error, result: any) => {
      if (err != null) {
        done(err, false);
        return;
      }

      if (result != null) {
        req.user = result;
        done(null, result);
        return;
      }
      done(null, false);
    }).catch((err) => {
      console.log(err);
    });
  })
);

export default customPassport;
