'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('children', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id',
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'UserID',
      },
      Name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: 'Name',
      },
      Surname: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: 'Surname',
      },
      Grade: {
        type: Sequelize.STRING(20),
        allowNull: false,
        field: 'Grade',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'createdAt',
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'updatedAt',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('children');
  }
};
