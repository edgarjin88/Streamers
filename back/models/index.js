const Sequelize = require("sequelize-hierarchy")();

// const Sequelize = require("sequelize");
// require("sequelize-hierarchy")(Sequelize);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env]; //config json
const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.Comment = require("./comment")(sequelize, Sequelize);
db.Event = require("./event")(sequelize, Sequelize);
db.Hashtag = require("./hashtag")(sequelize, Sequelize);
db.Image = require("./image")(sequelize, Sequelize);
// db.Post = require("./post")(sequelize, Sequelize);
db.Video = require("./video")(sequelize, Sequelize);
db.User = require("./user")(sequelize, Sequelize);
db.Message = require("./message")(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
