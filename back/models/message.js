module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      VideoId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
  Message.associate = (db) => {
    db.Message.belongsTo(db.User);
    db.Message.belongsTo(db.Video);
  };
  return Message;
};
