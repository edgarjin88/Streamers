module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define(
    "Video",
    {
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      videoImageURL: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      viewCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      streaming: {
        type: DataTypes.STRING(5),
        defaultValue: "OFF",
        allowNull: true,
      },
    },
    {
      charset: "utf8mb4", //  emoji.
      collate: "utf8mb4_general_ci",
    }
  );
  Video.associate = (db) => {
    db.Video.belongsTo(db.User);
    db.Video.hasMany(db.Comment);
    db.Video.hasMany(db.Message);
    db.Video.hasMany(db.Image);
    // retweet not necessary. To be removed later.
    db.Video.belongsTo(db.Video, { as: "Retweet" });
    db.Video.belongsToMany(db.Hashtag, { through: "VideoHashtag" });
    db.Video.belongsToMany(db.User, { through: "Like", as: "Likers" });
    db.Video.belongsToMany(db.User, { through: "Dislike", as: "Dislikers" });
  };
  return Video;
};
