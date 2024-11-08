const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const createDOMPurify = require("dompurify");

// Initialize DOMPurify for Node.js
//
const window = (new JSDOM("")).window;
const DOMPurify = createDOMPurify(window);

// Rate limiting middleware to prevent DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const applySecurityMiddleware = (app) => {
  // Apply rate limiter
  app.use(limiter);

  // Secure HTTP headers with Helmet
  app.use(helmet());

  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        "script-src": ["'self'"],
        "default-src": ["'self'"],
      },
    })
  );
  
   //Add HSTS (HTTP Strict Transport Security)
   app.use(helmet.hsts({
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true, // Apply to subdomains as well
    preload: true, // Preload in browsers supporting it
  }));
  
  app.use(helmet.frameguard({ action: "deny" }));

  // Sanitize MongoDB queries
  app.use(mongoSanitize());

  // Sanitize incoming request body fields
  app.use((req, res, next) => {
    if (req.body) {
      // Iterate over each key in the body to sanitize it
      Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] === "string") {
          req.body[key] = DOMPurify.sanitize(req.body[key]);
        }
      });
    }
    next();
  });
};

// You can use this to sanitize input outside of middleware as well
const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input);
};

// Export both the middleware and sanitizeInput
module.exports = { applySecurityMiddleware, sanitizeInput };
