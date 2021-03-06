const path = require("path");

const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const createError = require('http-errors');

const Certificate = require('./models/certificate');

const authRoute = require("./routes/auth");
const certificateRoute = require("./routes/certificate");
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const courseRoute = require("./routes/course");

const app = express();
const publicDirPath = path.join(__dirname, "..", "public");

app.use(cors())
app.options('*', cors())

app.use(express.static(publicDirPath));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
dotenv.config();

/*
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
*/

const authMiddleware = require("./middlewares/auth");
const adminMiddleware = require("./middlewares/admin");
const guestMiddleware = require("./middlewares/guest");

app.use("/courses", courseRoute);
app.use("/auth", guestMiddleware, authRoute);
app.use("/users", authMiddleware, adminMiddleware, userRoute);
app.use("/admin", authMiddleware, adminMiddleware, adminRoute);
app.use("/certificates", authMiddleware, adminMiddleware, certificateRoute);
app.post("/verify-certificate", async (req, res) => {
  const code = req.body.code;

  try {
    const certificate = await Certificate.findOne({code: code});

    if (!certificate) {
      throw createError(404, "No Certificate Found!");
    }

    await certificate.populate('student');

    res.json({certificate, status: 200});

  } catch (e) {
    res.status(e.status || 500).json({e, status: e.status || 500});
  }

});
app.post("/logout", authMiddleware, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);

    await req.user.save();

    res.send({status: 200});
  } catch (e) {
    res.status(500).send({e, status: 500});
  }
});

module.exports = app;
