const util = require('../modules/util');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');

const missionStatus = require('../modules/missionStatus');
const { dayjs } = require('../modules/dateTimeModule');
const dateTimeModule = require('../modules/dateTimeModule');

const userService = require('../service/userService');
const postService = require('../service/postService');
const timeStampService = require('../service/timeStampService');
const groupService = require('../service/groupService');

module.exports = {
  createTimeStamp: async (req, res) => {
    try {
      const userId = req.decoded.id;
      const wakeUpTime = await userService.getWakeUpTime(userId);
      const timeStampImageUrl = req.file.location;
      const { dateTime, timeStampContents } = req.body;

      if (!dateTime || !timeStampContents || !timeStampImageUrl) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.NULL_VALUE,
            ),
          );
      }

      if (!dateTimeModule.checkValidDateTimeFormat(dateTime)) { // check valid format
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.INVALID_DATETIME_FORMAT,
            ),
          );
      }

      const targetTime = `${dayjs().format(dateTimeModule.FORMAT_DATE)} ${wakeUpTime}`;
      const timeDifference = dateTimeModule.getTimeDifference(dateTime, targetTime);

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
        userId,
        timeStampMissionStatus,
        dateTime,
        timeStampImageUrl,
        timeStampContents,
      );

      const dto = {
        timeStampId: timeStamp.id,
        missionStatusMessage,
      };

      const checkHasGroup = await groupService.checkMemberId(userId);
      if (checkHasGroup) {
        const { GroupId: groupId } = checkHasGroup;
        const post = await postService.createPost(timeStamp.id, groupId);
        dto.postedOnGroup = true;
      } else {
        dto.postedOnGroup = false;
      }

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.CREATE_TIMESTAMP_SUCCESS,
            dto,
          ),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.CREATE_TIMESTAMP_FAIL,
          ),
        );
    }
  },
};
