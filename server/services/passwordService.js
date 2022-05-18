const bcrypt = require('bcryptjs');

const cryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const comparePasswords = async (enteredPassword, password) => {
  return await bcrypt.compare(enteredPassword, password);
};

module.exports = {
  cryptPassword,
  comparePasswords,
};
