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
