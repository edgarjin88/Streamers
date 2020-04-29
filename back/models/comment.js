module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      //
      content: {
        type: DataTypes.TEXT,

        allowNull: false,
      },
      refComment: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    },
    { hierarchy: true }
  );

  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.User, {
      // through: "RecommentTable",
      as: "Recommenter",
    });

    db.Comment.belongsTo(db.Video);

    db.Comment.hasMany(db.Comment, { as: "Recomment" });

    db.Comment.belongsToMany(db.User, {
      through: "CommentLike",
      as: "CommentLikers",
    });
    db.Comment.belongsToMany(db.User, {
      through: "CommentDislike",
      as: "CommentDislikers",
    });
  };
  return Comment;
};
