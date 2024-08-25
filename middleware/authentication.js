const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  console.log(req.cookies?.token, "token from cookies");
  console.log(
    req.headers?.authorization.split(" ")[1],
    "token from authorization"
  );
  try {
    const token =
      req.cookies?.token || req.headers?.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization required" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.Server_Secret);

    // Find the user associated with the token
    const user = await User.findById(decoded.id, "-password");
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    // Attach user to request object and proceed
    req.user = user;
    next();
  } catch (error) {
    // Handle potential errors during verification
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = authMiddleware;
