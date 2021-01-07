module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Group',
    {
      groupName: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      introduction: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      maximumMemberNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: false,
      freezeTableName: true,
      timestamps: true,
    },
  );
