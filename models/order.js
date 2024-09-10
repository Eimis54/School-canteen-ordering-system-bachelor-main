module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    OrderID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'OrderID' // Column name in database
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'UserID'
      },
      field: 'UserID' // Column name in database
    },
    OrderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'OrderDate' // Column name in database
    },
    Status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'status' // Column name in database
    },
    TotalCalories: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      field: 'TotalCalories' // Column name in database
    },
    TotalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'TotalPrice' // Column name in database
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
    tableName: 'orders',
    timestamps: true,
    underscored: false,
  });

  Order.associate = function(models) {
    Order.belongsTo(models.User, { foreignKey: 'UserID' });
    Order.hasMany(models.OrderDetail, { foreignKey: 'OrderID' });
  };

  return Order;
};
