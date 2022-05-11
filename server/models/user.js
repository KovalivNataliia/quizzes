const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { versionKey: false });

const User = module.exports = model('User', userSchema);

module.exports.getUserByEmail = (email) => {
  return User.findOne({ email });
};

module.exports.addUser = (user) => user.save();
