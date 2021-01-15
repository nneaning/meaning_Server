const crypto = require('crypto');

function encryptPassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('base64');
}

function generateSalt() {
  return crypto.randomBytes(64).toString('base64');
}

module.exports = {
  encryptPassword,
  generateSalt,
};
