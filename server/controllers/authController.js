const User = require('../models/user');
const { cryptPassword } = require('../services/passwordService');
const { signToken } = require('../middlewares/tokenMiddleware');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new User({
      username,
      email,
      password: await cryptPassword(password),
    });
    await User.addUser(newUser);
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
    console.log(err);
  }
};

const loginUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.getUserByEmail(email);
    const token = signToken(user.toJSON());
    res.status(200).json({
      message: 'Success',
      username: user.username,
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
    console.log(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
