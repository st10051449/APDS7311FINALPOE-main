Internal International Payment System
Overview
The Internal International Payment System is a secure and robust backend application designed to handle Customer registration, Customer authentication, manage Customer payment transactions as well as maintain user profiles. Built with Node.js and Express, it leverages MongoDB for data storage and incorporates multiple security measures to protect against common web vulnerabilities. This system is intended for internal use within organizations to facilitate and manage international payment operations efficiently and securely.

Team Members
Perla Jbara - ST10022447
Lee Knowels - ST10051449
Mauro Coelho -ST10080441
Gabriella Janssen - ST10034968
Daniel Antonie - ST10186731

YouTube tutorial - https://youtu.be/zI95b68un2Y

Features
• User Registration and Authentication: Secure user signup and login using JWT (JSON Web Tokens) and password hashing.
• Payment Processing: Allows authenticated users to make payments and view their payment history.
• Security Enhancements: Implements rate limiting, data sanitization, secure HTTP headers, and more to safeguard against various attacks.
• HTTPS Enforcement: Ensures all communications occur over secure HTTPS connections.
• Comprehensive Input Validation: Validates and sanitizes all incoming data to maintain data integrity and security.
Security Features

1. Rate Limiting
   • Purpose: Prevents brute-force and DDoS (Distributed Denial-of-Service) attacks by limiting the number of requests from a single IP address within a specified time frame.
   • Implementation: Utilizes the express-rate-limit middleware to restrict each IP to 100 requests every 15 minutes globally and stricter limits on sensitive routes like login.
2. Helmet for HTTP Headers Security
   • Purpose: Enhances security by setting various HTTP headers.
   • Implementation: Uses the helmet middleware to set headers like Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), and Frameguard to protect against Clickjacking.
3. Data Sanitization
   • Purpose: Prevents injection attacks by cleaning user inputs.
   • Implementation:
   o express-mongo-sanitize: Sanitizes MongoDB queries to protect against NoSQL injection.
   o DOMPurify: Sanitizes incoming request data to prevent Cross-Site Scripting (XSS) attacks.
4. HTTPS Enforcement
   • Purpose: Protects data in transit from interception and tampering.
   • Implementation: Configures HTTPS servers with SSL certificates and redirects all HTTP traffic to HTTPS.
5. JWT-Based Authentication
   • Purpose: Ensures secure user authentication and authorization.
   • Implementation: Issues JWT tokens upon successful login, which are required for accessing protected routes.
6. Input Validation
   • Purpose: Ensures that all incoming data adheres to expected formats, preventing malformed data and injection attacks.
   • Implementation: Uses regex patterns in middleware to validate fields like account numbers, currencies, SWIFT codes, and more.
7. Error Handling
   • Purpose: Manages application errors gracefully without exposing sensitive information.
   • Implementation: Custom error-handling middleware that returns meaningful error messages while hiding stack traces in production.

Defended Against Common Attacks

1. Brute-Force Attacks: Mitigated through rate limiting on login routes, restricting the number of login attempts from a single IP.
2. Session Hijacking: Secured via JWT authentication, ensuring tokens are signed and verified, and using secure HTTP headers to protect session data.
3. Clickjacking: Prevented by setting the X-Frame-Options header to deny using Helmet's Frameguard.
4. NoSQL Injection: Guarded against using express-mongo-sanitize to clean MongoDB queries.
5. Cross-Site Scripting (XSS): Prevented by sanitizing user inputs with DOMPurify and enforcing a strict Content Security Policy (CSP).
6. Man-in-the-Middle (MitM) Attacks: Protected by enforcing HTTPS and setting HSTS headers to ensure all communications are encrypted.
7. DDoS Attacks: Mitigated through global and route-specific rate limiting to control excessive traffic.

Technologies Used
• Backend: Node.js, Express.js
• Database: MongoDB, Mongoose
• Authentication: JSON Web Tokens (JWT), bcryptjs
• Security Middleware: Helmet, express-rate-limit, express-mongo-sanitize, DOMPurify
• Testing: Jest, Supertest
• Linting: ESLint
• DevSecOps: GitHub Actions for CI/CD pipelines

Prerequisites
Before setting up and running the project, ensure you have the following installed:
• Node.js (v14.x or later)
• npm (v6.x or later) or Yarn
• MongoDB Atlas Account: For hosting the MongoDB database.
• SSL Certificates: certificate.pem, privatekey.pem for HTTPS.
• Git: For version control.

Installation

1. Clone the Repository
   bash
   Copy code
   git clone + this repos URL

or clone the repository straight into VS code if you have the text editor installed

3. Navigate to the Project Directory
   bash
   Copy code
   cd internal-international-payment-system

4. Install Dependencies
   Using npm:
   bash
   Copy code
   npm install
   Or using Yarn:
   bash
   Copy code
   yarn install

5. Set Up Environment Variables
   Create a .env file in the root directory and add the following variables:
   env
   Copy code

# Production Environment Variables

ATLAS_URI="your_mongodb_atlas_connection_string"
JWT_SECRET="YourJWTSecretKey"
PORT=80
HTTPS_PORT=443
Create a .env.test file for testing purposes:
env
Copy code

# Test Environment Variables

ATLAS_URI_TEST="your_mongodb_atlas_test_connection_string"
JWT_SECRET_TEST="YourJWTTestSecretKey"
PORT_TEST=81
HTTPS_PORT_TEST=3001
Note: Replace your_mongodb_atlas_connection_string and your_mongodb_atlas_test_connection_string with your
actual MongoDB Atlas connection strings. Ensure that .env and .env.test are added to
.gitignore to prevent sensitive information from being committed to version control.

5. Place SSL Certificates
   Ensure that your SSL certificates (certificate.pem, privatekey.pem) are placed inside the Keys folder at the root of the project.
   Running the Application
   Development Mode

Start the server with hot-reloading using Nodemon:
bash
Copy code
npm run dev
Production Mode

Start the server normally:
bash
Copy code
npm start
The server will run on the ports specified in your .env file (PORT for HTTP and HTTPS_PORT for HTTPS).
Testing
The project uses Jest and Supertest for testing.

Run Tests
bash
Copy code
npm test
This command sets the NODE_ENV to test, runs all test suites, and ensures that tests are executed in an isolated environment using the .env.test configuration.
Linting
ESLint is configured to maintain code quality and consistency.

Run Linting
bash
Copy code
npm run lint
This command checks the codebase for any linting errors based on the rules defined in eslint.config.js.

Usage
Once the server is running, you can interact with the API using tools like Postman or cURL. Below are some example endpoints:

1. User Registration
   • Endpoint: POST /api/users/register
   • Description: Registers a new user.
   • Body Parameters:
   o fullName (String) - User's full name.
   o idNumber (String) - User's identification number.
   o accountNumber (String) - Unique 10-digit account number.
   o password (String) - Secure password.

2. User Login
   • Endpoint: POST /api/auth/login
   • Description: Authenticates a user and returns a JWT token.
   • Body Parameters:
   o fullName (String) - User's full name.
   o accountNumber (String) - User's account number.
   o password (String) - User's password.

3. Make a Payment
   • Endpoint: POST /api/payments/make
   • Description: Allows authenticated users to make a payment.
   • Headers:
   o Authorization: Bearer <JWT_TOKEN>

4. Body Parameters:
   o payerAccountNumber (String) - Must match the logged-in user's account number.
   o amount (Number) - Payment amount (up to 2 decimal places).
   o currency (String) - 3-letter currency code (e.g., USD, EUR).
   o provider (String) - Payment provider.
   o payeeAccountNumber (String) - Recipient's 10-digit account number.
   o payeeAccountOwner (String) - Recipient's full name.
   o swiftCode (String) - SWIFT code for international transfers.

5. Get Payment History
   • Endpoint: GET /api/payments/history
   • Description: Retrieves the authenticated user's payment history.
   • Headers:
   o Authorization: Bearer <JWT_TOKEN>

6. Get User Details
   • Endpoint: GET /api/users/me
   • Description: Retrieves details of the authenticated user.
   • Headers:
   o Authorization: Bearer <JWT_TOKEN>

7. Employee Pre-Registration
   • Description: Registers a new employee.
   • Body Parameters:
   o fullName (String) - User's full name.
   o password (String) - Secure password.

8. Employee Login
   • Endpoint: POST /api/auth/employee-login
   • Description: Authenticates an employee and returns a JWT token.
   • Body Parameters:
   o username (String) - employee's username.
   o password (String) - employee's password.

9. Employee view all transactions
   • Endpoint: PUT /api/employee/payments
   • Description: allows an employee to view all payments made by the bank's users using a JWT.
10. Employee verify a transaction
    • Endpoint: PUT /api/employee/payments/6704123773d69676d9b6d314/verify
    • Description: allows an employee to verfiy a payment between two users.

11. Employee view all verified transactions
    • Endpoint: GET /api/employee/verified-payments
    • Description: allows an employee to view all the verified payments.

Resources Needed
To effectively use and maintain the Internal International Payment System, the following resources are required:

1. MongoDB Atlas Account:
   o For hosting and managing the MongoDB database.
   o Ensure proper security settings and access controls are configured.
2. SSL Certificates:
   o certificate.pem and privatekey.pem files are necessary to enable HTTPS.
   o Obtain certificates from a trusted Certificate Authority (CA).
3. Node.js Environment:
   o Ensure Node.js (v14.x or later) is installed on the server or development machine.
4. GitHub Repository Access:
   o For version control and collaboration.
   o Ensure proper permissions are set for contributors.
5. Development Tools:
   o Postman or cURL: For testing API endpoints.
   o Code Editor: Such as Visual Studio Code for development and debugging.
   o Terminal/Command Prompt: For running scripts and managing the application.
6. Environment Configuration:
   o .env and .env.test files with appropriate configurations for different environments (development, testing, production).
7. DevSecOps Pipeline:
   o GitHub Actions: For continuous integration and deployment.
   o ESLint: To maintain code quality.
   o Jest: For running automated tests.
   Security Considerations
   • Environment Variables: Keep sensitive information like database URIs and JWT secrets out of the codebase. Use environment variables and ensure .env files are excluded from version control.
   • Password Security: Passwords are hashed and salted using bcryptjs before storage to prevent plaintext password exposure.
   • Token Security: JWT tokens are securely signed and have an expiration time to minimize the risk of token theft.
   • Data Validation: All incoming data is validated and sanitized to prevent injection attacks and ensure data integrity.
   • Secure Headers: Implemented using Helmet to protect against common web vulnerabilities.
   License
   This project is licensed under the MIT License.
