import { useEffect, useState } from "react";
import "./AdminPosts.css";

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/posts")
      .then(res => res.json())
      .then(data => setPosts(data.posts || []));
  }, []);

  const startEdit = (post) => {
    setEditing(post.id);
    setTitle(post.title);
    setContent(post.content);
  };

  const saveEdit = async (id) => {
    const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content })
    });
    const data = await res.json();
    setPosts(posts.map(p => (p.id === id ? data.post : p)));
    setEditing(null);
  };

  const updateImage = async (id) => {
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const data = await res.json();
    setPosts(posts.map(p => (p.id === id ? data.post : p)));
    setImage(null);
  };

  const deletePost = async (id) => {
    await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="all-posts-container">
      <h1>All Posts</h1>
      <div className="all-posts-grid">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            {post.image ? (
              <img src={`http://localhost:5000/uploads/${post.image}`} alt={post.title} />
            ) : (
              <div className="no-image">No Image</div>
            )}

            {editing === post.id ? (
              <div className="edit-section">
                <input value={title} onChange={e => setTitle(e.target.value)} />
                <textarea value={content} onChange={e => setContent(e.target.value)} />
                <button onClick={() => saveEdit(post.id)}>Save</button>
              </div>
            ) : (
              <div className="post-info">
                <h4>{post.title}</h4>
                <p>{post.content?.slice(0, 100)}...</p>
                <span className={`status-badge ${post.status}`}>{post.status}</span>
                <div className="post-actions">
                  <button onClick={() => startEdit(post)}>Edit</button>
                  <input type="file" onChange={e => setImage(e.target.files[0])} />
                  <button onClick={() => updateImage(post.id)}>Change Image</button>
                  <button onClick={() => deletePost(post.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
