'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
      OrderItemID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      OrderID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'OrderID',
        },
      },
      ProductID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'ProductID',
        },
      },
      Quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
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

    await queryInterface.addConstraint('OrderItems', {
      fields: ['OrderID'],
      type: 'foreign key',
      name: 'orderitem_order_fk',
      references: {
        table: 'Orders',
        field: 'OrderID',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('OrderItems', {
      fields: ['ProductID'],
      type: 'foreign key',
      name: 'orderitem_product_fk',
      references: {
        table: 'Products',
        field: 'ProductID',
      },
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderItems');
  }
};
