const express = require("express");
const { makePayment, getPaymentHistory } = require("../controllers/paymentController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { validateInput } = require("../middlewares/inputValidationMiddleware");
const router = express.Router();

// Make a payment (protected route)
router.post("/make", authMiddleware, validateInput, makePayment);

// Get payment history (protected route)
router.get("/history", authMiddleware, getPaymentHistory);

module.exports = router;
