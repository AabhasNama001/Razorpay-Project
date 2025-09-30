const mongoose = require("mongoose");

async function connectDb(req, res) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.error("Error connecting to DB", error);
  }
}

module.exports = connectDb;
