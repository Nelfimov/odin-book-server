import {Schema, model} from 'mongoose';

const PostSchema = new Schema({
  title: {type: String, required: true},
  text: {type: String, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  likes_count: {type: Number, default: 0},
}, {
  timestamps: true,
  methods: {
    /**
     * Increase likes count.
     */
    increaseLikesCount() {
      this.likes_count++;
      this.save();
    },
    /**
     * Decrease likes count.
     */
    decreaseLikesCount() {
      this.likes_count--;
      this.save();
    },
  },
});

const Post = model('Post', PostSchema);

export default Post;
