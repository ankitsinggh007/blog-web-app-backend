const express = require("express");
const { register, login, logout ,loaduser} = require("../../controllers/user");
const authMiddleware = require("../../middleware/authentication");
const router = express.Router();

// User routes
// Registration route
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, loaduser);

module.exports = router;
