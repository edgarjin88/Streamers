module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', { 
    title: {  //conference click 시에 title enter
      type: DataTypes.STRING(80), // Long text      
      allowNull: true,
    },
    numberOfUsers: {
      type: DataTypes.INTEGER, // 이부분 체크할 것. 
      allowNull: true
    }
  }, {
    charset: 'utf8mb4', 
    collate: 'utf8mb4_general_ci',
  });
  Room.associate = (db) => {
    db.Room.hasMany(db.Message);
    db.Room.belongsTo(db.Post); 
    // Will make RetweetId column
    // Need to know whch post we connect. 어떻게 커낵팅 했는지 체크해 보자. 
  };
  return Room;
};
