import bcryptjs from 'bcryptjs';
import {User} from '../models/index.js';

const noPassword = {
  success: false,
  message: 'You need to provide a password.',
};

const noUsernameOrEmail = {
  success: false,
  message: 'You need to provide either username or email.',
};

const noUsernameAndEmail = {
  success: false,
  message: 'You need to provide both username and email',
};

const wrongPassword = {
  success: false,
  message: 'Wrong password, try again',
};

/**
 * Register new user
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {shape} next Next object
 * @return {shape} Response
 */
export function register(req, res, next) {
  const {username, password, email} = req.body;
  if (!password) return res.json(noPassword);
  if (!username && !email) return res.json(noUsernameAndEmail);

  bcryptjs.hash(password, process.env.SALT, (err, hashedPassword) => {
    if (err) return next(err);

    const user = new User({username, email, password: hashedPassword});
    const unique = user.isUserUnique(username, email);

    if (!unique) return res.json(unique);

    user.save()
        .then((user) => res.json({
          success: true,
          message: 'Successfully registered, you can now log in.',
          user,
          token: jwt.token,
          expiresIn: jwt.expiresIn,
        }))
        .catch((err) => next(err));
  });
};

/**
 * Log in with given credentials
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {shape} next Next object
 * @return {shape}
 */
export async function login(req, res, next) {
  const {username, email, password} = req.body;
  if (!password) return res.json(noPassword);
  if (!username || !email) return res.json(noUsernameOrEmail);

  let user;

  if (username) {
    user = await User.findOne({username}).exec();
  }

  if (email && !user) {
    user = await User.findOne({email}).exec();
  }

  const result = bcryptjs.compareSync(password, user.password);
  if (!result) res.json(wrongPassword);
  const jwt = issueJWT(user);
  return res.json({
    success: true,

    message: 'Successfull log in',
    user,
    jwt,
    expiresIn: jwt.expires,
  });
};
