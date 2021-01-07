module.exports = (sequelize) =>
  sequelize.define(
    'GroupProfile',
    {
    },
    {
      underscored: false,
      freezeTableName: true,
      timestamps: false,
    },
  );
