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
        model: 'Users',
        key: 'UserID',
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
      defaultValue: false,  // Pending status by default
    },
    TotalCalories: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    TotalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    OrderCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,  // Ensure each code is unique
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
    },
  }, {
    tableName: 'orders',
    timestamps: true,
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'UserID', as: 'user' });
  };

  return Order;
};
