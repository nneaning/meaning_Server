module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'USER_TB',
    {
      email: {
        type: DataTypes.STRING(30),
        unique: true,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
    },
    {
      underscored: true,
      freezeTableName: true,
      timestamps: true,
    },
  );
