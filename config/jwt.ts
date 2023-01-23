import jwt from 'jsonwebtoken';
import { User, Token } from '../types/common/index.js';

/**
 * Issue token for the user.
 */
export default function issueJWT(user: User): Token {
  const id = user._id;
  const expiresIn = '1d';

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const secret: string = process.env.JWT_SECRET ?? '';

  const signedToken: string = jwt.sign(payload, secret, { expiresIn });

  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn,
  };
}
