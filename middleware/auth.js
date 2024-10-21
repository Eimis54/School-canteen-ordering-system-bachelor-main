const jwt = require("jsonwebtoken");
const db = require("../db");
// require('dotenv').config();

const secretKey = process.env.REACT_APP_SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.user.id);
    if (user && user.RoleID === 2) {
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    res.sendStatus(500);
  }
};
const isCashier = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.user.id);
    if (user && user.RoleID === 3) {
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports = { authenticateToken, isAdmin, isCashier };
