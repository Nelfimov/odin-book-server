import { Types, Model } from 'mongoose';
import { Friend } from './index.js';

export interface User {
  _id: Types.ObjectId;
  username: string;
  email: string;
  image?: string;
  password?: string;
  friends: Friend[];
}

export interface UserMethods {
  isUserUnique: () => Promise<{ success: boolean; message: string | unknown }>;
  acceptFriendRequest: (
    id: Types.ObjectId | string
  ) => Promise<{ success: boolean; message: string | unknown }>;
  rejectFriendRequest: (
    id: Types.ObjectId | string
  ) => Promise<{ success: boolean; message: string | unknown }>;
  sendFriendRequest: (
    id: Types.ObjectId | string
  ) => Promise<{ success: boolean; message: string | unknown }>;
  friendCheck: (
    id: Types.ObjectId | string,
    status: string
  ) => Promise<{ success: boolean; message: string | unknown }>;
  changeFriendStatus: (
    id: Types.ObjectId | string,
    status: string
  ) => Promise<{ success: boolean; message: string | unknown }>;
  deleteFromFriends: (
    id: Types.ObjectId | string
  ) => Promise<{ success: boolean; message: string | unknown }>;
}

export type UserModel = Model<User, unknown, UserMethods>;
