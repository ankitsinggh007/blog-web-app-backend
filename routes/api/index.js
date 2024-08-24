const user = require("./user");
const post = require("./post");
const express = require("express");

const router = express.Router();

router.use("/users", user);

router.use("/posts", post);
module.exports = router;
