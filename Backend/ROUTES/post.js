import express from "express";
import { uploads } from "../Middleware/uploads.js";
import { getAllPosts, CreatePost, updatePost, deletePost } from "../CONTROLLERS/post.js";
import { protect } from "../Middleware/protect.js";
import axios from "axios";

const router = express.Router();

// GET all posts
router.get("/", getAllPosts);

// CREATE post (admin only)
router.post("/", protect, uploads.single("image"), CreatePost);

// UPDATE post (admin only) — make sure the route matches React
router.put("/update/:id", protect, uploads.single("image"), updatePost);

// DELETE post (admin only)
router.delete("/:id", protect, deletePost);

export default router;
