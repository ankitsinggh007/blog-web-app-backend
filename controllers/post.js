// server/controllers/postController.js

const Post = require("../models/Post");

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;

    const newPost = new Post({
      title,
      content,
      author: req.user._id,
    });

    await newPost.save();

    return res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Fetch all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username email");
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Fetch a post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username email"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllMyposts = async (req, res) => {
  try {
    const userId = req.user._id;

    const posts = await Post.find({ author: userId }).populate(
      "author",
      "username email"
    );

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    // Delete the post
    await Post.deleteOne(post);

    return res
      .status(200)
      .json({ message: "Post deleted successfully", id: postId });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    let post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is authorized to update the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    post.title = title;
    post.content = content;
    post.updatedAt = Date.now();

    await post.save();
    post = await Post.findById(id).populate("author", "username email");

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost,
  getAllMyposts,
};
