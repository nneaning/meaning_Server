module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Member',
    {
      authentication: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      underscored: false,
      freezeTableName: true,
      timestamps: true,
    }
  );
