module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define('Menu', {
        MenuID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'MenuID',
        },
        DayOfWeek: {
            type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
            allowNull: false,
            field: 'DayOfWeek',
        },
        IsPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'IsPublic',
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
        tableName: 'menus', 
        timestamps: true, 
        underscored: false, 
    });

    Menu.associate = function(models) {
        Menu.hasMany(models.MenuItem, {
            foreignKey: 'MenuID', 
            as: 'MenuItems',
            onDelete: 'CASCADE',
        });
    };

    return Menu;
};
