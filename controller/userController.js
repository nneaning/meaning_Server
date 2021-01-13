/* eslint-disable arrow-parens */
/* eslint-disable no-unused-vars */
/* eslint-disable no-return-assign */
/* eslint-disable max-len */
const jwt = require('../modules/jwt');

const util = require('../modules/util');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');

const dateTimeModule = require('../modules/dateTimeModule');

const { dayjs } = dateTimeModule;

const userService = require('../service/userService');

module.exports = {
  signup: async (req, res) => {
    const { email, userName, password } = req.body;

    if (!email || !userName || !password) {
      console.log('필요한 값이 없습니다!');
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      const checkEmail = await userService.checkEmail(email);

      if (checkEmail) {
        console.log('이미 존재하는 이메일입니다.');
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_EMAIL),
          );
      }

      const user = await userService.signup(email, userName, password);

      return res.status(statusCode.CREATED).send(
        util.success(statusCode.CREATED, responseMessage.SIGN_UP_SUCCESS, {
          id: user.id,
          email: user.email,
          userName: user.userName,
        }),
      );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.SIGN_UP_FAIL,
          ),
        );
    }
  },
  signin: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('데이터가 없습니다.');
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const checkEmail = await userService.checkEmail(email);

      if (!checkEmail) {
        console.log('DB에 존재하는 아이디가 아닙니다.');
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));
      }

      const { salt, password: realPassword } = checkEmail;

      if (await userService.encryptPassword(password, salt) !== realPassword) {
        console.log('비밀번호가 일치하지 않습니다.');
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_PW),
          );
      }

      const user = await userService.signin(email, password, salt);

      const { accessToken, refreshToken } = await jwt.sign(user);
      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.SIGN_IN_SUCCESS, {
          accessToken,
          refreshToken,
          nickName: checkEmail.nickName,
          wakeUpTime: checkEmail.wakeUpTime,
        }),
      );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.SIGN_IN_FAIL));
    }
  },
  getMyPage: async (req, res) => {
    const { id } = req.decoded;
    const { offset } = req.query;

    if (!offset) {
      console.log('필요한 쿼리값이 없습니다.');
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const getMyPage = await userService.getMyPage(Number(offset), id);
      const getMySuccessDay = await userService.getMySuccessDay(id);

      let successDays = 0;

      getMySuccessDay.forEach(day =>
        (successDays += day.status));

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.READ_TIMESTAMP_ALL_SUCCESS,
            { successDays, getMyPage },
          ),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.READ_TIMESTAMP_ALL_FAIL,
          ),
        );
    }
  },
  updateOnboard: async (req, res) => {
    try {
      const { id } = req.decoded;
      const { nickName, wakeUpTime } = req.body;

      if (!nickName || !wakeUpTime) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      }

      if (!dateTimeModule.checkValidTimeFormat(wakeUpTime)) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.INVALID_TIME_FORMAT,
            ),
          );
      }

      const user = await userService.updateOnboard(id, nickName, wakeUpTime);

      if (!user) {
        return res
          .status(statusCode.INTERNAL_SERVER_ERROR)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.UPDATE_ONBOARD_FAIL,
            ),
          );
      }

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.NO_CONTENT,
            responseMessage.UPDATE_ONBOARD_SUCCESS,
          ),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.UPDATE_ONBOARD_FAIL,
          ),
        );
    }
  },
  deleteOnboard: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      }

      const checkOnboardUpdated = await userService.deleteOnboard(id);
      if (!checkOnboardUpdated) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));
      }

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.NO_CONTENT,
            responseMessage.DELETE_ONBOARD_SUCCESS,
          ),
        );
    } catch (error) {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.DELETE_ONBOARD_FAIL,
          ),
        );
    }
  },
  createDailyMaxim: async (req, res) => {
    try {
      const { todaysPromiseContents, date } = req.body;

      if (!todaysPromiseContents) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      }

      if (!dateTimeModule.checkValidDateFormat(date)) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.INVALID_DATE_FORMAT,
            ),
          );
      }

      const checkDailyMaximContents = await userService.checkDailyMaximContents(
        todaysPromiseContents,
      );

      if (checkDailyMaximContents) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.ALREADY_DAILYMAXIM_CONTENTS,
            ),
          );
      }

      const checkDailyMaximDate = await userService.getDailyMaximByDate(date);

      if (checkDailyMaximDate) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.ALREADY_DAILYMAXIM_DATE,
            ),
          );
      }

      const dailyMaxim = await userService.createDailyMaxim(
        todaysPromiseContents,
        date,
      );
      return res
        .status(statusCode.CREATED)
        .send(
          util.success(
            statusCode.CREATED,
            responseMessage.CREATE_DAILYMAXIM_SUCCESS,
          ),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.CREATE_DAILYMAXIM_FAIL,
          ),
        );
    }
  },
  getDailyMaxim: async (req, res) => {
    try {
      const date = dayjs().format(dateTimeModule.FORMAT_DATE);
      console.log(date);
      const dailyMaxim = await userService.getDailyMaximByDate(date);

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.READ_DAILYMAXIM_SUCCESS,
            { contents: dailyMaxim.todaysPromiseContents },
          ),
        );
    } catch (error) {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.READ_DAILYMAXIM_FAIL,
          ),
        );
    }
  },
  createBookComment: async (req, res) => {
    try {
      const { id } = req.decoded;
      const { bookTitle, bookCommentContents } = req.body;

      if (!bookTitle || !bookCommentContents) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      }

      const bookReview = await userService.createBookComment(bookTitle, bookCommentContents, id);
      return res
        .status(statusCode.CREATED)
        .send(
          util.success(statusCode.CREATED, responseMessage.CREATE_BOOKCOMMENT_SUCCESS),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.CREATE_BOOKCOMMENT_FAIL,
          ),
        );
    }
  },
  createDailyDiary: async (req, res) => {
    try {
      const { id } = req.decoded;
      const { diaryContents } = req.body;

      if (!diaryContents) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      }

      const dailyDiary = await userService.createDailyDiary(diaryContents, id);
      return res
        .status(statusCode.CREATED)
        .send(
          util.success(statusCode.CREATED, responseMessage.CREATE_DAILYDIARY_SUCCESS, {
            dailyDiaryId: dailyDiary.id,
          }),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.CREATE_DAILYDIARY_FAIL,
          ),
        );
    }
  },
};
