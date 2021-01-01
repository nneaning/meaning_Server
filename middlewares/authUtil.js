/* eslint-disable max-len */
const jwt = require('../modules/jwt');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const util = require('../modules/util');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const isLoggedIn = {
  checkToken: async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.EMPTY_TOKEN));
    }

    const user = await jwt.verify(token);

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
    req.decoded = user;
    next();
  },
  reIssue: async (req, res) => {
    try {
      const { refreshtoken: refreshToken } = req.headers;

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
        util.success(statusCode.OK, responseMessage.ISSUE_SUCCESS, newToken),
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

module.exports = isLoggedIn;
