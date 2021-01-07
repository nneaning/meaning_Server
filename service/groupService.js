/* eslint-disable no-useless-catch */
const { Group, Member } = require('../models');

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
  checkGroupId: async (id) => {
    try {
      const findGroupId = await Member.findOne({
        where: {
          UserId: id,
        },
      });
      return findGroupId;
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
};
