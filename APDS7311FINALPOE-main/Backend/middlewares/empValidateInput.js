const empValidateInput = (req, res, next) => {
    const { username, password } = req.body;
  
    // Allow only alphanumeric and some special characters for username
    const usernamePattern = /^[a-zA-Z0-9_]{4,30}$/;
    if (!usernamePattern.test(username)) {
      return res.status(400).json({ message: "Invalid username format" });
    }
  
    // Validate password strength
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).json({ message: "Password must be minimum 8 characters, include letters and numbers" });
    }
  
    next();
  };
  
  module.exports = { empValidateInput };
  