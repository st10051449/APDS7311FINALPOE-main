const { sanitizeInput } = require("../config/security");

// RegEx patterns for different fields and preventing NoSQL injections and unwnated scripts
const regexPatterns = {
  fullName: /^[a-zA-Z\s]+$/,// Allows letters and spaces only
  provider: /^[a-zA-Z\s]+$/,// Allows letters and spaces only
  idNumber: /^\d{13}$/, // South African ID number (13 digits only)
  accountNumber: /^\d{10}$/, // ensuring a 10-digit account number is entered
  password: /^[\w@-]{8,20}$/, // Passwords can include alphanumeric characters and @, -, min 8, max 20 characters
  currency: /^[A-Z]{3}$/, // Standard currency codes (e.g., USD, ZAR)
  swiftCode: /^[A-Z0-9]{8,11}$/, // Swift code (standard format)
  amount: /^\d+(\.\d{1,2})?$/, // Amount: number with up to 2 decimal places
  recipientAccount: /^\d{10}$/, //only allows a 10-digit account number for recipient
  payeeAccountOwner: /^[a-zA-Z\s]+$/,
  payerAccountNumber: /^\d{10}$/,
  payeeAccountNumber: /^\d{10}$/
};

// Middleware function to validate fields based on RegEx
const validateInput = (req, res, next) => {
  const fieldsToValidate = req.body;

  for (let key in fieldsToValidate) {
    if (regexPatterns[key]) {
      const value = sanitizeInput(fieldsToValidate[key]);
      if (!regexPatterns[key].test(value)) {
        return res.status(400).json({ message: `Invalid ${key} format` });
      }
    }
  }
  next();
};

module.exports = { validateInput };
