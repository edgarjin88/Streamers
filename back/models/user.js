module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      profilePhoto: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      userId: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true // Has to be unique
      },
      password: {
        type: DataTypes.STRING(100), //
        allowNull: false
      }
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci" // For multi language
    }
  );

  User.associate = db => {
    db.User.hasMany(db.Post, { as: "Posts" });
    // db.Post > Posts
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "followingId"
    });
    // db.User > Follow

    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "followerId"
    });
  };

  return User;
};
