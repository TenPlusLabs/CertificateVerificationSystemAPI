const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const createError = require('http-errors');
const cors = require('cors');

const Certificate = require('./models/certificate');

const authRoute = require("./routes/auth");
const certificateRoute = require("./routes/certificate");
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");

const authMiddleware = require("./middlewares/auth");
const adminMiddleware = require("./middlewares/admin");
const guestMiddleware = require("./middlewares/guest");

const app = express();
const publicDirPath = path.join(__dirname, "..", "public");

app.options("*", cors());
app.use(cors());
app.use(express.static(publicDirPath));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
dotenv.config();

app.use("/auth", guestMiddleware, authRoute);
app.use("/users", authMiddleware, userRoute);
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

module.exports = app;
