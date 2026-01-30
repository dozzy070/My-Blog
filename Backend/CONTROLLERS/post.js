import { pool } from "../Config/db.js";

// GET ALL POSTS
export const getAllPosts = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
        res.status(200).json({ posts: result.rows });
    } catch (error) {
        console.error("Fetch posts error:", error);
        res.status(500).json({ message: "Failed to fetch posts" });
    }
};

// CREATE POST
export const Createpost = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const image = req.file ? req.file.filename : null;
      

        const query = `
            INSERT INTO posts (title, content, image)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const values = [title, content, image];
        const result = await pool.query(query, values);

        res.status(201).json({ message: 'Post created successfully', post: result.rows[0] });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ message: 'Error creating post' });
    }
};

// UPDATE POST
export const updatePost = async (req, res) => {
    console.log("Update.body:", req.body);
    const { id } = req.params;
    const { title, content, status } = req.body;

    if (!title && !content && !status && !req.file) {
        return res.status(400).json({ message: "At least one of title, content, status, or image must be provided" });
    }

    try {
        // Build dynamic SET clause for provided fields
        const fields = [];
        const values = [];
        let idx = 1;

        if (title !== undefined) {
            fields.push(`title = $${idx++}`);
            values.push(title);
        }
        if (content !== undefined) {
            fields.push(`content = $${idx++}`);
            values.push(content);
        }
        if (status !== undefined) {
            fields.push(`status = $${idx++}`);
            values.push(status);
        }
        if (req.file) {
            fields.push(`image = $${idx++}`);
            values.push(req.file.filename);
        }

        values.push(id); // last param

        const query = `UPDATE posts SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *;`;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post updated successfully", post: result.rows[0] });
    } catch (error) {
        console.error("Update post error:", error);
        res.status(500).json({ message: "Error updating post" });
    }
};

// DELETE POST
export const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM posts WHERE id = $1 RETURNING *;",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Delete post error:", error);
        res.status(500).json({ message: "Error deleting post" });
    }
};
