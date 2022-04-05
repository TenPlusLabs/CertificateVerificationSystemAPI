const router = require("express").Router();
const createError = require('http-errors');

const Course = require("../models/course");

router.post("", async (req, res) => {
  const course = new Course(req.body);

  try {
    await course.save();

    res.status(201).jsonp({course, status: 201});
  } catch (e) {
    res.status(e.status || 400).jsonp({e, status: e.status || 400});
  }
});
router.get("", async (req, res) => {
  try {
    const courses = await Course.find();
    res.jsonp({courses, status: 200});
  } catch (e) {
    res.status(e.status || 500).jsonp({e, status: e.status || 500});
  }
});
router.get("/:mode", async (req, res) => {
  try {
    const courses = await Course.find({mode});
    res.jsonp({courses, status: 200});
  } catch (e) {
    res.status(e.status || 500).jsonp({e, status: e.status || 500});
  }
});

module.exports = router;
