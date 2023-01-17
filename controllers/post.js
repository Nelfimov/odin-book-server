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
    const posts = await Post.find({})
        .populate('author', 'username')
        .sort('-createdAt')
        .lean().exec();

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

    return res.status(201).json({
      success: true,
      post,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Change post
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next Next middleware
 * @return {Object} JSON
 */
export async function changePost(req, res, next) {
  try {
    const {title, text} = req.body;
    const post = await Post.findById(req.params.postID).exec();
    if (!post.author._id.equals(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'This is not your post',
      });
    }
    post.title = title;
    post.text = text;
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
    const friends = req.user.friends.map((friend) => friend.user._id);
    const posts = await Post.find({author: {$in: friends},
    })
        .populate('author', 'username')
        .lean().exec();

    return res.json({
      success: true,
      posts,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get post by id
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next Next middleware
 * @return {Object} JSON
 */
export async function getPostById(req, res, next) {
  try {
    const postID = req.params.postID;
    const post = await Post.findById(postID)
        .populate('author', 'username')
        .lean().exec();

    return res.json({
      success: true,
      post,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Like post
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next Next middleware
 * @return {Object} JSON
 */
export async function likePost(req, res, next) {
  try {
    const postID = req.params.postID;
    const post = await Post.findById(postID).exec();
    const result = await post.changeLikesCount(req.user._id);

    return res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Publish post
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next Next middleware
 * @return {Object} JSON
 */
export async function publishPost(req, res, next) {
  try {
    const postID = req.params.postID;
    const post = await Post.findById(postID).exec();
    const result = await post.publishPost(req.user._id);

    return res.json(result);
  } catch (err) {
    next(err);
  }
};
