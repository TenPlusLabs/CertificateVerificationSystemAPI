const express = require("express");
const createError = require("http-errors");

const User = require("../models/user");

const router = express.Router();

router.post("", async (req, res) => {
  const user = new User(req.body);

  try {
    const newUser = await user.save();
    res.status(201).json({user: newUser, status: 201});
  } catch (e) {
    res.status(400).json({e, status: e.status || 400});
  }

  /*user.save().then(result => {
        res.status(201).json(result)
    }).catch(err => {
        res.status(400).json(err.message)
    })*/
});
router.get("", async (req, res) => {
  try {
    const users = await User.find();
    // if (!users) throw new Error('No user found')
    res.jsonp({users, status: 200});
  } catch (e) {
    res.status(500).json({e, status: e.status || 500});
  }

  /*User.find().then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.status(500).json(err.message)
    })*/
});
router.get("/me", async (req, res) => {
  const user = await req.user.populate({
    path: 'applications',
    select: 'user programme stage status',
  })
  res.json(user);

  /*User.findById(_id).then(result => {
        if (!result) {
            const error = new Error('User not found!')
            error.status = 404
            return res.status(error.status).send()
        }
        res.json(result)
    }).catch(err => {
        res.status(500).json(err.message)
    })*/
});
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      const error = createError(404, "User not found");
      // return res.status(error.status).jsonp(error)
      throw error;
    }
    res.jsonp(user);
  } catch (e) {
    res.status(e.status || 500).jsonp(e);
  }

  /*User.findById(_id).then(result => {
        if (!result) {
            const error = new Error('User not found!')
            error.status = 404
            return res.status(error.status).send()
        }
        res.json(result)
    }).catch(err => {
        res.status(500).json(err.message)
    })*/
});
router.patch("/me", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  try {
    if (!isValidOperation) {
      const error = createError(400, "Invalid operation");
      throw error;
    }

    // const _id = req.params.id
    const data = req.body;
    // const user = await User.findByIdAndUpdate(_id, data, {new: true, runValidators: true})

    const user = req.user;

    updates.forEach((update) => {
      user[update] = data[update];
    });

    await user.save();

    res.jsonp(user);
  } catch (e) {
    res.status(e.status || 400).send(e);
  }
});
router.patch("/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  try {
    if (!isValidOperation) {
      const error = createError(400, "Invalid operation");
      throw error;
    }

    const _id = req.params.id;
    const data = req.body;
    // const user = await User.findByIdAndUpdate(_id, data, {new: true, runValidators: true})

    const user = await User.findById(_id);

    if (!user) {
      const error = createError(404, "User not found");
      throw error;
    }

    updates.forEach((update) => {
      user[update] = data[update];
    });

    await user.save();

    res.jsonp(user);
  } catch (e) {
    res.status(e.status || 400).send(e);
  }
});
router.delete("/me", async (req, res) => {
  try {
    const user = await req.user.remove();

    res.jsonp(user);
  } catch (e) {
    res.status(e.status || 500).jsonp(e);
  }
});
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(_id);

    if (!user) {
      const error = createError(404, "User not found");
      throw error;
    }

    res.jsonp(user);
  } catch (e) {
    res.status(e.status || 500).jsonp(e);
  }
});
router.post("/logout", async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);

    await req.user.save();

    res.send({status: 200});
  } catch (e) {
    res.status(500).send({e, status: 500});
  }
});
router.post("/logoutAll", async (req, res) => {
  try {
    // req.user.tokens = req.user.tokens.filter(token => token.token === req.token) To invalidate all other sessions except this
    req.user.tokens = []; // To invalidate all sessions including this

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});
router.post("/logoutOthers", async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token === req.token); // To invalidate all other sessions except this
    // req.user.tokens = [] To invalidate all sessions including this

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
