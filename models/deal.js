module.exports = (sequelize, DataTypes) => {
  const Deal = sequelize.define('Deal', {
    DealID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'DealID',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'title',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'description',
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'photoUrl',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'isFeatured',
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
      tableName: 'deals', // Specify the actual table name
      timestamps: true, // This will automatically handle `createdAt` and `updatedAt`
      underscored: false, // Use camelCase for column names as in the model
  });

  return Deal;
};
