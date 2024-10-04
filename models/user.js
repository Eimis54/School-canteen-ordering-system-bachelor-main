module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'UserID'
    },
    RoleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'RoleID',
      references: {
        model: 'Roles',
        key: 'RoleID'
      }
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'Name'  
    },
    Surname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'Surname'  
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'Email'  
    },
    PasswordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'PasswordHash'  
    },
    PhoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'PhoneNumber'  
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'createdAt'  
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updatedAt'  
    }
  }, {
    tableName: 'users',  
    timestamps: true     
  });

  User.associate = function(models) {
    User.belongsTo(models.Role, { foreignKey: 'RoleID' });
    User.hasMany(models.Order, { foreignKey: 'UserID' });
    User.hasMany(models.Children, { foreignKey: 'UserID' });
  };

  return User;
};
