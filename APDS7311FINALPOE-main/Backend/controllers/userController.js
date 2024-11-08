const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sanitizeInput } = require("../config/security");

// Register User
exports.registerUser = async (req, res) => {
  const { fullName, idNumber, accountNumber, password } = req.body;

  try {

    const sanitizedAccountNumber = sanitizeInput(accountNumber.trim());
    const sanitizedFullName = sanitizeInput(fullName.trim());
    const sanitizedIdNumber = sanitizeInput(idNumber.trim());
    const sanitizedPassword = sanitizeInput(password.trim());

    const userAccExists = await User.findOne({ accountNumber });
    if (userAccExists) {
      return res.status(400).json({ message: "User Account already exists" });
    }

    const userIDExists = await User.findOne({ idNumber });
    if (userIDExists) {
      return res.status(400).json({ message: "User ID already exists" });
    }

    // No need to hash the password here, it will be hashed in the pre-save hook
    const user = await User.create({
      fullName: sanitizedFullName,
      idNumber: sanitizedIdNumber,
      accountNumber: sanitizedAccountNumber,
      password: sanitizedPassword // Plain text password, it will be hashed by the middleware
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({message: "User successfully registered", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Details (for logged-in users)
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
