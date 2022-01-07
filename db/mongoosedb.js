const { connect } = require("mongoose");

let dbURL = "mongodb://127.0.0.1:27017/cert_verification";

if (process.env.NODE_ENV === "production") dbURL = process.env.DB_HOST;

connect(dbURL)
  .then(() => {
    console.log("db connected successfully!");
    // console.log(connection)
  })
  .catch((err) => {
    console.log(err);
  });
