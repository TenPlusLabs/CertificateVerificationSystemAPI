const jwt = require("jsonwebtoken");
const createError = require('http-errors');

const User = require("../models/user");

const admin = async (req, res, next) => {
  try {
      const user = req.user;
    if (!user || user.role !== 'admin') {
      throw createError(401, "User not authorized"); // TODO: Throw an instance of http-errors instead
    }
    next();
  } catch (e) {
    res.status(e.status || 401).send({ error: "Not Authorized" });
  }
};

module.exports = admin;
