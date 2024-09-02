module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define('OrderDetail', {
    OrderDetailID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    OrderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'OrderID'
      }
    },
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'ProductID'
      }
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {});

  OrderDetail.associate = function(models) {
    OrderDetail.belongsTo(models.Order, { foreignKey: 'OrderID' });
    OrderDetail.belongsTo(models.Product, { foreignKey: 'ProductID' });
  };

  return OrderDetail;
};
