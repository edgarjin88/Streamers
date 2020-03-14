module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { // 테이블명은 users
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    profilePhoto:{
      type:DataTypes.TEXT,
      allowNull:true
    },
    userId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true, // Has to be unique
    },
    password: {
      type: DataTypes.STRING(100), // 100글자 이하
      allowNull: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci', // For multi language
  });

  User.associate = (db) => {
    db.User.hasMany(db.Post, { as: 'Posts' });// 아래에도 db.User, db.Post가 있기 때문에 구분을 위하여
    // db.Post > Posts
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
    // db.User > Follow

    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });
  };

  return User;
};
