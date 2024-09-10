// models/cartitem.js
module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    CartItemID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    OrderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    Calories: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  }, {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
    tableName: 'cartitems'
  });

  // Define associations here if needed
  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Order, { foreignKey: 'OrderID', as: 'order' });
    CartItem.belongsTo(models.Product, { foreignKey: 'ProductID', as: 'product' });
  };

  return CartItem;
};
