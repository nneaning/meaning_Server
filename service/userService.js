/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-catch */

const {
  User, TimeStamp, TodaysPromise, BookComment, Diary,
} = require('../models');

const encryptModule = require('../modules/encryptModule');

const GETMYPAGE_QUERY_UNIT = 18;

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
  checkUserId: async (id) => {
    try {
      const user = await User.findOne({
        where: {
          id,
        },
      });
      return user;
    } catch (err) {
      throw err;
    }
  },
  signup: async (email, userName, password) => {
    try {
      const salt = encryptModule.generateSalt();
      const hashedPassword = encryptModule.encryptPassword(password, salt);
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
      const inputPassword = encryptModule.encryptPassword(password, salt);
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
        limit: GETMYPAGE_QUERY_UNIT,
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
  deleteOnboard: async (id) => {
    try {
      const user = await User.update(
        {
          nickName: null,
          wakeUpTime: null,
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
  },
  createDailyDiary: async (diaryContents, UserId) => {
    try {
      const dailyDiary = await Diary.create({
        diaryContents,
        UserId,
      });
      return dailyDiary;
    } catch (err) {
      throw err;
    }
  },
  checkDailyDiary: async (diaryContents) => {
    try {
      const alreadyDailyDiary = await Diary.findOne({
        where: {
          diaryContents,
        },
      });
      return alreadyDailyDiary;
    } catch (err) {
      throw err;
    }
  },
};
