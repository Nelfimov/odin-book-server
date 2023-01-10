import {Schema, model} from 'mongoose';

const UserSchema = new Schema({
  username: {type: String, unique: true, require: true},
  email: {type: String, unique: true, require: true},
  password: {type: String, require: true},
  friends: [{
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    status: {type: Number, enum: [
      'add friend',
      'requested',
      'pending',
      'friends',
    ]},
  }],
}, {
  methods: {
    /**
     * Check if the username and email are already taken.
     * @param {String} username
     * @param {String} email
     * @return {Object.<boolean, string>} 'success' true if unique.
     * Else 'message' with reason.
     */
    isUserUnique() {
      let success = true;
      let message = '';
      const usernameQuery = User.find({username: this.username});
      const emailQuery = User.find({email: this.email});

      if (usernameQuery != undefined) {
        success = false;
        message += 'This username is already taken. ';
      };

      if (emailQuery != undefined) {
        success = false;
        message += 'This email is already taken.';
      };

      if (success) message = 'Success, username and email are free.';

      return {success, message};
    },
  },
});

const User = model('User', UserSchema);

export default User;
