module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    OrderID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'OrderID',
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'UserID',
      },
      field: 'UserID',
    },
    OrderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'OrderDate',
    },
    Status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'Status',
    },
    TotalCalories: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      field: 'TotalCalories',
    },
    TotalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'TotalPrice',
    },
    OrderCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'ordercode',
    },
    ChildName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'ChildName',
    },
    ChildID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'ChildID',
    },
    PaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true, // Make this nullable if not every order has a PaymentIntent
      field: 'PaymentIntentId',
    },
    ChargeId: {
      type: DataTypes.STRING,
      allowNull: true, // Make this nullable if not every order has a ChargeId
      field: 'ChargeId',
    },
    PaymentStatus: {
      type: DataTypes.ENUM('pending', 'succeeded', 'failed','refunded'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'PaymentStatus',
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
    tableName: 'orders',
    timestamps: true,
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'UserID', as: 'user' });
    Order.belongsTo(models.Children, { foreignKey: 'ChildID', as: 'child' });
    Order.hasMany(models.OrderItem, { foreignKey: 'OrderID', as: 'orderItems' });
  };

  return Order;
};
