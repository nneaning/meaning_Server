const { Post } = require('../models');

module.exports = {
  createPost: async (timeStampId, groupId) => {
    try {
      const post = await Post.create({
        TimeStampId: timeStampId,
        GroupId: groupId,
      });
      return post;
    } catch (error) {
      throw error;
    }
  },
};