import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { issueToken } from '../config/index.js';
import { NextFunction, Response, Request } from 'express';

function generateString(length: number): string {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export async function demo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const username = `Anon-${generateString(5)}`;
    const password = bcrypt.hashSync(generateString(8), 10);
    const email = `${username}@example.com`;

    const user = new User({ username, password, email });
    await user.save();
    const jwt = issueToken(user);
    res.status(201).json({
      success: true,
      message: 'Successfully registered, you can now log in.',
      user,
      token: jwt.token,
      expiresIn: jwt.expires,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

/**
 * Register new user
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username, password, email } = req.body;
    if (password == null) {
      res.status(400).json({
        success: false,
        message: 'You need to provide a password',
      });
      return;
    }

    if (username == null || email == null) {
      res.status(400).json({
        success: false,
        message: 'You need to provide both username and email',
      });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    const unique = await user.isUserUnique();

    if (unique.success === false) {
      res.status(400).json(unique);
      return;
    }

    await user.save();

    const jwt = issueToken(user);

    res.status(201).json({
      success: true,
      message: 'Successfully registered, you can now log in.',
      user,
      token: jwt.token,
      expiresIn: jwt.expires,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Log in with given credentials
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username, email, password } = req.body;
    if (password == null) {
      res.status(400).json({
        success: true,
        message: 'You need to provide a password.',
      });
      return;
    }
    if (username == null) {
      res.status(400).json({
        success: false,
        message: 'You need to provide either username or email.',
      });
      return;
    }

    let user;
    if (username != null) {
      user = await User.findOne({ username }).lean().exec();
    }
    if (user == null && email != null) {
      user = await User.findOne({ email }).lean().exec();
    }
    if (user == null || user.password == null) {
      res.status(400).json({
        success: false,
        message: 'No such user',
      });
      return;
    }

    const result = bcrypt.compareSync(password, user.password);
    if (!result) {
      res.status(400).json({
        success: false,
        message: 'Wrong password.',
      });
      return;
    }
    const jwt = issueToken(user);
    res.json({
      success: true,
      message: 'Successfull log in',
      user,
      token: jwt.token,
      expiresIn: jwt.expires,
    });
  } catch (err) {
    next(err);
  }
}
