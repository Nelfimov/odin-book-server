import {Schema, model} from 'mongoose';

const CommentSchema = new Schema({
  text: {type: String, require: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', require: true},
  post: {type: Schema.Types.ObjectId, ref: 'Post', require: true},
}, {timestamps: true});

const Comment = model('Comment', CommentSchema);

export default Comment;
