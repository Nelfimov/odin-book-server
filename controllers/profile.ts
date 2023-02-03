import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Comment, Post, User } from '../models/index.js';

/**
 * Get user info.
 */
export async function getUserInfo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await User.findById(
      req.params.userID,
      'username friends image'
    )
      .populate('friends.user', 'username')
      .lean()
      .exec();
    res.json({
      success: true,
      user,
    });
    return;
  } catch (err) {
    next(err);
  }
}

/**
 * Get user's posts.
 */
export async function getUserPosts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const posts = await Post.find({ author: req.params.userID })
      .populate('author', 'username')
      .lean()
      .exec();
    res.json({
      success: true,
      posts,
    });
    return;
  } catch (err) {
    next(err);
  }
}

/**
 * Get user's comments.
 */
export async function getUserComments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const comments = await Comment.find({ author: req.params.userID })
      .populate('author', 'username')
      .lean()
      .exec();
    res.json({
      success: true,
      comments,
    });
    return;
  } catch (err) {
    next(err);
  }
}

/**
 * Send friend request to user.
 */
export async function sendFriendRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.user == null) return;
    const result = await req.user.sendFriendRequest(req.params.userID);
    res.json(result);
    return;
  } catch (err) {
    next(err);
  }
}

/**
 * Accept incoming friend request.
 */
export async function acceptFriendRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.user == null) return;
    const result = await req.user.acceptFriendRequest(req.params.userID);
    res.json(result);
    return;
  } catch (err) {
    next(err);
  }
}

/**
 * Reject incoming friend request.
 */
export async function rejectFriendRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.user == null) return;
    const result = await req.user.rejectFriendRequest(req.params.userID);
    res.json(result);
    return;
  } catch (err) {
    next(err);
  }
}

/**
 * Reject incoming friend request.
 */
export async function deleteFromFriends(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.user == null) return;
    const result = await req.user.deleteFromFriends(req.params.userID);
    res.json(result);
    return;
  } catch (err) {
    next(err);
  }
}

/**
 * Upload new profile picture.
 */
export async function uploadProfilePicture(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.user == null) return;

    if (!req.file) {
      res.json({
        success: false,
        message: 'No file in request',
      });
      return;
    }

    const id = req.params.userID;
    if (!req.user._id.equals(id)) {
      res.json({
        success: false,
        message: 'Cannot change other peoples profile pics',
      });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.json({
        success: false,
        message: 'User id in url is wrong',
      });
      return;
    }

    const path = req.file.path.replace(/\\/g, '/');
    User.findByIdAndUpdate(
      id,
      (req.body = { image: `http://localhost:3000/${path}` }),
      { new: true }
    );
    res.json({
      success: true,
      message: 'Profile image changed successfully',
    });
    return;
  } catch (err) {
    console.log(err);
    next(err);
  }
}
