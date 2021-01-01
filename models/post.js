module.exports = (sequelize, DataTypes) =>
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
