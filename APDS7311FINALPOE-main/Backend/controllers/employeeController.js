// controllers/employeeController.js
const Payment = require("../models/Payment");
const VerifiedPayment = require("../models/VerifiedPayment");

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.findById(paymentId);

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.verified = true;
    await payment.save();

    const verifiedPayment = new VerifiedPayment(payment.toObject());
    await verifiedPayment.save();

    res.json({ message: "Payment verified", payment });
  } catch (error) {
    res.status(500).json({ message: "Error verifying payment" });
  }
};

module.exports = { getAllPayments, verifyPayment };
