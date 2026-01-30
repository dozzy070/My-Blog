import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./ROUTES/auth.js";
import postRoutes from "./ROUTES/post.js";
import './Config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (in correct order)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/admin', router);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
