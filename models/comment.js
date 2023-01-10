import {Schema, model} from 'mongoose';

const CommentSchema = new Schema({
  text: {type: String, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  post: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
}, {timestamps: true});

const Comment = model('Comment', CommentSchema);

export default Comment;
