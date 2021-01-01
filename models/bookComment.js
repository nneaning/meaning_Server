module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'BookComment',
    {
      bookCommentContents: {
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
