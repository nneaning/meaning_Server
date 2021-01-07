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
};
