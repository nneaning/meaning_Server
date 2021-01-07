module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'GroupImage',
    {
      groupImageName: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      groupImageUrl: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      underscored: false,
      freezeTableName: true,
      timestamps: false,
    },
  );
