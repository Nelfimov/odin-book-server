import {Schema, model} from 'mongoose';

const UserSchema = new Schema({
  username: {type: String, unique: true, required: true},
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  friends: [{
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    status: {type: String, enum: [
      'requested',
      'pending',
      'friends',
      'rejected',
    ]},
  }],
}, {
  methods: {
    /**
     * Check if the username and email are already taken.
     * @return {shape} {success=true} if unique.
     * Else 'message' with reason.
     */
    async isUserUnique() {
      try {
        let success = true;
        let message = '';
        const usernameQuery = await User.find({username: this.username}).exec();
        const emailQuery = await User.find({email: this.email}).exec();

        if (usernameQuery.length > 0) {
          success = false;
          message += 'This username is already taken. ';
        };

        if (emailQuery.length > 0) {
          success = false;
          message += 'This email is already taken.';
        };

        if (success) message = 'Success, username and email are free.';

        return {success, message};
      } catch (err) {
        return console.log(err);
      }
    },
    /**
     * Send friend request to user.
     * Adds you to friend list with status 'pending'.
     * @param {string} id ID of user to whom send the request.
     * @return {shape}
     */
    async sendFriendRequest(id) {
      try {
        const result = await this.friendCheck(id, 'requested');
        if (!result.success) {
          return {
            success: result.success,
            message: result.message,
          };
        }

        const user = await model('User').findById(id).exec();
        this.friends.push({
          user: user._id,
          status: 'requested',
        });
        user.friends.push({
          user: this._id,
          status: 'pending',
        });
        await user.save();
        await this.save();
        return {
          success: true,
          message: 'Friend request sent succesfully',
        };
      } catch (err) {
        return {
          success: false,
          message: err,
        };
      }
    },
    /**
     * Accept incoming friend request.
     * @param {string} id ID of user whos request to accept.
     * @return {shape}
     */
    async acceptFriendRequest(id) {
      try {
        const result = await this.friendCheck(id, 'friends');
        if (!result.success) {
          return {
            success: result.success,
            message: result.message,
          };
        }

        await this.changeFriendStatus(id, 'friends');
        const friend = await model('User').findById(id).exec();
        await friend.changeFriendStatus(this.id, 'friends');
        return {
          success: true,
          message: 'Friend accepted succesfully',
        };
      } catch (err) {
        return {
          success: false,
          message: err,
        };
      }
    },
    /**
     * Reject incoming friend request.
     * @param {string} id ID of user whos request to reject.
     * @return {shape}
     */
    async rejectFriendRequest(id) {
      try {
        const result = await this.friendCheck(id, 'rejected');
        if (!result.success) {
          return {
            success: result.success,
            message: result.message,
          };
        }

        await this.changeFriendStatus(id, 'rejected');
        return {
          success: true,
          message: 'Succesfully rejected',
        };
      } catch (err) {
        return {
          success: false,
          message: err,
        };
      }
    },
    /**
     * Change friends status.
     * @param {string} id ID of user in friends list.
     * @param {string} status Status to which to change friend.
     * @return {shape}
     */
    async changeFriendStatus(id, status) {
      try {
        const index = this.friends.findIndex((friend) => {
          return friend.user._id == id;
        });
        this.friends[index].status = status;
        await this.save();
        return {
          success: true,
          message: 'Status changed to ' + status,
        };
      } catch (err) {
        return {
          success: false,
          message: err,
        };
      }
    },
    /**
     * Check if the friend status change can be applied.
     * @param {string} id ID of user.
     * @param {string} status Status to be applied
     * @return {shape}
     */
    async friendCheck(id, status) {
      try {
        if (this._id.equals(id)) {
          return {
            success: false,
            message: 'You cannot perform this operation with yourself',
          };
        }

        const index = this.friends.findIndex((friend) => {
          return friend.user._id.equals(id);
        });
        if (index < 0 && status === 'requested') {
          return {
            success: true,
            message: 'All ok',
          };
        }

        if (index > 0) {
          switch (status) {
            case 'friends':
              return {
                success: true,
                message: 'All ok',
              };
            case 'rejected':
              return {
                success: true,
                message: 'All ok',
              };
            case null:
              return {
                success: true,
                message: 'All ok',
              };
          }
        }

        return {
          success: false,
          message: 'Error',
        };
      } catch (err) {
        return {
          success: false,
          message: err,
        };
      }
    },
    async deleteFromFriends(id) {
      try {
        const result = await this.friendCheck(id, null);
        if (!result.success) {
          return {
            success: result.success,
            message: result.message,
          };
        };

        const index = this.friends.findIndex((friend) => {
          return friend.user._id == id;
        });
        this.friends.splice(index, 1);
        await this.save();

        const friend = await model('User').findById(id).exec();
        const friendIndex = friend.friends.findIndex((friend) => {
          return friend.user._id == id;
        });
        friend.friends.splice(friendIndex, 1);
        await friend.save();

        return {
          success: true,
          message: 'User successfully deleted from friends list',
        };
      } catch (err) {
        return {
          success: false,
          message: err,
        };
      };
    },
  },
});

const User = model('User', UserSchema);

export default User;
