import { Post } from '../models/index.js';
import { Request, Response, NextFunction } from 'express';
import { Friend } from '../types/common/index.js';

/**
 * Get all posts from db
 */
export async function getPosts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const skip = (req.query.skip as number | undefined) ?? 0;
    const posts = await Post.find({})
      .populate('author', 'username')
      .skip(skip)
      .limit(5)
      .sort('-createdAt')
      // .lean()
      .exec();
    res.json({
      success: true,
      posts,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create new post
 */
export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, text } = req.body;
    const post = new Post({ title, text, author: req.user });
    await post.save();
    res.status(201).json({
      success: true,
      post,
    });
    return;
  } catch (err) {
    next(err);
  }
}

/**
 * Change post
 */
export async function changePost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.user == null) {
      res.json({
        success: false,
        message: 'You are not authorized',
      });
      return;
    }
    const { title, text } = req.body;
    const post = await Post.findById(req.params.postID).exec();
    if (post == null) {
      res.json({
        success: false,
        message: 'No such post',
      });
      return;
    }

    if (!post.author._id.equals(req.user._id)) {
      res.status(400).json({
        success: false,
        message: 'This is not your post',
      });
      return;
    }
    post.title = title;
    post.text = text;
    await post.save();

    res.json({
      success: true,
      post,
    });
    return;
  } catch (err) {
    next(err);
  }
}

/**
 * Get all posts from friends
 */
export async function getPostsFromFriends(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.user == null) {
      res.json({
        success: false,
        message: 'You are not authorized',
      });
      return;
    }
    const friends = req.user.friends.map((friend: Friend) => {
      if (friend.status === 'friends') {
        return friend.user._id;
      }
    });
    const posts = await Post.find({ author: { $in: friends } })
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
 * Get post by id
 */
export async function getPostById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const postID = req.params.postID;
    const post = await Post.findById(postID)
      .populate('author', 'username')
      .lean()
      .exec();

    res.json({
      success: true,
      post,
    });
    return;
  } catch (err) {
    next(err);
  }
}

/**
 * Like post
 */
export async function likePost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.user == null) {
      res.json({
        success: false,
        message: 'You are not authorized',
      });
      return;
    }
    const postID = req.params.postID;
    if (postID == null) {
      res.json({
        success: false,
        message: 'Params is empty',
      });
      return;
    }
    const post = await Post.findById(postID).exec();
    if (post == null) {
      res.json({
        success: false,
        message: 'No such post',
      });
      return;
    }
    const result = await post.changeLikesCount(req.user._id);

    res.json(result);
    return;
  } catch (err) {
    next(err);
  }
}

/**
 * Publish post
 */
export async function publishPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.user == null) {
      res.json({
        success: false,
        message: 'You are not authorized',
      });
      return;
    }
    const postID = req.params.postID;
    if (postID == null) {
      res.json({
        success: false,
        message: 'No params',
      });
      return;
    }

    const post = await Post.findById(postID).exec();
    if (post == null) {
      res.json({
        success: false,
        message: 'No such post',
      });
      return;
    }

    const result = await post.publishPost(req.user._id);

    res.json(result);
    return;
  } catch (err) {
    next(err);
  }
}
