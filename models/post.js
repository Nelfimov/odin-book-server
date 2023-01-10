import {Schema, model} from 'mongoose';

const PostSchema = new Schema({
  title: {type: String, require: true},
  text: {type: String, require: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', require: true},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
}, {timestamps: true});

const Post = model('Post', PostSchema);

export default Post;
