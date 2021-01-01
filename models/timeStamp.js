module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'TimeStamp',
    {
      time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      timeStampImageUrl: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timeStampContents: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      underscored: false,
      freezeTableName: true,
      timestamps: true,
    },
  );
