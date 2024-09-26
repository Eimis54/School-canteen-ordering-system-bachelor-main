module.exports = (sequelize, DataTypes) => {
    const MenuItem = sequelize.define('MenuItem', {
      MenuItemID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      MenuID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Menus',
          key: 'MenuID',
        },
      },
      ProductID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'ProductID',
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'createdAt', // Ensure the field name matches the database column name
    },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updatedAt', // Ensure the field name matches the database column name
    }
}, {
      tableName: 'menuitems',
      timestamps: true,
      underscored: false,
    });
  
    MenuItem.associate = function(models) {
      MenuItem.belongsTo(models.Menu, { foreignKey: 'MenuID', as: 'Menu' });
      MenuItem.belongsTo(models.Product, { foreignKey: 'ProductID', as: 'Product' });
      MenuItem.hasMany(models.OrderItem, { foreignKey: 'ProductID', as: 'orderItems' });
    };
  
    return MenuItem;
  };
  