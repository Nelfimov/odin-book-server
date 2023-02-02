import {
  Post as IPost,
  PostModel,
  PostMethods,
  User,
} from '../types/common/index.js';
import { Schema, model } from 'mongoose';

const PostSchema = new Schema<IPost, PostModel, PostMethods>(
  {
    title: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, required: true, default: false },
    likes: {
      count: { type: Number, default: 0 },
      users: [
        {
          user: { type: Schema.Types.ObjectId, ref: 'User' },
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

PostSchema.virtual('textPreview').get(function () {
  return this.text.length > 150 ? `${this.text.slice(0, 150)}...` : this.text;
});

PostSchema.methods.changeLikesCount = async function changeLikesCount(id) {
  try {
    if (this.author._id.equals(id) === false) {
      return {
        success: false,
        message: 'Cannot like your own posts',
      };
    }

    let message: string;
    if (this.likes === undefined) return;
    const userIndex = this.likes.users.findIndex((user: User) =>
      user._id.equals(id)
    );
    if (userIndex == null) return;
    if (userIndex < 0) {
      ++this.likes.count;
      this.likes.users.push({
        user: id,
      });
      message = 'Succesfully liked post';
    } else {
      --this.likes.count;
      this.likes.users.splice(userIndex, 1);
      message = 'Succesfully unliked post';
    }
    await this.save();
    return {
      success: true,
      message,
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};

PostSchema.methods.publishPost = async function publishPost(id) {
  try {
    if (this.author._id.equals(id) === false) {
      return {
        success: false,
        message: 'You cannot publish other users posts',
      };
    }
    this.isPublished = true;
    await this.save();
    return {
      success: true,
      message: 'Ok',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};

export const Post = model<IPost, PostModel>('Post', PostSchema);
