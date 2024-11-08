const request = require("supertest");
const mongoose = require("mongoose");
const { app, closeServers } = require("../../server");
const User = require("../../models/User"); 

// Mock environment variables
require("dotenv").config({ path: ".env.test" });
process.env.ATLAS_URI = process.env.ATLAS_URI_TEST;

describe("POST /api/users/register", () => {
 
  beforeEach(async () => {
    // Clear users collection in TestDatabase before each test
    await User.deleteMany({});
  });

  
  afterAll(async () => {
    //await closeServers(); // Close servers and database connection
    await mongoose.disconnect(); // Disconnect from TestDatabase
  });

  test("should register a new user successfully with valid inputs", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        fullName: "John Doe",
        idNumber: "1234567890123", // 13-digit SA ID number
        accountNumber: "1234567890", // 10-digit account number
        password: "ValidPass123", // Valid password with alphanumeric characters
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token"); // Ensure token is returned
    expect(response.body.message).toBe("User successfully registered");
  });

  test("should not register a new user as the account already exists", async () => {
    // First registration
    await request(app)
      .post("/api/users/register")
      .send({
        fullName: "John Doe",
        idNumber: "1234567890123",
        accountNumber: "1234567890",
        password: "ValidPass123",
      });

    // Attempt to register again with the same account number
    const response = await request(app)
      .post("/api/users/register")
      .send({
        fullName: "John Doe",
        idNumber: "1234567890123",
        accountNumber: "1234567890",
        password: "ValidPass123",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "User Account already exists");
  });

  test("should fail if fullName contains invalid characters", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        fullName: "John123", // Invalid full name with numbers
        idNumber: "1234567890123",
        accountNumber: "1234567890",
        password: "ValidPass123",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid fullName format");
  });

  test("should fail if ID number is not exactly 13 digits", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        fullName: "John Doe",
        idNumber: "12345678901", // Invalid ID number (less than 13 digits)
        accountNumber: "1234567890",
        password: "ValidPass123",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid idNumber format");
  });

  test("should fail if account number is not exactly 10 digits", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        fullName: "John Doe",
        idNumber: "1234567890123",
        accountNumber: "12345678", // Invalid account number (less than 10 digits)
        password: "ValidPass123",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid accountNumber format");
  });

  test("should fail if password is not between 8 and 20 characters", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        fullName: "John Doe",
        idNumber: "1234567890123",
        accountNumber: "1234567890",
        password: "short", // Invalid password (less than 8 characters)
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid password format");
  });
});
