/* eslint-disable no-useless-catch */

const crypto = require('crypto');
const { User } = require('../models');

module.exports = {
  checkEmail: async email => {
    try {
      const alreadyEmail = await User.findOne({
        where: {
          email,
        },
      });
      return alreadyEmail;
    } catch (err) {
      throw err;
    }
  },
  signup: async (email, name, password) => {
    try {
      const salt = crypto.randomBytes(64).toString('base64');
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
        .toString('base64');
      const user = await User.create({
        email,
        userName: name,
        password: hashedPassword,
        salt,
      });
      return user;
    } catch (err) {
      throw err;
    }
  },
  signin: async (email, password, salt) => {
    try {
      const inputPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
        .toString('base64');
      const user = await User.findOne({
        where: {
          email,
          password: inputPassword,
        },
      });
      return user;
    } catch (err) {
      throw err;
    }
  },
  updateRefreshToken: async (id, refreshToken) => {
    try {
      const user = await User.update(
        {
          refreshToken,
        },
        {
          where: {
            id,
          },
        },
      );
      return user;
    } catch (err) {
      throw err;
    }
  },
  checkUserId: async id => {
    try {
      const findByIdUser = await User.findOne({
        where: {
          id,
        },
        attributes: { exclude: ['password', 'salt'] },
      });
      return findByIdUser;
    } catch (err) {
      throw err;
    }
  },
};
