import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./ROUTES/auth.js";
import postRoutes from "./ROUTES/post.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors(
    {origin: 'https://my-blog-rho-orpin.vercel.app' , credentials: true}

));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("Uploads"));

// Routes
app.use("/api/admin", authRoutes);  // admin auth routes
app.use("/api/posts", postRoutes);  // posts routes

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
