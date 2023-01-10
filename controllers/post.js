import {Post} from '../models/index.js';

/**
 * Get all posts from db
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next Next middleware
 * @return {Object} JSON
 */
export async function getPosts(req, res, next) {
  try {
    const posts = await Post.find({}).exec();

    return res.json({
      success: true,
      posts,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create new post
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next Next middleware
 * @return {Object} JSON
 */
export async function createPost(req, res, next) {
  try {
    const {title, text} = req.body;
    const post = new Post({title, text, author: req.user});
    await post.save();

    return res.json({
      success: true,
      post,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all posts from friends
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next Next middleware
 * @return {Object} JSON
 */
export async function getPostsFromFriends(req, res, next) {
  try {
    const friends = req.user.friends;
    const posts = await Post.find({author: {$in: friends}}).exec();

    return res.json({
      success: true,
      posts,
    });
  } catch (err) {
    next(err);
  }
}
