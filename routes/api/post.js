const {
  createPost,
  getAllPosts,
  getAllMyposts,
  getPostById,
  deletePost,
  updatePost,
} = require("../../controllers");
const authMiddleware = require("../../middleware/authentication");
const express = require("express");

const router = express.Router();
router.post("/create", authMiddleware, createPost);
router.get("/all", getAllPosts);
router.get("/my-post", authMiddleware, getAllMyposts);
router.get("/:id", getPostById);
router.delete("/:id", authMiddleware, deletePost);
router.patch("/:id", authMiddleware, updatePost);
module.exports = router;
