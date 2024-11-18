'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cartitems', {
      CartItemID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'CartItemID',
      },
      ProductID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'ProductID',
        },
        field: 'ProductID',
      },
      Quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
        field: 'Quantity',
      },
      Price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        field: 'Price',
      },
      Calories: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
        field: 'Calories',
      },
      ChildID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'children',
          key: 'id',
        },
        field: 'ChildID',
      },
      CartID: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
        field: 'CartID',
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'UserID',
        },
        field: 'UserID',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        field: 'createdAt',
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        field: 'updatedAt',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cartitems');
  }
};
