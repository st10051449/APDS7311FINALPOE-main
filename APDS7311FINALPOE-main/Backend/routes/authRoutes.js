const express = require("express");
const { loginUser } = require("../controllers/authController");
const { validateInput } = require("../middlewares/inputValidationMiddleware");
const Employee = require("../models/Employee");
const { empValidateInput } = require("../middlewares/empValidateInput");
const jwt = require("jsonwebtoken");
//const ExpressBrute = require("express-brute");
const router = express.Router();

/*// Setup Express Brute with MemoryStore (for dev only)
const store = new ExpressBrute.MemoryStore();
const bruteForce = new ExpressBrute(store, {
  freeRetries: 5, // Allow 5 attempts
  minWait: 5 * 60 * 1000, // 5 minutes lockout after 5 failed attempts
  maxWait: 15 * 60 * 1000, // 15 minutes lockout for repeated failures
  lifetime: 15 * 60, // Count attempts within a 15-minute window
});*/

// Login route
router.post("/login",validateInput, loginUser);


router.post("/employee-login", empValidateInput, async (req, res) => {
  const { username, password } = req.body;

  try {
    const employee = await Employee.findOne({ username });
    if (!employee) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const isPasswordValid = await employee.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    

    const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    //res.json({ token });
    
    res.status(200).json({ message: "Employee login successfull", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;


// Login route with Express Brute
//router.post("/login", bruteForce.prevent, validateInput, loginUser);

