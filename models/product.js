'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      ProductID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      CategoryID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ProductCategories',
          key: 'CategoryID',
        },
      },
      ProductName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      Calories: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: false,
      },
      Price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('Products', {
      fields: ['CategoryID'],
      type: 'foreign key',
      name: 'product_category_fk',
      references: {
        table: 'ProductCategories',
        field: 'CategoryID',
      },
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
