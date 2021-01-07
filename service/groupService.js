/* eslint-disable no-useless-catch */
const { Group, Member, GroupImage } = require('../models');

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
  createHostMember: async (id, groupId) => {
    try {
      const makeHostMember = await Member.create({
        isHost: 1,
        UserId: id,
        GroupId: groupId,
      });
      return makeHostMember;
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
};
