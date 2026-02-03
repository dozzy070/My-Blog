// import { pool } from "../Config/db.js";

// /* CREATE POST */
// export const CreatePost = async (req, res) => {
//   try {
//     console.log("Body:", req.body);   // log incoming title/content
//     console.log("File:", req.file);   // log incoming image

//     const { title, content } = req.body;
//     if (!title || !content) {
//       return res.status(400).json({ message: "Title and content required" });
//     }

//     const image = req.file ? req.file.filename : null;

//     const result = await pool.query(
//       `INSERT INTO posts (title, content, image, status)
//        VALUES ($1, $2, $3, $4)
//        RETURNING *`,
//       [title, content, image, "published"]
//     );

//     res.status(201).json({ post: result.rows[0] });
//   } catch (error) {
//     console.error("Create post error full:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// /* GET ALL POSTS */
// export const getAllPosts = async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
//     res.json({ posts: result.rows });
//   } catch (error) {
//     console.error("Get posts error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// /* UPDATE POST */
// export const updatePost = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, content } = req.body;
//     const image = req.file ? req.file.filename : null;

//     // Check if post exists
//     const existingPost = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
//     if (existingPost.rows.length === 0) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     // Build dynamic query
//     const updates = [];
//     const values = [];
//     let paramIndex = 1;

//     if (title !== undefined) {
//       updates.push(`title = $${paramIndex++}`);
//       values.push(title);
//     }
//     if (content !== undefined) {
//       updates.push(`content = $${paramIndex++}`);
//       values.push(content);
//     }
//     if (image !== null) {
//       updates.push(`image = $${paramIndex++}`);
//       values.push(image);
//     }
//     updates.push(`updated_at = NOW()`);

//     values.push(id); // for WHERE

//     const result = await pool.query(
//       `UPDATE posts 
//        SET ${updates.join(', ')}
//        WHERE id = $${paramIndex}
//        RETURNING *`,
//       values
//     );

//     res.json({ post: result.rows[0] });
//   } catch (error) {
//     console.error("Update post error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// /* DELETE POST */
// export const deletePost = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const existingPost = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
//     if (existingPost.rows.length === 0) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     await pool.query("DELETE FROM posts WHERE id = $1", [id]);

//     res.json({ message: "Post deleted successfully" });
//   } catch (error) {
//     console.error("Delete post error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };


import { pool } from "../Config/db.js";

/* CREATE POST */
export const CreatePost = async (req, res) => {
  try {
    console.log("Body:", req.body);   // log incoming title/content
    console.log("File:", req.file);   // log incoming image

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    const image = req.file ? req.file.filename : null;

    const result = await pool.query(
      `INSERT INTO posts (title, content, image, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, content, image, "published"]
    );

    res.status(201).json({ post: result.rows[0] });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL POSTS */
export const getAllPosts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
    res.json({ posts: result.rows });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE POST (text & image) */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    // Check if post exists
    const existingPost = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (existingPost.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Build dynamic query to update only the provided fields
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (content !== undefined) {
      updates.push(`content = $${paramIndex++}`);
      values.push(content);
    }
    if (image !== null) {
      updates.push(`image = $${paramIndex++}`);
      values.push(image);
    }
    updates.push(`updated_at = NOW()`);

    values.push(id); // For WHERE clause

    const result = await pool.query(
      `UPDATE posts 
       SET ${updates.join(", ")}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    res.json({ post: result.rows[0] });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* DELETE POST */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const existingPost = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (existingPost.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    await pool.query("DELETE FROM posts WHERE id = $1", [id]);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: error.message });
  }
};
