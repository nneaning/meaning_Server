const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/customParseFormat'));
const dateTimeFormat = require('../modules/dateTimeFormat');

const util = require('../modules/util');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');

module.exports = {
  createTimeStamp: async (req, res) => {
    try {
      const userId = req.decoded.id;
      const timeStampImageUrl = req.file.location;
      const { datetime, timeStampContents } = req.body;

      if (!dayjs(datetime, dateTimeFormat.DATETIME, true).isValid()) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.INVALID_DATETIME_FORMAT,
            ),
          );
      }

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            '타임스탬프 이미지 S3 업로드 완료', // 임시 response message
            timeStampImageUrl,
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
