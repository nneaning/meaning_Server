module.exports = (sequelize) =>
  sequelize.define(
    'Post',
    {
    },
    {
      underscored: false,
      freezeTableName: true,
      timestamps: true,
    },
  );
