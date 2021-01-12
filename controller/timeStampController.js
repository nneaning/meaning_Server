/* eslint-disable no-use-before-define */
/* eslint-disable no-inner-declarations */
/* eslint-disable dot-notation */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
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

const timeStamp = require('../models/timeStamp');


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
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      }

      if (!dateTimeModule.checkValidDateTimeFormat(dateTime)) {
        // check valid format
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.INVALID_DATETIME_FORMAT,
            ),
          );
      }

      const targetTime = `${dayjs().format(
        dateTimeModule.FORMAT_DATE,
      )} ${wakeUpTime}`;
      const timeDifference = dateTimeModule.getTimeDifference(
        dateTime,
        targetTime,
      );

      let timeStampMissionStatus;
      if (timeDifference <= 0) {
        timeStampMissionStatus = missionStatus.SUCCESS; // success
      } else {
        timeStampMissionStatus = missionStatus.LATE; // late
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
        misstionStatus: timeStampMissionStatus,
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
  getTimeStampDetail: async (req, res) => {
    try {
      const { timeStampId } = req.params;

      if (!timeStampId) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      }

      const timeStamp = await timeStampService.readTimestamp(timeStampId);

      if (!timeStamp) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.INVALID_TIMESTAMP_ID,
            ),
          );
      }

      const { id, timeStampImageUrl, timeStampContents, status, createdAt } = timeStamp;

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.READ_TIMESTAMP_SUCCESS,
            { id, timeStampImageUrl, timeStampContents, status, createdAt },
          ),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.READ_TIMESTAMP_FAIL,
          ),
        );
    }
  },
  getCalendar: async (req, res) => {
    const { id } = req.decoded;
    try {
      const getMySuccessDay = await userService.getMySuccessDay(id);
      let successDays = 0;

      getMySuccessDay.forEach((day) =>
        (successDays += day.status));

      const getCalendar = await timeStampService.checkTimeStampId(id);
      const getCalendarList = [];

      getCalendar.forEach((day) =>
        getCalendarList.push({ dateTime: day.dateTime.split(' ')[0], status: day.status }));

      const findLastDay = new Date(2021, 1, 0);
      const getLastDate = `${dayjs(findLastDay).format(dateTimeModule.FORMAT_DATE)}`;

      for (let i = 1; i <= getLastDate.split('-')[2]; i++) {
        getCalendarList.push({ dateTime: `${dayjs(new Date(2021, 0, i)).format(dateTimeModule.FORMAT_DATE)}`, status: 0 });
      }

      const calendar = getCalendarList.reduce((acc, cur) => {
        if (acc.findIndex(({ dateTime }) =>
          dateTime === cur.dateTime) === -1) {
          acc.push(cur);
        }
        return acc;
      }, []).sort(dateAscending);

      function dateAscending(a, b) {
        const dateA = new Date(a['dateTime']).getTime();
        const dateB = new Date(b['dateTime']).getTime();
        return dateA > dateB ? 1 : -1;
      }

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.READ_TIMESTAMP_ALL_SUCCESS,
            { successDays, calendar },
          ),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.READ_CALENDAR_FAIL));
    }
  },
};
