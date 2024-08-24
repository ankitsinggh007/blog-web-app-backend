const { register, login, logout } = require("./user");

const {
  createPost,
  getAllPosts,
  getAllMyposts,
  getPostById,
  deletePost,
  updatePost,
  loaduser,
} = require("./post");
module.exports = {
  register,
  login,
  logout,
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost,
  loaduser,
  getAllMyposts,
};
