const request = require("supertest");
//const app = require("../../server"); // Adjust the path if needed
const { app, closeServers } = require("../../server");
const mongoose = require("mongoose");
// Mock environment variables
require("dotenv").config({ path: ".env.test" });
process.env.ATLAS_URI = process.env.ATLAS_URI_TEST;
let token; // Variable to store the bearer token
let server;

// RegEx patterns 
const regexPatterns = {
  fullName: /^[a-zA-Z\s]+$/,
  accountNumber: /^\d{10}$/,
  password: /^[\w@-]{8,20}$/
};

describe("User Login Function", () => {
  beforeAll(async () => {
  
    //server = app.listen(3001, () => console.log('Test server running on port 3001'));
    const port = Math.floor(Math.random() * (9999 - 3001) + 3001); // Use a random port for each test
    server = app.listen(port, () => console.log(`Test server running on port ${port}`));
    
    // First, we need to register a user and retrieve the token for login
    const registerResponse = await request(app)
      .post("/api/users/register")
      .send({
        fullName: "John Doe",
        idNumber: "1234567890123", // Valid South African ID number
        accountNumber: "1234567890", // Valid account number
        password: "Password123@"
      });

      console.log("Registration Response Body:", registerResponse.body); // Log the response body for debugging
      
       // Check registration was successful and token was returned
    expect(registerResponse.statusCode).toBe(201); // Adjust based on actual success status code
    expect(registerResponse.body).toHaveProperty("token");
    token = registerResponse.body.token; // Assume the token is returned in the response
  });

  afterEach(async () => {
    // Delete test user after each test
    await mongoose.connection.collection("users").deleteOne({ accountNumber: "1234567890" });
    
  });

  afterAll(async () => {
    await server.close(); // Close the specific server for this test
    await closeServers(); // Close servers and database connection
    await mongoose.disconnect(); // Disconnect from TestDatabase
  });


  test("should login user successfully with valid details", async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        fullName: "John Doe",
        accountNumber: "1234567890",
        password: "Password123@"
      });
      //.set("Authorization", `Bearer ${token}`); // Set the token in the header

      console.log(loginResponse.body); // Log the body for debugging

      expect(loginResponse.statusCode).toBe(200);
      expect(loginResponse.body).toHaveProperty("message", "Login successful");
  });

  test("should fail login with invalid fullName", async () => {
    const invalidFullName = "John123"; // Invalid full name with numbers
    expect(regexPatterns.fullName.test(invalidFullName)).toBe(false);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        fullName: invalidFullName,
        accountNumber: "1234567890",
        password: "Password123@"
      })
      .set("Authorization", `Bearer ${token}`);

    expect(loginResponse.statusCode).toBe(400);
    expect(loginResponse.body).toHaveProperty("message", "Invalid fullName format");

  });

  test("should fail login with invalid accountNumber", async () => {
    const invalidAccountNumber = "12345"; // Invalid account number (not 10 digits)
    expect(regexPatterns.accountNumber.test(invalidAccountNumber)).toBe(false);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        fullName: "John Doe",
        accountNumber: invalidAccountNumber,
        password: "Password123@"
      })
      .set("Authorization", `Bearer ${token}`);

    expect(loginResponse.statusCode).toBe(400);
    expect(loginResponse.body).toHaveProperty("message", "Invalid accountNumber format");
  });

  test("should fail login with invalid password", async () => {
    const invalidPassword = "pass"; // Invalid password (too short)
    expect(regexPatterns.password.test(invalidPassword)).toBe(false);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        fullName: "John Doe",
        accountNumber: "1234567890",
        password: invalidPassword
      })
      .set("Authorization", `Bearer ${token}`);

    expect(loginResponse.statusCode).toBe(400);
    expect(loginResponse.body).toHaveProperty("message", "Invalid password format");
  });
});
