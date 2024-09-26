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
      defaultValue: false,
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
      field: 'OrderCode',
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
