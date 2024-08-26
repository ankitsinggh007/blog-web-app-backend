const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Registration
const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const newUser = new User({
      name,
      username,
      email,
      password, // Password will be hashed by a pre-save hook
    });

    await newUser.save(); // Save user to the database
    
    // generate JWT token upon successful registration

    const token = newUser.genToken();

    const option = {
      expires: new Date(
        Date.now() + process.env.Expire_Cokies * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };

    const user = await User.findOne({ email }, "-password");
    res
      .status(201)
      .cookie("token", token, option)
      .json({ user, message: "User registered successfully" });
  } catch (error) {
    // Handle MongoDB duplicate key error (E11000)
    if (error.code === 11000) {
      // Extract the duplicate field from the error message
      const duplicateField = Object.keys(error.keyPattern)[0]; // Get the field that caused the error

      // Return a generic error message based on the duplicate field
      return res
        .status(400)
        .json({ message: `${duplicateField} is already in use` });
    }

    // Generic error handler for other cases
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  let user = await User.findOne({ email });

  try {
    if (!user) {
      return res.status(400).json({ message: "email is not exist" });
    }

    // Compare password
    const isMatch = await user.compare(password);

    if (!isMatch) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    // Create JWT token
    const token = user.genToken();

    const option = {
      expires: new Date(
        Date.now() + process.env.Expire_Cokies * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };
    user = await User.findOne({ email }, "-password");
    res.status(200).cookie("token", token, option).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    // user.status = "active";
    // await user.save();
  }
};

const logout = async (req, res) => {
  try {
    // Find the user by the ID stored in the request object by the middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set the user's status to offline
    user.status = "inactive"; // status to indiacte user online/offline
    await user.save();

    // Clear the authentication token from cookies
    const option = {
      expires: new Date(Date.now()),
      httpOnly: true,
    };

    return res.status(200).cookie("token", null, option).json({
      success: true,
      message: "User successfully logged out",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loaduser = async (req, res) => {
  try {
    // req.user already contains the user object set by authMiddleware, no need to fetch it again
    const user = req.user;
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  loaduser,
};
