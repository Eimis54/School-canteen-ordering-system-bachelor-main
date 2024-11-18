require('dotenv').config();
const { Sequelize } = require('sequelize');

const database = process.env.REACT_APP_DB_NAME;
const username = process.env.REACT_APP_DB_USERNAME;
const password = process.env.REACT_APP_DB_PASSWORD;
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
