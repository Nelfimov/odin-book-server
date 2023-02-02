import { Schema, model } from 'mongoose';
import { Comment as IComment, CommentModel } from '../types/common/index.js';

const CommentSchema = new Schema<IComment, CommentModel, unknown>(
  {
    text: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

export const Comment = model<IComment, CommentModel>('Comment', CommentSchema);
