module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    CartItemID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'CartItemID',
    },
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',  // Correct model name for products
        key: 'ProductID',   // Ensure the key is correct
      },
      field: 'ProductID',
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      field: 'Quantity',
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'Price',
    },
    Calories: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      field: 'Calories',
    },
    ChildID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Children',  // Reference the Children model
        key: 'id',
      },
      field: 'ChildID',
    },
    CartID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'CartID',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'createdAt',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updatedAt',
    },
  }, {
    timestamps: true,  // Automatically handle `createdAt` and `updatedAt`
    tableName: 'cartitems',  // Ensure the table name is correct
  });

  // Define associations
  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Product, { foreignKey: 'ProductID', as: 'product' });
    CartItem.belongsTo(models.Children, { foreignKey: 'ChildID', as: 'child' });
  };

  return CartItem;
};
