import { Types, Model } from 'mongoose';
import { User } from './user.js';

export interface Post {
  _id: Types.ObjectId;
  title: string;
  text: string;
  author: User;
  isPublished: boolean;
  likes: {
    count: number;
    users: User[];
  };
  textPreview: string;
}

export interface PostMethods {
  changeLikesCount: (
    id: Types.ObjectId
  ) => Promise<{ success: boolean; message: string | unknown } | unknown>;
  publishPost: (
    id: Types.ObjectId
  ) => Promise<{ success: boolean; message: string | unknown } | unknown>;
}

export type PostModel = Model<Post, unknown, PostMethods>;
