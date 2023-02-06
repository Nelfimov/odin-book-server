import jwt from 'jsonwebtoken';
import { User, Token } from '../types/common/index.js';

/**
 * Issue token for the user.
 */
export default function issueJWT(user: User): Token | undefined {
  const id = user._id;
  const expiresIn = '1d';

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.log('Secret cannot be read.');
    return;
  }
  const signedToken = jwt.sign(payload, secret, { expiresIn });

  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn,
  };
}
