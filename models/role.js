// models/role.js

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    RoleID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    RoleName: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {});

  Role.associate = function(models) {
    Role.hasMany(models.User, { foreignKey: 'RoleID' });
  };

  return Role;
};
