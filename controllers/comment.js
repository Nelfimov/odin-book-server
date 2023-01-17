import {Comment, Post} from '../models/index.js';
import {parallel} from 'async';

/**
 * Get all comments for specific post.
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next Next
 */
export async function getComments(req, res, next) {
  try {
    const postID = req.params.postID;
    const comments = await Comment.find({post: postID})
        .populate('author', 'username')
        .sort('-createdAt')
        .lean().exec();
    return res.json({
      success: true,
      comments,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get comment by id. Checks in parallel if such post
 * exists and searches comment by ID.
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next Next
 */
export async function getCommentById(req, res, next) {
  try {
    const postID = req.params.postID;
    const commentID = req.params.commentID;

    parallel([
      function comment(cb) {
        Comment.findById(commentID)
            .populate('author', 'username')
            .lean()
            .exec(cb);
      },
      function post(cb) {
        Post.findById(postID).lean().exec(cb);
      },
    ], (err, results) => {
      if (err) return next(err);

      const {post, comment} = results;

      if (!post) {
        return res.status(400).json({
          success: false,
          message: 'No such post exists',
        });
      };
      if (!comment) {
        return res.status(400).json({
          success: false,
          message: 'No such comment exists',
        });
      };

      return res.json({
        success: true,
        comment,
      });
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create comment for specific post.
 * @param {shape} req Request object
 * @param {shape} res Response object
 * @param {function} next Next
 */
export async function createComment(req, res, next) {
  try {
    const postID = req.params.postID;
    const post = await Post.findById(postID).lean().exec();
    if (!post) {
      return res.status(400).json({
        success: false,
        message: 'There is no such post',
      });
    }

    const {text} = req.body;
    const comment = new Comment({text, author: req.user, post: postID});
    await comment.save();
    return res.status(201).json({
      success: true,
      comment,
    });
  } catch (err) {
    next(err);
  }
};
