"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      // queryInterface.addColumn("Events", "userProfile", {
      //   type: Sequelize.STRING(300),
      //   allowNull: true,
      // }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.removeColumn("Users", "userProfile")]);
  },
};
