import bcrypt from 'bcryptjs';
import {User} from '../models/index.js';
import {issueToken, MyError} from '../config/index.js';

/**
 * Register new user
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {shape} next Next object
 */
export function register(req, res, next) {
  const {username, password, email} = req.body;
  if (!password) {
    throw new MyError(
        'You need to provide a password.',
        400,
    );
  }

  if (!username || !email) {
    throw new MyError(
        'You need to provide both username and email',
        400,
    );
  }

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) return next(err);

    const user = new User({username, email, password: hashedPassword});
    const unique = await user.isUserUnique();

    if (!unique.success) throw new MyError(unique);

    await user.save();

    const jwt = issueToken(user);

    return res.status(201).json({
      success: true,
      message: 'Successfully registered, you can now log in.',
      user,
      token: jwt.token,
      expiresIn: jwt.expiresIn,
    });
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
  try {
    const {username, email, password} = req.body;
    if (!password) {
      throw new MyError(
          'You need to provide a password.',
          400,
      );
    }
    if (!username) {
      if (!email) {
        throw new MyError('You need to provide either username or email', 400);
      }
    }

    let user;
    if (username) {
      user = await User.findOne({username}).lean().exec();
    }
    if (!user && email) {
      user = await User.findOne({email}).lean().exec();
    }
    if (!user) throw new MyError('No such user', 400);

    const result = bcrypt.compareSync(password, user.password);
    if (!result) throw new MyError('Wrong password, try again', 400);
    const jwt = issueToken(user);
    return res.json({
      success: true,
      message: 'Successfull log in',
      user,
      token: jwt.token,
      expiresIn: jwt.expires,
    });
  } catch (err) {
    next(err);
  }
};
