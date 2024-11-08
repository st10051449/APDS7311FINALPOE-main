const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const employeeAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized access" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(decoded.id);
    if (!employee) return res.status(401).json({ message: "Unauthorized access" });
    req.employee = employee;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { employeeAuth };
