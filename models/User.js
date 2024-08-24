// server/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  profilePicture: {
    type: String,
    default: "",
  },
});

// store password
userSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.compare = async function (password) {
  try {
    const isCorrect = await bcrypt.compare(password, this.password);
    return isCorrect;
  } catch (error) {
    throw error;
  }
};
userSchema.methods.genToken = function () {
  return JWT.sign({ id: this._id }, process.env.Server_Secret, {
    expiresIn: process.env.Expire_Token,
  });
};

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
