module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      //
      content: {
        type: DataTypes.TEXT,

        allowNull: false,
      },
      targetVideoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userProfile: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
    // { hierarchy: true }
  );

  Event.associate = (db) => {
    db.Event.belongsTo(db.User);
    db.Event.belongsTo(db.User, {
      as: "TargetUser",
    });
  };
  return Event;
};
