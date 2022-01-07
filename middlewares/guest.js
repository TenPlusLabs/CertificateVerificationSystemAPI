const jwt = require("jsonwebtoken");

const User = require("../models/user");

const guest = async (req, res, next) => {
  try {
    if (req.header("Authorization")) {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, "whatever");
      const user = await User.findOne({ id: decoded._id, "tokens.token": token });

      if (user) {
        throw new Error(); // TODO: Throw an instance of http-errors instead
      }
    }

    next();
  } catch (e) {
    res.status(e.status || 403).send({ error: e.message });
  }
};

module.exports = guest;
