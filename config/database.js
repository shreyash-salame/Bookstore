const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.URI);
};

module.exports = connectDB;
