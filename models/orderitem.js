module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
        OrderItemID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'OrderItemID',
        },
        OrderID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Orders', // Name of the target model
                key: 'OrderID', // Key in the target model
            },
            field: 'OrderID',
        },
        ProductID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products', // Name of the target model
                key: 'ProductID', // Key in the target model
            },
            field: 'ProductID',
        },
        Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'Quantity',
        },
        Price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'Price',
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
        tableName: 'OrderItems',
        timestamps: true,
    });

    OrderItem.associate = (models) => {
        OrderItem.belongsTo(models.Order, { foreignKey: 'OrderID', as: 'order' });
        OrderItem.belongsTo(models.Product, { foreignKey: 'ProductID', as: 'product' });
        OrderItem.belongsTo(models.MenuItem, { foreignKey: 'ProductID', as: 'menuItem' });
    };

    return OrderItem;
};
