module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      nickname: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      provider: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "local",
      },
      OAuthID: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      profilePhoto: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // Has to be unique
      },
      password: {
        type: DataTypes.STRING(200), //
        allowNull: true,
      },
      resetPasswordLink: {
        type: DataTypes.STRING(400),
        default: "",
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT("medium"),
        allowNull: true,
      },
      notification: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // For multi language
    },
    { hierarchy: true }
  );

  User.associate = (db) => {
    db.User.hasMany(db.Video, { as: "Videos" });
    db.User.hasMany(db.Comment);
    db.User.hasMany(db.Event);
    // db.User.hasMany(db.Comment, { as: "Recomment" });

    db.User.belongsToMany(db.Video, { through: "Like", as: "Liked" });

    db.User.belongsToMany(db.Comment, {
      through: "CommentLike",
      as: "CommentLiked",
    });
    db.User.belongsToMany(db.Comment, {
      through: "CommentDislike",
      as: "CommentDisliked",
    });

    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "followingId",
    });
    // db.User > Follow

    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "followerId",
    });
  };

  return User;
};
