module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', { // 복수형의 테이블이 형성될 것이다. 
    content: {
      type: DataTypes.TEXT, 
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4', //  이모티콘 타입 가능. 
    collate: 'utf8mb4_general_ci',
  });
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); 
    db.Post.hasMany(db.Comment);
    // db.Post.hasMany(db.Message);
    db.Post.hasOne(db.Room)  // 룸과의 관계 
    db.Post.hasMany(db.Image);
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); 
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
  };
  return Post;
};
