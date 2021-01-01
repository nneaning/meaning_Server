module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Member',
    {
      isHost: {
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
