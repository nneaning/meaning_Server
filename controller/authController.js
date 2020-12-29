/* eslint-disable max-len */
const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const responseMessage = require('../modules/responseMessage');
const jwt = require('../modules/jwt');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
  auth: async (req, res) => {
    const token = req.headers.jwt;

    if (!token) {
      return res.json(
        util.fail(statusCode.BAD_REQUEST, responseMessage.EMPTY_TOKEN),
      );
    }

    const user = await jwt.verify(token);
    console.log(user);

    if (user === TOKEN_EXPIRED) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(statusCode.UNAUTHORIZED, responseMessage.EXPIRED_TOKEN),
        );
    }
    if (user === TOKEN_INVALID) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN),
        );
    }
    if (user.id === undefined) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN),
        );
    }
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, responseMessage.AUTH_SUCCESS));
  },
  reIssue: async (req, res) => {
    try {
      const refreshToken = req.headers.refreshtoken;
      if (!refreshToken) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.EMPTY_TOKEN));
      }
      const newToken = await jwt.refresh(refreshToken);
      if (newToken === TOKEN_EXPIRED) {
        return res
          .status(statusCode.UNAUTHORIZED)
          .send(
            util.fail(statusCode.UNAUTHORIZED, responseMessage.EXPIRED_TOKEN),
          );
      }
      if (newToken === TOKEN_INVALID) {
        return res
          .status(statusCode.UNAUTHORIZED)
          .send(
            util.fail(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN),
          );
      }
      res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.ISSUE_SUCCESS, {
          accessToken: newToken,
        }),
      );
    } catch (err) {
      console.log(err);
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
