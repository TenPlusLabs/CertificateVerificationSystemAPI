const jwt = require("jsonwebtoken");

const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "whatever"); // TODO: Change Secret to ENV APP_SECRET_KEY
    const user = await User.findOne({ id: decoded._id, "tokens.token": token });

    if (!user) {
      throw new Error(); // TODO: Throw an instance of http-errors instead
    }

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(e.status || 401).send({ error: "Not Authenticated" });
  }
};

module.exports = auth;
