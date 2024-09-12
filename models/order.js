module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    OrderID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',   // Correct model name for users
        key: 'UserID',    // Make sure the key matches the Users model
      },
    },
    OrderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    Status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,  // Represents 'pending' by default
    },
    TotalCalories: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    TotalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    tableName: 'orders',  // Correct table name
    timestamps: true,  // Enable automatic handling of timestamps
  });

  // Define associations
  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'UserID', as: 'user' });
    // Order.hasMany(models.CartItem, { foreignKey: 'OrderID', as: 'cartItems' }); // Once you associate orders with cart items
  };

  return Order;
};
