const { Sequelize } = require('sequelize');

const database = 'school_canteen';
const username = 'root';
const password = 'password';
const host = 'localhost';
const dialect = 'mysql';

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./models/user')(sequelize, Sequelize.DataTypes);
db.Order = require('./models/order')(sequelize, Sequelize.DataTypes);
db.OrderDetail = require('./models/orderDetail')(sequelize, Sequelize.DataTypes);
db.Product = require('./models/product')(sequelize, Sequelize.DataTypes);
db.ProductCategory = require('./models/productCategory')(sequelize, Sequelize.DataTypes);
db.Role = require('./models/role')(sequelize, Sequelize.DataTypes);
db.Children = require('./models/children')(sequelize, Sequelize.DataTypes);
db.Photo = require('./models/photo')(sequelize, Sequelize.DataTypes);
db.Menu = require('./models/menu')(sequelize, Sequelize.DataTypes);
db.MenuItem = require('./models/menuitems')(sequelize, Sequelize.DataTypes);
db.CartItem = require('./models/cartitem')(sequelize, Sequelize.DataTypes);
db.OrderItem = require('./models/orderitem')(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
