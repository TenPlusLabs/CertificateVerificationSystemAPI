const { hashSync, compareSync } = require("bcryptjs");
const User = require("./../models/user");

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Email is already in use!" });
      return;
    }

    next();
  });
};

const checkValidLoginCredentials = (req, res, next) => {
  // Email
  User.findOne({ email: req.body.email })
    .select("+password")
    .exec()
    .then((user) => {
      // console.log(!compareSync(req.body.password, user.password));

      if (!user || !compareSync(req.body.password, user.password)) {
        res.status(404).send({ message: "email or password incorrect - utils" });
        return;
      }

      next(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err });
      return;
    });
};

const generateRandomString = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return Buffer.from(result).toString("base64");
};

/*
  const secret = Buffer.from(process.env.APP_KEY.replace("base64:", ""), "base64");
  // const secret = Buffer.from("secretkey").toString("base64");
  // const secret = ;
  console.log(secret.toString("ascii"));

console.log(Buffer.from(generateRandomString(32)).toString("base64")); */

const hashPassword = function (password) {
  return hashSync(password, 12);
};

let capitalize = (name) => {
  const newName = name.toLowerCase().split(" ");
  let finalName = "";

  newName.forEach((name) => {
    finalName += " " + name[0].toUpperCase() + name.slice(1);
  });

  return finalName.trim();
};

module.exports = {
  hashPassword,
  capitalize,
  generateRandomString,
  checkDuplicateUsernameOrEmail,
  checkValidLoginCredentials,
};
