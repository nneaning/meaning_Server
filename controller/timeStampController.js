const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/customParseFormat'));
dayjs.extend(require('dayjs/plugin/duration'));
const dateTimeFormat = require('../modules/dateTimeFormat');

const util = require('../modules/util');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');

const missionStatus = require('../modules/missionStatus');

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
      const timeDifference = dayjs.duration(requestedTime.diff(targetTime)).asMinutes();

      let timeStampMissionStatus;
      if (timeDifference <= 0) {
        timeStampMissionStatus = missionStatus.SUCCESS; // success
      } else {
        timeStampMissionStatus = missionStatus.LATE; // late
      }

      let missionStatusMessage;
      if (timeStampMissionStatus === missionStatus.SUCCESS) {
        missionStatusMessage = 'success';
      }
      if (timeStampMissionStatus === missionStatus.LATE) {
        missionStatusMessage = 'late';
      }

      const timeStamp = await timeStampService.createTimeStamp(
        user.id,
        timeStampMissionStatus,
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
              missionStatusMessage,
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
