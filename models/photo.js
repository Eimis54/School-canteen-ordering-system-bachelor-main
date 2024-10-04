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
        allowNull: false,
        references: {
          model: 'Products',
          key: 'ProductID'
        },
        field: 'ProductID',
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
      }
    }, {
        tableName: 'photos',
        timestamps: true, 
        underscored: false,
    });
  
    Photo.associate = function(models) {
      Photo.belongsTo(models.Product, { foreignKey: 'ProductID' });
    };
  
    return Photo;
  };
  