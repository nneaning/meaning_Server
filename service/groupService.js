/* eslint-disable no-undef */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-useless-catch */
const db = require('../models');

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
  createGroupProfile: async (groupId, groupImageId) => {
    try {
      const makeGroupProfile = await GroupProfile.create({
        GroupId: groupId,
        GroupImageId: groupImageId,
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
      const query = `SELECT 
                      g.groupName, 
                      g.maximumMemberNumber, 
                      m.GroupId,
                      image.groupImageUrl, 
                      count(m.UserId) as memberCount 
                    FROM 
                      MEANING.Group g 
                        JOIN 
                      GroupProfile p ON g.id = p.GroupId
                        JOIN 
                      Member m ON g.id = m.GroupId
                        JOIN 
                      GroupImage image ON p.GroupImageId = image.id
                    GROUP BY g.id 
                    ORDER BY memberCount DESC 
                    LIMIT ${offset}, ${POST_QUERY_UNIT}`;

      const result = await db.sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      return result;
    } catch (error) {
      throw error;
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
