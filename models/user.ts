import { Schema, model } from 'mongoose';
import {
  Friend,
  User as IUser,
  UserMethods,
  UserModel,
} from '../types/common/index.js';

const UserSchema = new Schema<IUser, UserModel, UserMethods>({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  friends: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      status: {
        type: String,
        enum: ['requested', 'pending', 'friends', 'rejected'],
      },
    },
  ],
});

UserSchema.methods.isUserUnique = async function isUserUnique() {
  try {
    let success = true;
    let message = '';
    const usernameQuery = await User.find({ username: this.username }).exec();
    const emailQuery = await User.find({ email: this.email }).exec();

    if (usernameQuery.length > 0) {
      success = false;
      message += 'This username is already taken. ';
    }

    if (emailQuery.length > 0) {
      success = false;
      message += 'This email is already taken.';
    }

    if (success) message = 'Success, username and email are free.';

    return { success, message };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err,
    };
  }
};

UserSchema.methods.sendFriendRequest = async function sendFriendRequest(id) {
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
};

UserSchema.methods.acceptFriendRequest = async function acceptFriendRequest(
  id
) {
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
};

UserSchema.methods.rejectFriendRequest = async function rejectFriendRequest(
  id
) {
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
};

UserSchema.methods.changeFriendStatus = async function changeFriendStatus(
  id,
  status
) {
  try {
    const index = this.friends.findIndex((friend: Friend) => {
      return friend.user._id === id;
    });
    this.friends[index].status = status;
    await this.save();
    return {
      success: true,
      message: `Status changed to ${status}`,
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};

UserSchema.methods.friendCheck = async function friendCheck(id, status) {
  try {
    if (this._id.equals(id) === true) {
      return {
        success: false,
        message: 'You cannot perform this operation with yourself',
      };
    }

    const index = this.friends.findIndex((friend: Friend) => {
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
};

UserSchema.methods.deleteFromFriends = async function deleteFromFriends(id) {
  try {
    const result = await this.friendCheck(id, '');
    if (!result.success) {
      return {
        success: result.success,
        message: result.message,
      };
    }

    const index = this.friends.findIndex((friend: Friend) => {
      return friend.user._id.equals(id);
    });
    this.friends.splice(index, 1);
    await this.save();

    const friend = await model('User').findById(id).exec();
    const friendIndex = friend.friends.findIndex((friend: Friend) => {
      return friend.user._id.equals(id);
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
  }
};

export const User = model<IUser, UserModel>('User', UserSchema);
