/* eslint-disable @typescript-eslint/no-explicit-any */
import { Comment, Post } from '../models/index.js';
import { Request, Response, NextFunction } from 'express';
import { parallel } from 'async';

/**
 * Get all comments for specific post.
 */
export async function getComments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const postID = req.params.postID;
    const comments = await Comment.find({ post: postID })
      .populate('author', 'username')
      .sort('-createdAt')
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
 * Get comment by id. Checks in parallel if such post
 * exists and searches comment by ID.
 */
export async function getCommentById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const postID = req.params.postID;
    const commentID = req.params.commentID;

    parallel(
      [
        function comment(cb) {
          Comment.findById(commentID)
            .populate('author', 'username')
            .lean()
            .exec(cb);
        },
        function post(cb) {
          Post.findById(postID).lean().exec(cb);
        },
      ],
      (err, results: any) => {
        if (err != null) {
          next(err);
          return;
        }

        const { post, comment } = results;

        if (post == null) {
          res.status(400).json({
            success: false,
            message: 'No such post exists',
          });
          return;
        }
        if (comment == null) {
          res.status(400).json({
            success: false,
            message: 'No such comment exists',
          });
          return;
        }

        return res.json({
          success: true,
          comment,
        });
      }
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Create comment for specific post.
 */
export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const postID = req.params.postID;
    const post = await Post.findById(postID).lean().exec();
    if (post == null) {
      res.status(400).json({
        success: false,
        message: 'There is no such post',
      });
      return;
    }

    const { text } = req.body;
    const comment = new Comment({ text, author: req.user, post: postID });
    await comment.save();
    res.status(201).json({
      success: true,
      comment,
    });
    return;
  } catch (err) {
    next(err);
  }
}
