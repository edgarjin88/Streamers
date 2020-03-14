module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    content: {
      type: DataTypes.TEXT, 
      allowNull: false,
    },
    PostId:{
      type: DataTypes.INTEGER
    }
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  });
  Message.associate = (db) => {
    db.Message.belongsTo(db.User);
    db.Message.belongsTo(db.Room);
    // db.Message.belongsTo(db.Post);
  };
  return Message;
};
