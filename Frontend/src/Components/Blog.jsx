import React, { useState, useEffect } from "react";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="blog">
      <h1>Blog Posts</h1>
      
      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {posts.length === 0 && !loading && <p>No published posts yet.</p>}
      
      <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
        {posts.map((post) => (
          <div key={post.id} style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            {post.image && (
              <img 
                src={`http://localhost:5000/uploads/${post.image}`} 
                alt={post.title}
                style={{ 
                  maxWidth: "100%", 
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "15px" 
                }}
              />
            )}
            <h3 style={{ marginTop: "10px" }}>{post.title}</h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>{post.content}</p>
            <small style={{ color: "#999" }}>
              Published: {new Date(post.created_at).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
