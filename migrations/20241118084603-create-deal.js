'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('deals', {
      DealID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'DealID',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'title',
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'description',
      },
      photoUrl: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'photoUrl',
      },
      isFeatured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: 'isFeatured',
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
    await queryInterface.dropTable('deals');
  }
};
