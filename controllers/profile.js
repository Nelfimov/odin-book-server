import {Comment, Post} from '../models/index.js';

/**
 * Get user's posts.
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next
 */
export async function getUserPosts(req, res, next) {
  try {
    const posts = await Post.find({author: req.params.userID}).exec();
    return res.json({
      success: true,
      posts,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Get user's comments.
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next
 */
export async function getUserComments(req, res, next) {
  try {
    const comments = await Comment.find({author: req.params.userID}).exec();
    return res.json({
      success: true,
      comments,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Send friend request to user.
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next
 */
export async function sendFriendRequest(req, res, next) {
  try {
    const result = await req.user.sendFriendRequest(req.params.userID);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

/**
 * Accept incoming friend request.
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next
 */
export async function acceptFriendRequest(req, res, next) {
  try {
    const result = await req.user.acceptFriendRequest(req.params.userID);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

/**
 * Reject incoming friend request.
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next
 */
export async function rejectFriendRequest(req, res, next) {
  try {
    const result = await req.user.rejectFriendRequest(req.params.userID);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

/**
 * Reject incoming friend request.
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next
 */
export async function deleteFromFriends(req, res, next) {
  try {
    const result = await req.user.deleteFromFriends(req.params.userID);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}
