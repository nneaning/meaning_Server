const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.TimeStamp = require('./timeStamp')(sequelize, Sequelize);
db.BookComment = require('./bookComment')(sequelize, Sequelize);
db.Diary = require('./diary')(sequelize, Sequelize);
db.TodaysPromise = require('./todaysPromise')(sequelize, Sequelize);
db.Group = require('./group')(sequelize, Sequelize);

db.Member = require('./member')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);


/** 1 : N   User : Diary */
db.User.hasMany(db.Diary, { onDelete: 'cascade' });
db.Diary.belongsTo(db.User);

/** 1 : N   User : BookComment */
db.User.hasMany(db.BookComment, {onDelete: 'cascade' })
db.BookComment.belongsTo(db.User);

/** 1 : N   User : TimeStamp */
db.User.hasMany(db.TimeStamp, {onDelete: 'cascade' })
db.TimeStamp.belongsTo(db.User);

/** N : M   User : Group => Member */
db.User.belongsToMany(db.Group, { through: 'Member', onDelete: 'cascade' });
db.Group.belongsToMany(db.User, { through: 'Member', onDelete: 'cascade' });

/** N : M   TimeStamp : Group => Post */
db.TimeStamp.belongsToMany(db.Group, { through: 'Post', onDelete: 'cascade' });
db.Group.belongsToMany(db.TimeStamp, { through: 'Post', onDelete: 'cascade' });

module.exports = db;
