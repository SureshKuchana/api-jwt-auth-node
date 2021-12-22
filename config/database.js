const mongoose = require("mongoose");

const { MONGO_URL } = process.env;
console.log(" MONGO_URL ", MONGO_URL);
exports.connect = () => {
  // Connecting to Database
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(" Successfully connected to database ");
    })
    .catch((err) => {
      console.log(" database connection failed. exiting now... ");
      console.error(err);
      process.exit(1);
    });
};
