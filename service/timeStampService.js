/* eslint-disable no-useless-catch */
const { TimeStamp } = require('../models');

module.exports = {
  createTimeStamp: async (userId, status, dateTime, timeStampImageUrl, timeStampContents) => {
    const timeStamp = await TimeStamp.create({
      UserId: userId,
      status,
      dateTime,
      timeStampImageUrl,
      timeStampContents,
    });
    return timeStamp;
  },
  checkTimeStampId: async (id) => {
    try {
      const checkTimeStampId = await TimeStamp.findAll({
        where: {
          UserId: id,
        },
        order: [['dateTime', 'ASC']],
        attributes: [
          'dateTime',
          'status',
        ],
      });
      return checkTimeStampId;
    } catch (err) {
      throw err;
    }
  readTimestamp: async (id) => {
    const timeStamp = await TimeStamp.findOne({
      where: {
        id,
      },
    });
    return timeStamp;
  },
};
