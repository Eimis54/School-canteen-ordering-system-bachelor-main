'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('orders', 'orders_ibfk_1');
    await queryInterface.addConstraint('orders', {
      fields: ['UserID'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'UserID',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.removeConstraint('children', 'children_ibfk_1');
    await queryInterface.addConstraint('children', {
      fields: ['UserID'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'UserID',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes
    await queryInterface.removeConstraint('orders', 'your_constraint_name');
    await queryInterface.addConstraint('orders', {
      fields: ['UserID'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'UserID',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });

    await queryInterface.removeConstraint('children', 'your_constraint_name');
    await queryInterface.addConstraint('children', {
      fields: ['UserID'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'UserID',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });
  }
};
