import {Schema, model} from 'mongoose';

const CommentSchema = new Schema({
  text: {type: String, require: true},
  author: {type: Schema.Types.ObjectId, require: true},
}, {timestamps: true});

const Comment = model('Comment', CommentSchema);

export default Comment;
