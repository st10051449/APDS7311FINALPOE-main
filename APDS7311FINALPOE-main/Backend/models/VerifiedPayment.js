const mongoose = require("mongoose");

const verifiedPaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  payerAccountNumber: { type: String, required: true },
  payerAccountOwner: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  provider: { type: String, required: true },
  swiftCode: { type: String, required: true },
  payeeAccountNumber: { type: String, required: true },
  payeeAccountOwner: { type: String, required: true },
  verified: { type: Boolean, default: true }, // Set to true since it’s already verified
  createdAt: { type: Date, default: Date.now },
});

const VerifiedPayment = mongoose.model("VerifiedPayment", verifiedPaymentSchema);
module.exports = VerifiedPayment;
