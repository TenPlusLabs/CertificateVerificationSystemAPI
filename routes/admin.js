const router = require("express").Router();
const createError = require('http-errors')

const User = require("../models/user");

router.get("/students", async (req, res) => {
  try {
    const students = await User.find({role: 'student'});
    // if (!users) throw new Error('No user found')
    res.jsonp(students);
  } catch (e) {
    res.status(500).json(e);
  }

  /*User.find().then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.status(500).json(err.message)
    })*/
});

module.exports = router;

// res.status(e.status || 500).jsonp(e)
