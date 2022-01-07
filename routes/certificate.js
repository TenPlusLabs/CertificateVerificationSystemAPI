const router = require("express").Router();
const verify = router;
const createError = require('http-errors');

const Certificate = require("../models/certificate");

// Requiring ObjectId from mongoose npm package
const ObjectId = require("mongoose").Types.ObjectId;

// Validator function
function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
}

router.post("", async (req, res) => {
  const certificate = new Certificate(req.body);

  try {
    await certificate.save();

    res.status(201).jsonp(certificate);
  } catch (e) {
    res.status(e.status || 400).jsonp(e);
  }
});
router.get("", async (req, res) => {
  try {
    const certificates = await Certificate.find();

    res.jsonp(certificates);
  } catch (e) {
    res.status(e.status || 500).jsonp(e);
  }
});

// Attempts to find a certificate by its id or unique slug
router.get("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    let certificate;
    if (isValidObjectId(_id)) {
      certificate = await Certificate.findById(_id);
    } else {
      certificate = await Certificate.findOne({ slug: _id });
    }

    if (!certificate) {
      throw new Error(); // TODO: Change to an instance of http-errors
    }

    res.jsonp(certificate);
  } catch (e) {
    res.status(e.status || 500).jsonp(e);
  }
});
router.patch("/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "price", "type", "description", "certificateImageUrl"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  try {
    if (!isValidOperation) {
      throw new Error(); // TODO: Change to an instance of http-errors
    }

    let certificate;

    if (isValidObjectId(req.params.id)) {
      certificate = await Certificate.findById(req.params.id);
    } else {
      certificate = await Certificate.findOne({ slug: req.params.id });
    }

    if (!certificate) {
      throw new Error(); // TODO: Change to an instance of http-errors
    }

    updates.forEach((update) => (certificate[update] = req.body[update]));

    await certificate.save();

    res.jsonp(certificate);
  } catch (e) {
    res.status(e.status || 500).jsonp(e);
  }
});
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    let certificate;
    if (isValidObjectId(_id)) {
      certificate = await Certificate.findByIdAndDelete(_id);
    } else {
      certificate = await Certificate.findOneAndDelete({ slug: _id });
    }

    if (!certificate) {
      throw new Error(); // TODO: Change to an instance of http-errors
    }

    res.jsonp(certificate);
  } catch (e) {
    res.status(e.status || 500).jsonp(e);
  }
});

module.exports = router;
