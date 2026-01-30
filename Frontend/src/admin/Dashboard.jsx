import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    fetch("http://localhost:5000/api/posts")
      .then(res => res.json())
      .then(data => setPosts(data.posts || []));
  }, []);

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, {admin?.name || "Admin"} 👋</h1>
          <p>Manage your posts and monitor activity here</p>
        </div>
        <div className="header-actions">
          <button className="btn-create-post" onClick={() => navigate("/admin/create")}>
            ✍️ Create New Post
          </button>
          <button className="btn-view-posts" onClick={() => navigate("/admin/posts")}>
            📄 All Posts
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Posts</h3>
          <p>{posts.length}</p>
        </div>
        <div className="stat-card">
          <h3>Published</h3>
          <p>{posts.filter(p => p.status === "published").length}</p>
        </div>
        <div className="stat-card">
          <h3>Drafts</h3>
          <p>{posts.filter(p => p.status === "draft").length}</p>
        </div>
      </section>

      {/* Recent Posts Grid */}
      <section className="dashboard-posts">
        <h2>Recent Posts</h2>
        <div className="posts-grid">
          {posts.slice(0, 8).map(post => (
            <div key={post.id} className="post-card">
              {post.image ? (
                <img src={`http://localhost:5000/uploads/${post.image}`} alt={post.title} className="post-img" />
              ) : (
                <div className="post-img placeholder">No Image</div>
              )}
              <div className="post-content">
                <h4>{post.title}</h4>
                <p>{post.content?.slice(0, 100)}...</p>
                <span className={`status-badge ${post.status}`}>{post.status}</span>
                <button onClick={() => navigate(`/admin/posts`)} className="btn-edit-post">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
