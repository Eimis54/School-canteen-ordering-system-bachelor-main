'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      OrderID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'UserID',
        },
      },
      OrderDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      Status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      TotalCalories: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
      },
      TotalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      OrderCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      ChildName: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      ChildID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      PaymentIntentId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ChargeId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      PaymentStatus: {
        type: Sequelize.ENUM('pending', 'succeeded', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
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

    await queryInterface.addConstraint('orders', {
      fields: ['UserID'],
      type: 'foreign key',
      name: 'order_user_fk',
      references: {
        table: 'users',
        field: 'UserID',
      },
      onDelete: 'SET NULL',
    });

    await queryInterface.addConstraint('orders', {
      fields: ['ChildID'],
      type: 'foreign key',
      name: 'order_child_fk',
      references: {
        table: 'children',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
