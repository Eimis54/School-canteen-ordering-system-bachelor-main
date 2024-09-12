module.exports = (sequelize, DataTypes) => {
  const Children = sequelize.define('Children', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'id',
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'UserID',
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'Name',
    },
    Surname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'Surname',
    },
    Grade: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'Grade',
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
    tableName: 'children', 
    timestamps: true, 
    underscored: false,
  });

  Children.associate = function(models) {
    Children.belongsTo(models.User, { foreignKey: 'UserID' });
    Children.hasMany(models.CartItem, { foreignKey: 'ChildID' });
  };

  return Children;
};
