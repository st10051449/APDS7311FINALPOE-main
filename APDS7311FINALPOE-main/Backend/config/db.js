

const mongoose = require("mongoose");

// Load environment variables
require("dotenv").config();

// Database connection
const connectDB = async () => {
  try {
    // Select the correct URI based on the environment
    const dbURI = process.env.NODE_ENV === "test" ? process.env.ATLAS_URI_TEST : process.env.ATLAS_URI;

    // Connect to MongoDB with the chosen URI
    const conn = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected to MongoDB - ${process.env.NODE_ENV === "test" ? "TestDatabase" : "ProductionDatabase"} on host ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process if database connection fails
  }
};

module.exports = connectDB;

