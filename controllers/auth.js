import bcrypt from 'bcryptjs';
import {User} from '../models/index.js';
import {issueToken} from '../config/index.js';

/**
 * Register new user
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {shape} next Next object
 * @return {shape} JSON
 */
export function register(req, res, next) {
  const {username, password, email} = req.body;
  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'You need to provide a password',
    });
  }

  if (!username || !email) {
    return res.status(400).json({
      success: false,
      message: 'You need to provide both username and email',
    });
  }

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) return next(err);

    const user = new User({username, email, password: hashedPassword});
    const unique = await user.isUserUnique();

    if (!unique.success) return res.status(400).json(unique);

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
      return res.status(400).json({
        success: true,
        message: 'You need to provide a password.',
      });
    }
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'You need to provide either username or email.',
      });
    }

    let user;
    if (username) {
      user = await User.findOne({username}).lean().exec();
    }
    if (!user && email) {
      user = await User.findOne({email}).lean().exec();
    }
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No such user',
      });
    }

    const result = bcrypt.compareSync(password, user.password);
    if (!result) {
      return res.status(400).json({
        success: false,
        message: 'Wrong password.',
      });
    }
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
