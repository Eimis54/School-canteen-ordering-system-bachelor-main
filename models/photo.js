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
        field: 'createdAt', // Ensure the field name matches the database column name
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updatedAt', // Ensure the field name matches the database column name
      }
    }, {
        tableName: 'photos', // Specify the actual table name
        timestamps: true, // This will automatically handle `createdAt` and `updatedAt`
        underscored: false, // Use camelCase for column names as in the model
    });
  
    Photo.associate = function(models) {
      Photo.belongsTo(models.Product, { foreignKey: 'ProductID' });
    };
  
    return Photo;
  };
  