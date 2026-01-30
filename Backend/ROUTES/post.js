import express from "express";
import { uploads } from "../Middleware/uploads.js";
import { getAllPosts, updatePost, deletePost, Createpost } from "../CONTROLLERS/post.js";
import { protect } from "../Middleware/protect.js";

const router = express.Router();

// GET posts (public - for home page)
router.get("/", getAllPosts);

// CREATE post (admin only)
router.post("/", protect, uploads.single("image"), Createpost);

// UPDATE post (admin only)
router.put("/update/:id", protect, uploads.single("image"), updatePost);

// DELETE post (admin only)
router.delete("/:id", protect, deletePost);

export default router;
