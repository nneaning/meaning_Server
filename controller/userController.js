/* eslint-disable no-return-assign */
/* eslint-disable max-len */
const jwt = require('../modules/jwt');

const util = require('../modules/util');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');

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

      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.SIGN_UP_SUCCESS, {
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
      res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const checkEmail = await userService.checkEmail(email);

      if (!checkEmail) {
        console.log('DB에 존재하는 아이디가 아닙니다.');
        res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));
      }

      const { salt, password: hashedPassword } = checkEmail;
      const user = await userService.signin(email, password, salt);

      if (user.password !== hashedPassword) {
        console.log('비밀번호가 일치하지 않습니다.');
        res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_PW),
          );
      }

      const { accessToken, refreshToken } = await jwt.sign(user);
      res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.SIGN_IN_SUCCESS, {
          accessToken,
          refreshToken,
        }),
      );
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.SIGN_IN_FAIL));
    }
  },
  getMyPage: async (req, res) => {
    const { id } = req.decoded;
    const { offset } = req.query;

    if (!offset) {
      console.log('필요한 쿼리값이 없습니다.');
      res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const getMyPage = await userService.getMyPage(Number(offset), id);
      const getMySuccessDay = await userService.getMySuccessDay(id);

      let successDays = 0;

      getMySuccessDay.forEach((day) =>
        successDays += day.status);

      return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_TIMESTAMP_ALL_SUCCESS, { successDays, getMyPage }));
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.READ_TIMESTAMP_ALL_FAIL));
    }
  },
};
