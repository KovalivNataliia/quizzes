const jwt = require('jsonwebtoken');
const config = require('../config/config');

const signToken = (user) => jwt.sign(
  user,
  config.secret,
  { expiresIn: '12h' },
);

const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.replace(/^(Bearer|JWT)\s+/, '');
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.status(400).json({ message: 'Token is not valid' });
        }
        req.decoded = decoded;
        next();
      });
    } else {
      res.status(400).json({ message: 'Token not provided' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
    console.log(err);
  }
};

module.exports = {
  signToken,
  verifyToken
};
