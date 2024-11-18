'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('menuitems', {
      MenuItemID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      MenuID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'menus',
          key: 'MenuID',
        },
      },
      ProductID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'ProductID',
        },
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

    await queryInterface.addConstraint('menuitems', {
      fields: ['MenuID'],
      type: 'foreign key',
      name: 'menuitem_menu_fk',
      references: {
        table: 'menus',
        field: 'MenuID',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('menuitems', {
      fields: ['ProductID'],
      type: 'foreign key',
      name: 'menuitem_product_fk',
      references: {
        table: 'products',
        field: 'ProductID',
      },
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('menuitems');
  }
};
