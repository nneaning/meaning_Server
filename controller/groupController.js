/* eslint-disable no-unused-vars */
/* eslint-disable no-return-assign */
/* eslint-disable max-len */

const util = require('../modules/util');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');

const groupService = require('../service/groupService');

module.exports = {
  createGroup: async (req, res) => {
    const { id } = req.decoded;
    const { groupName, maximumMemberNumber, introduction } = req.body;

    if (!groupName || !maximumMemberNumber || !introduction) {
      console.log(responseMessage.NULL_VALUE);
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      const checkMemberId = await groupService.checkMemberId(id);

      if (checkMemberId) {
        console.log(responseMessage.ALREADY_GROUP);
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_GROUP),
          );
      }

      const createGroup = await groupService.createGroup(
        groupName,
        maximumMemberNumber,
        introduction,
      );
      const groupId = createGroup.id;

      const createHostMember = await groupService.createMember(id, groupId, true);

      return res
        .status(statusCode.CREATED)
        .send(
          util.success(
            statusCode.CREATED,
            responseMessage.CREATE_GROUP_SUCCESS,
          ),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.CREATE_GROUP_FAIL,
          ),
        );
    }
  },
  joinGroup: async (req, res) => {
    try {
      const { id } = req.decoded;
      const { groupId } = req.body;

      if (!groupId) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      }

      const checkMemberId = await groupService.checkMemberId(id);

      if (checkMemberId) {
        console.log(responseMessage.ALREADY_GROUP);
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_GROUP),
          );
      }

      const createMember = await groupService.createMember(id, groupId, false);

      return res
        .status(statusCode.CREATED)
        .send(
          util.success(statusCode.CREATED, responseMessage.JOIN_GROUP_SUCCESS),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.JOIN_GROUP_FAIL,
          ),
        );
    }
  },
};
