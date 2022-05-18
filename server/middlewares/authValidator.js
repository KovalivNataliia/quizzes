const User = require('../models/user');

const isUserExist = async (req, res, next) => {
  const { email } = req.body;
  const url = req.url;
  try {
    let message;
    const user = await User.getUserByEmail(email);
    switch (true) {
      case user && url === '/register':
        message = 'You already have an account';
        break;
      case !user && url === '/login':
        message = 'User not found';
        break;
    }
    if (message) {
      return res.status(400).json({ message });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
    console.log(err);
  }
};

module.exports = {
  isUserExist
};
