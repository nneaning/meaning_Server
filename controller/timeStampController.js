const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/customParseFormat'));
dayjs.extend(require('dayjs/plugin/duration'));
const dateTimeFormat = require('../modules/dateTimeFormat');

const util = require('../modules/util');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');

const userService = require('../service/userService');
const timeStampService = require('../service/timeStampService');

module.exports = {
  createTimeStamp: async (req, res) => {
    try {
      const user = await userService.checkUserId(req.decoded.id);
      const timeStampImageUrl = req.file.location;
      const { dateTime, timeStampContents } = req.body;

      if (!dayjs(dateTime, dateTimeFormat.DATETIME).isValid()) { // check valid format
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.INVALID_DATETIME_FORMAT,
            ),
          );
      }

      const targetTime = dayjs(`${dayjs().format(dateTimeFormat.DATE)} ${user.wakeUpTime}`);
      const requestedTime = dayjs(dateTime);
      const timeDiff = dayjs.duration(requestedTime.diff(targetTime)).asMinutes();

      let status;
      if (timeDiff <= 0) {
        status = 1; // success
      } else {
        status = 0; // late
      }

      const missionComplete = ((x) => {
        if (x === 1) {
          return 'success';
        }
        return 'late';
      })(status);

      const timeStamp = await timeStampService.createTimeStamp(
        user.id,
        status,
        dateTime,
        timeStampImageUrl,
        timeStampContents,
      );

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.CREATE_TIMESTAMP_SUCCESS,
            {
              timeStampId: timeStamp.id,
              dateTime: timeStamp.dateTime,
              missionComplete,
              timeStampImageUrl,
              timeStampContents,
            },
          ),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  },
};
