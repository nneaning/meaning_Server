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
  readTimestamp: async (id) => {
    const timeStamp = await TimeStamp.findOne({
      where: {
        id,
      },
    });
    return timeStamp;
  },
};
