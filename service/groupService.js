/* eslint-disable no-dupe-keys */
/* eslint-disable no-useless-catch */
const {
  User, Group, Member, GroupImage, GroupProfile, sequelize, TimeStamp,
} = require('../models');

const POST_QUERY_UNIT = 10;

module.exports = {
  createGroup: async (groupName, maximumMemberNumber, introduction) => {
    try {
      const makeGroup = await Group.create({
        groupName,
        maximumMemberNumber,
        introduction,
      });
      return makeGroup;
    } catch (err) {
      throw err;
    }
  },
  checkMemberId: async (id) => {
    try {
      const findMemberId = await Member.findOne({
        where: {
          UserId: id,
        },
      });
      return findMemberId;
    } catch (err) {
      throw err;
    }
  },
  createMember: async (id, groupId, isHost) => {
    try {
      const makeMember = await Member.create({
        isHost,
        UserId: id,
        GroupId: groupId,
      });
      return makeMember;
    } catch (err) {
      throw err;
    }
  },
  createGroupImage: async (groupImageName, groupImageUrl) => {
    try {
      const uploadGroupImage = await GroupImage.create({
        groupImageName,
        groupImageUrl,
      });
      return uploadGroupImage;
    } catch (err) {
      throw err;
    }
  },
  createGroupProfile: async (groupId, countGroupImageId) => {
    try {
      const makeGroupProfile = await GroupProfile.create({
        GroupId: groupId,
        GroupImageId: countGroupImageId,
      });
      return makeGroupProfile;
    } catch (err) {
      throw err;
    }
  },
  countGroupImageId: async () => {
    try {
      const countGroupImageId = await GroupImage.findAll({
        attributes: [
          'id',
        ],
      });
      return countGroupImageId;
    } catch (err) {
      throw err;
    }
  },
  checkGroup: async (id) => {
    try {
      const checkGroup = await Group.findOne({
        where: {
          id,
        },
        attributes: [
          'groupName',
          'maximumMemberNumber',
        ],
      });
      return checkGroup;
    } catch (err) {
      throw err;
    }
  },
  countMember: async (id) => {
    try {
      const countMember = await Member.findAll({
        where: {
          GroupId: id,
        },
      });
      return countMember.length;
    } catch (err) {
      throw err;
    }
  },
  findAllGroupList: async (offset) => {
    try {
      const getAllGroupList = await Group.findAll({
        attributes: [
          'groupName',
          'maximumMemberNumber',
        ],
        include: [{
          model: GroupImage,
          attributes: ['groupImageUrl'],
        }, {
          model: User,
          attributes: [[sequelize.fn('COUNT', 'id'), 'countMember']],
          order: [['countMember', 'DESC']],
        }],
        offset,
        limit: POST_QUERY_UNIT,
      });
      return getAllGroupList;
    } catch (err) {
      throw err;
    }
  },
  readAllPost: async (groupId, offset) => {
    try {
      const posts = await TimeStamp.findAll({
        offset,
        limit: POST_QUERY_UNIT,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Group,
            where: {
              id: groupId,
            },
            attributes: [],
          }, {
            model: User,
            attributes: ['id', 'userName', 'nickName', 'wakeUpTime'],
          },
        ],
        attributes: { exclude: ['dateTime', 'updatedAt', 'UserId'] },
      });
      return posts;
    } catch (error) {
      throw error;
    }
  },
};
