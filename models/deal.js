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
      field: 'createdAt',
  },
  updatedAt: {
      type: DataTypes.DATE,
      field: 'updatedAt',
    }
  }, {
      tableName: 'deals', 
      timestamps: true,
      underscored: false,
  });
  Deal.associate = function (models) {
    Deal.hasMany(models.Photo, {
      foreignKey: 'DealID',
      as: 'Photos',
    });
  };

  return Deal;
};
