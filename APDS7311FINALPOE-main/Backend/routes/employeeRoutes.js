const express = require("express");
const Payment = require("../models/Payment");
const VerifiedPayment = require("../models/VerifiedPayment");
const { employeeAuth } = require("../middlewares/empAuthMiddleware");
const router = express.Router();

// Get all payments (for review by employees)
router.get("/payments", employeeAuth, async (req, res) => {
  try {
    const payments = await Payment.find({ verified: false });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments" });
  }
});

// Verify a payment and move to VerifiedPayments
router.put("/payments/:id/verify", employeeAuth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Set verified to true
    payment.verified = true;
    await payment.save();

    // Move payment to VerifiedPayments
    const verifiedPayment = new VerifiedPayment(payment.toObject());
    await verifiedPayment.save();

    // Optionally, remove original payment from Payments collection
    await Payment.findByIdAndDelete(req.params.id);

    res.json({ message: "Payment verified and saved to VerifiedPayments" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying payment" });
  }
});

// Get all verified payments
router.get("/verified-payments", employeeAuth, async (req, res) => {
    try {
      const verifiedPayments = await VerifiedPayment.find();
      res.json(verifiedPayments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching verified payments" });
    }
  });

module.exports = router;
