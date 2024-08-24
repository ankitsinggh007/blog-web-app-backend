const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  let token;

  try {
    // Check for token in headers first
    token = req?.headers?.authorization?.split(" ")[1];
  } catch (error) {
    // Handle potential errors parsing authorization header
    return res
      .status(400)
      .json({ message: "Invalid authorization header format" });
  }

  // If no token in headers, check for token in cookies
  if (!token) {
    token = req?.headers?.cookie?.split("=")[1];
  }

  if (token == null) {
    // No token found - Unauthorized access
    return res.status(401).json({ message: "Authorization required" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.Server_Secret);

    // Find the user associated with the token
    const user = await User.findById(decoded.id, "-password");
    if (!user) {
      // Invalid token (user not found) - Forbidden access
      return res.status(403).json({ message: "user not found" });
    }

    // Attach user to request object and proceed
    req.user = user;
    next();
  } catch (error) {
    // Handle potential errors during verification or user lookup
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    } else {
      return res.status(500).json({ message: "Internal server error" }); // Generic error for unexpected situations
    }
  }
};

module.exports = authMiddleware;
