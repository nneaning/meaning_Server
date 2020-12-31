module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'TodaysPromise',
    {
      todaysPromiseContents: {
        type: DataTypes.STRING(200),
        allowNull: false,
      }
    },
    {
      underscored: false,
      freezeTableName: true,
      timestamps: true,
    }
  );
