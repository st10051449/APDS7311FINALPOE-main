const Payment = require("../models/Payment");
const { sanitizeInput } = require("../config/security");
const User = require("../models/User"); 

exports.makePayment = async (req, res) => {
  const {
    payerAccountNumber,
    amount,
    currency,
    provider,
    payeeAccountNumber,
    payeeAccountOwner,
    swiftCode
  } = req.body;

  try {
    // Sanitize each input field
    const sanitizedPayerAccountNumber = sanitizeInput(payerAccountNumber);
    const sanitizedAmount = sanitizeInput(amount);
    const sanitizedCurrency = sanitizeInput(currency);
    const sanitizedProvider = sanitizeInput(provider);
    const sanitizedPayeeAccountNumber = sanitizeInput(payeeAccountNumber);
    const sanitizedPayeeAccountOwner = sanitizeInput(payeeAccountOwner);
    const sanitizedSwiftCode = sanitizeInput(swiftCode);

    const payment = new Payment({
      payerAccountNumber: sanitizedPayerAccountNumber,
      payerAccountOwner: req.user.fullName, // Full name from the logged-in user
      amount: sanitizedAmount,
      currency: sanitizedCurrency,
      provider: sanitizedProvider,
      payeeAccountNumber: sanitizedPayeeAccountNumber,
      payeeAccountOwner: sanitizedPayeeAccountOwner,
      swiftCode: sanitizedSwiftCode
    });

    // Verify that the payerAccountNumber matches the logged-in user's accountNumber
    if (sanitizedPayerAccountNumber !== req.user.accountNumber) {
      return res.status(400).json({
        message: "Payment failed: The payer's account number does not match your account number."
      });
    }

    await payment.save();
    res.status(201).json({ message: "Payment successful", paymentId: payment._id });
  } catch (error) {
    console.error(`Payment failed: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};


// Get Payment History
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


