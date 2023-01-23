import { Types, Model } from 'mongoose';
import { Post } from './post.js';
import { User } from './user.js';

export interface Comment {
  _id: Types.ObjectId;
  text: string;
  author: User;
  post: Post;
  createdAt: Date;
  updatedAt: Date;
}

export type CommentModel = Model<Comment, unknown, unknown>;
