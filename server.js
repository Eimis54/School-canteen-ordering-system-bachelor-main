const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('school_canteen', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch(error => {
  console.error('Error synchronizing the database:', error);
});

const authRoutes = require('./routes/authRoutes');
const childrenRoutes = require('./routes/childrenRoutes');
const dealsRoutes = require('./routes/dealsRoutes');
const menuRoutes = require('./routes/menusRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const photosRoutes = require('./routes/photosRoutes');
const productsRoutes = require('./routes/productsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const adminMenuRoutes = require('./routes/adminMenuRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const productCategoriesRoutes = require('./routes/productCategoriesRoutes');
// const cartRoutes = require('./routes/cartRoutes');


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin/roles', rolesRoutes);
app.use('/api/admin/menus', adminMenuRoutes);
app.use('/api/productcategories', productCategoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/user', usersRoutes);
app.use('/api/photo', photosRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/children', childrenRoutes);
// app.use('/api/cart', cartRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
