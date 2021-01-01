module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Diary',
    {
      diaryContents: {
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
