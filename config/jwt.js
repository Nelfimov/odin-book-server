import jwt from 'jsonwebtoken';

/**
 * Issue token for the user.
 * @param {shape} user User for which to issue token.
 * @return {shape} Object with token and expiration info.
 */
export default function issueJWT(user) {
  const id = user.id;
  const expiresIn = '1d';

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn});

  return {
    token: 'Bearer ' + signedToken,
    expires: expiresIn,
  };
}
