"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("errors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      row: {
        type: Sequelize.NUMBER,
        allowNull: false
      },
      datasetId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: "datasets", key: "id" },
        validate: {
          notNull: { msg: "Deve referenciar um dataset" }
        }
      },
      errors: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("errors");
  }
};
