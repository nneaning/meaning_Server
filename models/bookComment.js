module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'BookComment',
    {
      bookTitle: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
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
