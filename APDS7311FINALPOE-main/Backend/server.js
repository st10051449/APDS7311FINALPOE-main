const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { applySecurityMiddleware } = require("./config/security");
const authRoutes = require("./routes/authRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");
const authMiddleware = require("./middlewares/authMiddleware");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const employeeRoutes = require("./routes/employeeRoutes");


// Load environment variables
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" }); // Load test environment variables
  console.log("Running in Test Mode");
} else {
  dotenv.config(); // Load production or default environment variables
}

// Initialize Express app
const app = express();

//setting trust proxy
app.set("trust proxy", 1);

app.use("/api/employee", employeeRoutes);
// Connect to database
connectDB();

// Parse incoming JSON requests
app.use(express.json());

// Apply security middleware
applySecurityMiddleware(app);

// Apply error handling middleware
app.use(errorHandler);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes); // Base URL for user routes

// SSL Certificates for HTTPS
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "Keys", "privatekey.pem")),
  cert: fs.readFileSync(path.join(__dirname, "Keys", "certificate.pem")),
};

// Create HTTPS server
// Dynamic port assignment for testing and production
const httpsPort = process.env.NODE_ENV === "test" ? Math.floor(Math.random() * (9999 - 3001) + 3001) : process.env.HTTPS_PORT || 443;


// Create HTTPS server
let httpsServer = https.createServer(sslOptions, app);
httpsServer.listen(httpsPort, () => {
  console.log(`Secure server running on https://localhost:${httpsPort}`);
});

// Create HTTP server to redirect to HTTPS
const httpPort = process.env.NODE_ENV === "test" ? Math.floor(Math.random() * (9999 - 3001) + 3001) : process.env.PORT || 80;

// Create HTTP server for redirecting to HTTPS
let httpServer = http.createServer((req, res) => {
  res.writeHead(301, { "Location": `https://${req.headers.host}${req.url}` });
  res.end();
});
httpServer.listen(httpPort, () => {
  console.log(`HTTP server running on port ${httpPort} and redirecting to HTTPS`);
});

// MongoDB URI based on environment
const dbURI = process.env.NODE_ENV === "test" ? process.env.ATLAS_URI_TEST : process.env.ATLAS_URI;


// Graceful shutdown to avoid port conflicts in tests
const closeServers = async () => {
  if (httpsServer) {
    await httpsServer.close();
    console.log("HTTPS server closed");
  }
  if (httpServer) {
    await httpServer.close();
    console.log("HTTP server closed");
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

// Ensure servers are closed after all tests
if (process.env.NODE_ENV === "test") {
  afterAll(async () => {
    await closeServers();
  });
}

// Export the app for testing
module.exports = { app, closeServers };


