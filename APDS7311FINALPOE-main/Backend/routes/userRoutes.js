const express = require("express");
//const { registerUser, loginUser, getUserDetails } = require('../controllers/userController');
const { registerUser, getUserDetails } = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { validateInput } = require("../middlewares/inputValidationMiddleware");
const router = express.Router();

// Register route
router.post("/register",validateInput, registerUser);

// Get user details (protected route)
router.get("/me", authMiddleware, getUserDetails);

module.exports = router;
