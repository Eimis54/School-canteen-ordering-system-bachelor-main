module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define('Menu', {
        MenuID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'MenuID', // Ensure the field name matches the database column name
        },
        DayOfWeek: {
            type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
            allowNull: false,
            field: 'DayOfWeek', // Ensure the field name matches the database column name
        },
        IsPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'IsPublic', // Ensure the field name matches the database column name
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
        tableName: 'menus', // Specify the actual table name
        timestamps: true, // This will automatically handle `createdAt` and `updatedAt`
        underscored: false, // Use camelCase for column names as in the model
    });

    Menu.associate = function(models) {
        Menu.hasMany(models.MenuItem, {
            foreignKey: 'MenuID', // Ensure this matches the foreign key column in the MenuItem model
            as: 'MenuItems',
            onDelete: 'CASCADE',
        });
    };

    return Menu;
};
