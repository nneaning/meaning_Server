/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-catch */

const crypto = require('crypto');

const { User, TimeStamp, TodaysPromise, BookComment } = require('../models');

module.exports = {
  checkEmail: async (email) => {
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
  signup: async (email, userName, password) => {
    try {
      const salt = crypto.randomBytes(64).toString('base64');
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
        .toString('base64');
      const user = await User.create({
        email,
        userName,
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
  getMyPage: async (offset, id) => {
    try {
      const getMyPage = await TimeStamp.findAll({
        offset,
        limit: 18,
        order: [['createdAt', 'DESC']],
        where: {
          UserId: id,
        },
        attributes: [
          'id',
          'timeStampImageUrl',
          'timeStampContents',
          'createdAt',
        ],
      });
      return getMyPage;
    } catch (err) {
      throw err;
    }
  },
  getMySuccessDay: async (id) => {
    try {
      const getMySuccessDay = await TimeStamp.findAll({
        where: {
          UserId: id,
        },
        attributes: ['status'],
      });
      return getMySuccessDay;
    } catch (err) {
      throw err;
    }
  },
  getWakeUpTime: async (id) => {
    try {
      const { wakeUpTime } = await User.findOne({
        where: {
          id,
        },
        attributes: ['wakeUpTime'],
      });
      return wakeUpTime;
    } catch (err) {
      throw err;
    }
  },
  updateOnboard: async (id, nickName, wakeUpTime) => {
    try {
      const user = await User.update(
        {
          nickName,
          wakeUpTime,
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
  createBookComment: async (bookTitle, bookCommentContents, UserId) => {
    try {
      const bookReview = await BookComment.create({
        bookTitle,
        bookCommentContents,
        UserId,
      });
      return bookReview;
    } catch (err) {
      throw err;
    }
  },
  checkBookComment: async (bookCommentContents) => {
    try {
      const alreadyBookReview = await BookComment.findOne({
        where: {
          bookCommentContents,
        },
      });
      return alreadyBookReview;
    } catch (err) {
      throw err;
    }
  },
  createDailyMaxim: async (todaysPromiseContents, date) => {
    try {
      const dailyMaxim = await TodaysPromise.create({
        todaysPromiseContents,
        date,
      });
      return dailyMaxim;
    } catch (err) {
      throw err;
    }
  },
  checkDailyMaximContents: async (todaysPromiseContents) => {
    try {
      const alreadyDailyMaxim = await TodaysPromise.findOne({
        where: {
          todaysPromiseContents,
        },
      });
      return alreadyDailyMaxim;
    } catch (err) {
      throw err;
    }
  },
  getDailyMaximByDate: async (date) => {
    try {
      const dailyMaxim = await TodaysPromise.findOne({
        where: {
          date,
        },
      });
      return dailyMaxim;
    } catch (err) {
      throw err;
    }
  }
};