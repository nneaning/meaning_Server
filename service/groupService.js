/* eslint-disable no-dupe-keys */
/* eslint-disable no-useless-catch */
const {
  Group, Member, GroupImage, GroupProfile, User,
} = require('../models');

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
  readGroup: async (id) => {
    try {
      return await Group.findOne({
        where: {
          id,
        },
      });
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
  readAllUsers: async (groupId) => {
    try {
      const members = await User.findAll({
        attributes: ['id', 'userName', 'nickName', 'wakeUpTime'],
        include: [{
          model: Group,
          where: {
            id: groupId,
          },
          attributes: [],
        }],
      });
      return members;
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
};
