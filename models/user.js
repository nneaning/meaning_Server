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
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      nickName: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      wakeUpTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      salt: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
    },
    {
      underscored: false,
      freezeTableName: true,
      timestamps: true,
    },
  );
