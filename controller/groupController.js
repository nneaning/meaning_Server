/* eslint-disable no-mixed-operators */
/* eslint-disable dot-notation */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable no-return-assign */
/* eslint-disable max-len */

const _ = require('lodash');
const util = require('../modules/util');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');

const { dayjs } = require('../modules/dateTimeModule');
const dateTimeModule = require('../modules/dateTimeModule');

const groupService = require('../service/groupService');
const groupProfile = require('../models/groupProfile');

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

      const createHostMember = await groupService.createMember(
        id,
        groupId,
        true,
      );
      const countGroupImageId = await groupService.countGroupImageId();

      const groupImageId = Number(groupId % countGroupImageId.length + 1);
      console.log(groupImageId);
      const createGroupProfile = await groupService.createGroupProfile(
        groupId,
        groupImageId,
      );

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.CREATED,
            responseMessage.CREATE_GROUP_SUCCESS, {
              groupId,
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
            responseMessage.CREATE_GROUP_FAIL,
          ),
        );
    }
  },
  readGroupList: async (req, res) => {
    const { id } = req.decoded;
    const { offset } = req.query;

    if (!offset) {
      console.log('필요한 쿼리값이 없습니다.');
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const getGroupAll = await groupService.findAllGroupList(Number(offset));

      const getImageGroupList = [];
      const getNoImageGroupList = [];

      for (const i of getGroupAll) {
        getImageGroupList.push({
          groupId: i.GroupId,
          groupName: i.groupName,
          imageUrl: i.groupImageUrl,
          countMember: i.memberCount,
        });
        getNoImageGroupList.push({
          groupId: i.GroupId,
          groupName: i.groupName,
          maximumMemberNumber: i.maximumMemberNumber,
          countMember: i.memberCount,
        });
      }

      const checkMemberId = await groupService.checkMemberId(id);

      if (!checkMemberId) {
        console.log(responseMessage.NO_GROUP);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.NO_GROUP, { myGroup: null, hasImageGroupList: getImageGroupList, noImageGroupList: getNoImageGroupList }));
      }

      const groupId = checkMemberId.GroupId;
      const readGroup = await groupService.readGroup(groupId);
      const countMember = await groupService.countMember(groupId);

      const myGroup = {
        groupId,
        groupName: readGroup.groupName,
        maximumMemberNumber: readGroup.maximumMemberNumber,
        countMember,
      };

      const hasImageGroupList = _.uniqBy(getImageGroupList, 'groupId')
        .filter((hasImageGroup) =>
          hasImageGroup.groupId !== myGroup.groupId);

      const noImageGroupList = _.uniqBy(getNoImageGroupList, 'groupId')
        .filter((NoImageGroup) =>
          NoImageGroup.groupId !== myGroup.groupId);

      return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_GROUP_ALL_SUCCESS, { myGroup, hasImageGroupList, noImageGroupList }));
    } catch (error) {
      console.log(error);
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.READ_GROUP_ALL_FAIL));
    }
  },
  readMyGroup: async (req, res) => {
    try {
      const { id } = req.decoded;
      const checkMemberId = await groupService.checkMemberId(id);

      let dto;
      if (checkMemberId) {
        const groupId = checkMemberId.GroupId;
        const readGroup = await groupService.readGroup(groupId);
        const countMember = await groupService.countMember(groupId);

        dto = {
          groupId,
          groupName: readGroup.groupName,
          introduction: readGroup.introduction,
          countMember,
          maximumMemberNumber: readGroup.maximumMemberNumber,
        };
      } else {
        dto = null;
      }

      return res
        .status(statusCode.OK)
        .send(
          util.success(statusCode.OK, responseMessage.READ_GROUP_SUCCESS, dto),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.READ_GROUP_ALL_FAIL,
          ),
        );
    }
  },
  readGroupDetail: async (req, res) => {
    try {
      const { groupId } = req.params;

      const checkGroupId = await groupService.readGroup(groupId);

      if (!checkGroupId) {
        console.log(responseMessage.NO_GROUP);
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_GROUP));
      }

      const groupDetail = {
        groupId,
        groupName: checkGroupId.groupName,
        introduction: checkGroupId.introduction,
        maximumMemberNumber: checkGroupId.maximumMemberNumber,
        countMember: await groupService.countMember(groupId),
      };
      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.GET_GROUP_DETAIL_SUCCESS,
            { groupDetail },
          ),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.GET_GROUP_DETAIL_FAIL,
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

      const group = await groupService.readGroup(groupId);

      if (
        group.maximumMemberNumber <= (await groupService.countMember(groupId))
      ) {
        return res
          .status(statusCode.NOT_ACCEPTABLE)
          .send(
            util.fail(
              statusCode.NOT_ACCEPTABLE,
              responseMessage.MEMBER_NUMBER_LIMITATION,
            ),
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
  createGroupImage: async (req, res) => {
    try {
      const groupImageUrl = req.file.location;
      const { groupImageName } = req.body;

      if (!groupImageName || !groupImageUrl) {
        console.log('필요한 값이 없습니다!');
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      }

      const createGroupImage = await groupService.createGroupImage(
        groupImageName,
        groupImageUrl,
      );

      return res
        .status(statusCode.CREATED)
        .send(
          util.success(
            statusCode.CREATED,
            responseMessage.CREATE_GROUPIMAGE_SUCCESS,
          ),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.CREATE_GROUPIMAGE_FAIL,
          ),
        );
    }
  },
  readAllPost: async (req, res) => {
    try {
      const { groupId } = req.params;
      const { offset } = req.query;

      if (!groupId) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      }

      const posts = await groupService.readAllPost(
        Number(groupId),
        Number(offset),
      );

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.READ_POST_ALL_SUCCESS,
            posts,
          ),
        );
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.READ_POST_ALL_FAIL,
          ),
        );
    }
  },
  getEditInformation: async (req, res) => {
    try {
      const { groupId } = req.params;

      const {
        groupName,
        introduction,
        maximumMemberNumber,
      } = await groupService.readGroup(groupId);

      if (!groupName || !introduction || !maximumMemberNumber) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_GROUP));
      }

      const group = {
        groupId,
        groupName,
        introduction,
        maximumMemberNumber,
      };

      const users = await groupService.readAllUsers(groupId);
      for (const { dataValues } of users) {
        const { createdAt } = await groupService.checkMemberId(dataValues.id);
        dataValues.dayPassed = Math.floor(
          dateTimeModule.getDateDifference(
            dayjs().format(dateTimeModule.FORMAT_DATETIME),
            createdAt,
          ) + 1,
        );
      }

      group.currentMemberNumber = users.length;

      const dto = {
        group,
        users,
      };

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.GET_GROUP_SETTING_SUCCESS,
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
            responseMessage.GET_GROUP_SETTING_FAIL,
          ),
        );
    }
  },
};
