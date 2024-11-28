module.exports = (sequelize, DataTypes) => {
  const Photo = sequelize.define('Photo', {
    PhotoID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'PhotoID',
    },
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Products',
        key: 'ProductID',
      },
      field: 'ProductID',
    },
    DealID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Deals',
        key: 'DealID',
      },
      field: 'DealID',
    },
    PhotoURL: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'PhotoURL',
    },
    AltText: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'AltText',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'createdAt',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updatedAt',
    },
  }, {
    tableName: 'photos',
    timestamps: true,
    underscored: false,
  });

  Photo.associate = function (models) {
    Photo.belongsTo(models.Product, { foreignKey: 'ProductID', as: 'Product' });
    Photo.belongsTo(models.Deal, { foreignKey: 'DealID', as: 'Deal' });
  };

  return Photo;
};
