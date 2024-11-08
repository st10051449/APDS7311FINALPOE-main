// createEmployee.js
const mongoose = require("mongoose");
const Employee = require("../models/Employee"); // Make sure this path is correct

// Replace with your MongoDB URI
const dbURI = "mongodb+srv://apds7311:hfxYQnqmsqa6go7N@apdshscluster.wpjo0.mongodb.net/test";

async function createEmployee(username, password) {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    // Create a new employee with plain text password
    const newEmployee = new Employee({
      username,
      password,  // Pass the plain password; it will be hashed by the schema middleware
      role: "employee"
    });

    await newEmployee.save();
    console.log("Employee created successfully!");
  } catch (error) {
    console.error("Error creating employee:", error);
  } finally {
    await mongoose.disconnect();
  }
}

// Replace these with the new employee's credentials
const username = "employee5";
const password = "password123";

createEmployee(username, password);
