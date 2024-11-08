/*const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sanitizeInput } = require("../config/security");
const { RateLimiterMemory } = require("rate-limiter-flexible");


// Configure rate limiter (allow 5 attempts per IP per 15 minutes)
const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 900, // per 15 minutes
});

exports.loginUser = async (req, res) => {
  const { accountNumber, password, fullName } = req.body;

  const sanitizedPassword = sanitizeInput (password.trim());
  const sanitizedAccountNumber = sanitizeInput(accountNumber.trim());
  const sanitizedFullName =sanitizeInput(fullName);

  // Check if accountNumber and password are provided
  if (!sanitizedAccountNumber || !sanitizedPassword || !sanitizedFullName) {
    return res.status(400).json({ message: "Please provide your correct account number, full name and password" });
  }

  try {
    const user = await User.findOne({accountNumber: sanitizedAccountNumber });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials Accs" });
    }

     // Check if the fullName matches the user's fullName in the database
     if (user.fullName !== sanitizedFullName) {
      return res.status(400).json({ message: "Invalid full name." });  // Return error if full name doesn't match
    }
   
    //const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials Pass" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });



  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }

  
};*/

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sanitizeInput } = require("../config/security");
const { RateLimiterMemory } = require("rate-limiter-flexible");

// Configure rate limiter (allow 7 attempts per IP per 15 minutes)
const rateLimiter = new RateLimiterMemory({
  points: 7, // 7 attempts
  duration: 900, // per 15 minutes
});

exports.loginUser = async (req, res) => {
  const { accountNumber, password, fullName } = req.body;

  const sanitizedPassword = sanitizeInput(password.trim());
  const sanitizedAccountNumber = sanitizeInput(accountNumber.trim());
  const sanitizedFullName = sanitizeInput(fullName);

  // Check if accountNumber, fullName and password are provided
  if (!sanitizedAccountNumber || !sanitizedPassword || !sanitizedFullName) {
    return res.status(400).json({ message: "Please provide your correct account number, full name, and password." });
  }

  try {
    // Consume one point for each failed login attempt
    await rateLimiter.consume(req.ip);

    const user = await User.findOne({ accountNumber: sanitizedAccountNumber });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check if the fullName matches the user's fullName in the database
    if (user.fullName !== sanitizedFullName) {
      return res.status(400).json({ message: "Invalid full name." });
    }

    const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    // Log the error for debugging
    console.error("Login error:", error);

  // Check if it's a rate-limiting error based on remainingPoints property
  if (error && error.remainingPoints !== undefined) {
    return res.status(429).json({
      message: "Too many login attempts. Please try again later.",
      remainingAttempts: error.remainingPoints,
      waitTime: error.msBeforeNext,
    });
  } else {
      // Handle other types of errors
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      // For any other unknown error, return a generic message
      return res.status(500).json({ message: "An unexpected error occurred." });
    }
}
};


