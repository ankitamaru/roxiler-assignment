const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT_URL);
    console.log("Connected to MongoDB Atlas.");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = dbConnect;
