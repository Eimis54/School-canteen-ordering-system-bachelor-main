'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('menus', {
      MenuID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'MenuID',
      },
      DayOfWeek: {
        type: Sequelize.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
        allowNull: false,
        field: 'DayOfWeek',
      },
      IsPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: 'IsPublic',
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt',
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt',
      },
    });

    await queryInterface.addConstraint('menus', {
      fields: ['MenuID'],
      type: 'primary key',
      name: 'menus_pkey',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('menus');
  }
};
