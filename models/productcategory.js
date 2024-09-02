module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define('ProductCategory', {
    CategoryID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'CategoryID'
    },
    CategoryName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'CategoryName'
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
    }
  }, {
    tableName: 'productcategories',
    timestamps: true,
  });

  ProductCategory.associate = function(models) {
    ProductCategory.hasMany(models.Product, { foreignKey: 'CategoryID' });
  };

  return ProductCategory;
};
