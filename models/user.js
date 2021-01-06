module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'User',
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
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      nickName: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      wakeUpTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      salt: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      underscored: false,
      freezeTableName: true,
      timestamps: true,
    },
  );
