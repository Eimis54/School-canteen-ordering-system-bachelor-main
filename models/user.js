module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'UserID'  // Matches 'UserID' in your database
    },
    RoleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'RoleID',  // Matches 'RoleID' in your database
      references: {
        model: 'Roles', // Name of the Role table
        key: 'RoleID'
      }
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'Name'  // Matches 'Name' in your database
    },
    Surname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'Surname'  // Matches 'Surname' in your database
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'Email'  // Matches 'Email' in your database
    },
    PasswordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'PasswordHash'  // Matches 'PasswordHash' in your database
    },
    PhoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'PhoneNumber'  // Matches 'PhoneNumber' in your database
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'createdAt'  // Matches 'createdAt' in your database
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updatedAt'  // Matches 'updatedAt' in your database
    }
  }, {
    tableName: 'users',  // Ensure this matches your table name
    timestamps: true     // Sequelize will handle createdAt and updatedAt columns
  });

  User.associate = function(models) {
    User.belongsTo(models.Role, { foreignKey: 'RoleID' });
    User.hasMany(models.Order, { foreignKey: 'UserID' });
    User.hasMany(models.Children, { foreignKey: 'UserID' });
  };

  return User;
};
