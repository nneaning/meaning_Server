module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Group',
    {
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      introduction: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      groupImageUrl: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      underscored: false,
      freezeTableName: true,
      timestamps: true,
    }
  );
