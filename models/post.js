import {Schema, model} from 'mongoose';

const PostSchema = new Schema({
  title: {type: String, required: true},
  text: {type: String, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  isPublished: {type: Boolean, required: true, default: false},
  likes: {
    count: {type: Number, default: 0},
    users: [{
      user: {type: Schema.Types.ObjectId, ref: 'User'},
    }],
  },
}, {
  timestamps: true,
  methods: {
    /**
     * Increase likes count if user has not liked it previously. Else unlike it.
     * @param {string} id ID of user liking post.
     * @return {shape}
     */
    async changeLikesCount(id) {
      try {
        if (this.author._id.equals(id)) {
          return {
            success: false,
            message: 'Cannot like your own posts',
          };
        }

        let message;
        const userIndex = this.likes.users
            .findIndex((user) => user._id.equals(id));
        if (userIndex < 0) {
          ++this.likes.count;
          this.likes.users.push({
            user: id,
          });
          message = 'Succesfully liked post';
        } else {
          --this.likes.count;
          this.likes.users.slice(userIndex, 1);
          message = 'Succesfully unliked post';
        };
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
    },
    /**
    * Publish post.
    * @param {string} id ID of user publishing post.
    * @return {shape}
    */
    async publishPost(id) {
      try {
        if (!this.author._id.equals(id)) {
          return {
            success: false,
            message: 'You cannot publish other users posts',
          };
        };
        this.isPublished = true;
        await this.save();
        return {
          success: true,
          post: this,
        };
      } catch (err) {
        return {
          success: false,
          message: err,
        };
      }
    },
  },
});

const Post = model('Post', PostSchema);

export default Post;
