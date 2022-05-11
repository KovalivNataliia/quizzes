const { comparePasswords } = require('../services/passwordService');
const User = require('../models/user');

const checkPassword = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.getUserByEmail(email);
  const correctPassword = await comparePasswords(password, user.password);
  if (!correctPassword) {
    return res.status(400).json({ message: 'Wrong password' });
  }
  next();
};

module.exports = {
  checkPassword
};
