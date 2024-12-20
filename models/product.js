module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    ProductID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'ProductID',
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ProductCategories',
        key: 'CategoryID',
      },
      field: 'CategoryID',
    },
    ProductName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'ProductName',
    },
    Calories: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
      field: 'Calories',
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'Price',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'createdAt',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updatedAt',
    },
  }, {
    tableName: 'products',
    timestamps: true,
  });

  Product.associate = function(models) {
    Product.belongsTo(models.ProductCategory, { foreignKey: 'CategoryID' });
    Product.hasMany(models.MenuItem, { foreignKey: 'ProductID', as: 'MenuItems' });
    Product.hasOne(models.Photo, { foreignKey: 'ProductID', as: 'Photos' });


  };

  return Product;
};