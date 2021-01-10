module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'TodaysPromise',
    {
      todaysPromiseContents: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      underscored: false,
      freezeTableName: true,
      timestamps: false,
    },
  );
