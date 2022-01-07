const express = require("express");
// const createError = require('http-errors')

const User = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
  const user = new User(req.body);

  try {
    const newUser = await user.save();
    const token = await newUser.genAuthToken();

    res.status(201).json({ user: newUser, token });
  } catch (e) {
    res.status(e.status || 400).json(e);
  }

  /*user.save().then(result => {
        res.status(201).json(result)
    }).catch(err => {
        res.status(400).json(err.message)
    })*/
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.genAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(e.status || 500).send({ error: e.message });
  }
});

module.exports = router;
