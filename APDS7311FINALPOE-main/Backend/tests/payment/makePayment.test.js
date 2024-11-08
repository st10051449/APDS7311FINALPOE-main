const request = require("supertest");
const { app, closeServers } = require("../../server");
const mongoose = require("mongoose");
//const User = require("../../models/User");
const User = require("../../models/Payment");
//const jwt = require("jsonwebtoken");
let token; // Variable to store the bearer token
let server;

// Mock environment variables
require("dotenv").config({ path: ".env.test" });
process.env.ATLAS_URI = process.env.ATLAS_URI_TEST;

// RegEx patterns for validation tests
const regexPatterns = {
  amount: /^\d+(\.\d{1,2})?$/,       // Amount: number with up to 2 decimal places
  currency: /^[A-Z]{3}$/,            // Standard currency codes (e.g., USD, ZAR)
  swiftCode: /^[A-Z0-9]{8,11}$/,     // Swift code (standard format)
  payeeAccountNumber: /^\d{10}$/,    // 10-digit account number for recipient
  payeeAccountOwner: /^[a-zA-Z\s]+$/ // Full name with letters and spaces only
};

describe("POST make a payment ", () => {
  beforeAll(async () => {
    // Start server and register user
    const port = Math.floor(Math.random() * (9999 - 3001) + 3001);
    server = app.listen(port, () => console.log(`Test server running on port ${port}`));

   // Register user to obtain initial token
   const registerResponse = await request(app)
   .post("/api/users/register")
   .send({ 
    fullName: "John Doe", 
    idNumber: "1234567890123", 
    accountNumber: "1234567890", 
    password: "Password123@" });
 expect(registerResponse.statusCode).toBe(201);
 token = registerResponse.body.token;

 // Log in to get the JWT token for making payments
 const loginResponse = await request(app)
   .post("/api/auth/login")
   .send({ 
    fullName: "John Doe", 
    accountNumber: "1234567890", 
    password: "Password123@" });

 expect(loginResponse.statusCode).toBe(200);
 token = loginResponse.body.token; // Set token to JWT token for authorization
});

  afterEach(async () => {
    // Clean up test payments
    // Delete test user after each test
    //const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TEST); // Replace with your actual secret
    await mongoose.connection.collection("users").deleteOne({ accountNumber: "1234567890" });
    await mongoose.connection.collection("payments").deleteMany({ user: token.userId });
  });

  afterAll(async () => {
    //await closeServers();
    await mongoose.disconnect();
    await server.close(); // Close the specific server for this test
  });

  test("should make payment successfully with valid details", async () => {
    const paymentResponse = await request(app)
      .post("/api/payments/make")
      .set("Authorization", `Bearer ${token}`)
      .send({
        payerAccountNumber: "1234567890",
        amount: "1000.00",
        currency: "USD",
        provider: "SWIFT",
        payeeAccountNumber: "0987654321",
        payeeAccountOwner: "Jane Smith",
        swiftCode: "HVBKUS6S"
      });

    expect(paymentResponse.statusCode).toBe(201);
    expect(paymentResponse.body).toHaveProperty("message", "Payment successful");
  });

 
  test("should fail with invalid amount format", async () => {
    const invalidAmount = "1000.000"; // Invalid (more than 2 decimal places)
    expect(regexPatterns.amount.test(invalidAmount)).toBe(false);

    const paymentResponse = await request(app)
      .post("/api/payments/make")
      .set("Authorization", `Bearer ${token}`)
      .send({
        payerAccountNumber: "1234567890",
        amount: invalidAmount,
        currency: "USD",
        provider: "SWIFT",
        payeeAccountNumber: "0987654321",
        payeeAccountOwner: "Jane Smith",
        swiftCode: "HVBKUS6S"
      });

    expect(paymentResponse.statusCode).toBe(400);
    expect(paymentResponse.body).toHaveProperty("message", "Invalid amount format");
  });

  test("should fail with invalid currency format", async () => {
    const invalidCurrency = "US"; // Invalid (not 3 uppercase letters)
    expect(regexPatterns.currency.test(invalidCurrency)).toBe(false);

    const paymentResponse = await request(app)
      .post("/api/payments/make")
      .set("Authorization", `Bearer ${token}`)
      .send({
        payerAccountNumber: "1234567890",
        amount: "1000.00",
        currency: invalidCurrency,
        provider: "SWIFT",
        payeeAccountNumber: "0987654321",
        payeeAccountOwner: "Jane Smith",
        swiftCode: "HVBKUS6S"
      });

    expect(paymentResponse.statusCode).toBe(400);
    expect(paymentResponse.body).toHaveProperty("message", "Invalid currency format");
  });

  test("should fail with invalid SWIFT code format", async () => {
    const invalidSwiftCode = "HV6"; // Invalid (too short)
    expect(regexPatterns.swiftCode.test(invalidSwiftCode)).toBe(false);

    const paymentResponse = await request(app)
      .post("/api/payments/make")
      .set("Authorization", `Bearer ${token}`)
      .send({
        payerAccountNumber: "1234567890",
        amount: "1000.00",
        currency: "USD",
        provider: "SWIFT",
        payeeAccountNumber: "0987654321",
        payeeAccountOwner: "Jane Smith",
        swiftCode: invalidSwiftCode
      });

    expect(paymentResponse.statusCode).toBe(400);
    expect(paymentResponse.body).toHaveProperty("message", "Invalid swiftCode format");
  });

  test("should fail with invalid payee account number format", async () => {
    const invalidAccountNumber = "12345"; // Invalid (not 10 digits)
    expect(regexPatterns.payeeAccountNumber.test(invalidAccountNumber)).toBe(false);

    const paymentResponse = await request(app)
      .post("/api/payments/make")
      .set("Authorization", `Bearer ${token}`)
      .send({
        payerAccountNumber: "1234567890",
        amount: "1000.00",
        currency: "USD",
        provider: "SWIFT",
        payeeAccountNumber: invalidAccountNumber,
        payeeAccountOwner: "Jane Smith",
        swiftCode: "HVBKUS6S"
      });

    expect(paymentResponse.statusCode).toBe(400);
    expect(paymentResponse.body).toHaveProperty("message", "Invalid payeeAccountNumber format");
  });

  test("should fail with invalid payee account owner name format", async () => {
    const invalidOwnerName = "Jane123"; // Invalid (contains numbers)
    expect(regexPatterns.payeeAccountOwner.test(invalidOwnerName)).toBe(false);

    const paymentResponse = await request(app)
      .post("/api/payments/make")
      .set("Authorization", `Bearer ${token}`)
      .send({
        payerAccountNumber: "1234567890",
        amount: "1000.00",
        currency: "USD",
        provider: "SWIFT",
        payeeAccountNumber: "0987654321",
        payeeAccountOwner: invalidOwnerName,
        swiftCode: "HVBKUS6S"
      });

    expect(paymentResponse.statusCode).toBe(400);
    expect(paymentResponse.body).toHaveProperty("message", "Invalid payeeAccountOwner format");
  });
});

