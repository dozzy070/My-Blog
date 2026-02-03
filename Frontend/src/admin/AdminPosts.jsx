// import { useEffect, useState } from "react";
// import "./AdminPosts.css";

// export default function AdminPosts() {
//   const [posts, setPosts] = useState([]);
//   const [editing, setEditing] = useState(null);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [image, setImage] = useState(null);

//   const token = localStorage.getItem("token");

//   // Fetch all posts
//   useEffect(() => {
//     fetch("http://localhost:5000/api/posts")
//       .then(res => res.json())
//       .then(data => setPosts(data.posts || []))
//       .catch(err => console.error("Fetch posts error:", err));
//   }, []);

//   // Start editing a post
//   const startEdit = (post) => {
//     setEditing(post.id);
//     setTitle(post.title);
//     setContent(post.content);
//   };

//   // Save edited title/content
//   const saveEdit = async (id) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/posts/update/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ title, content }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to update post");

//       setPosts(posts.map(p => (p.id === id ? data.post : p)));
//       setEditing(null);
//     } catch (err) {
//       console.error("Save edit error:", err);
//       alert("Failed to save edit: " + err.message);
//     }
//   };

//   // Update post image
//   const updateImage = async (id) => {
//     if (!image) return;

//     const formData = new FormData();
//     formData.append("image", image);

//     try {
//       const res = await fetch(`http://localhost:5000/api/posts/update/${id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to update image");

//       setPosts(posts.map(p => (p.id === id ? data.post : p)));
//       setImage(null);
//     } catch (err) {
//       console.error("Update image error:", err);
//       alert("Failed to update image: " + err.message);
//     }
//   };

//   // Delete post
//   const deletePost = async (id) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error("Failed to delete post");

//       setPosts(posts.filter(p => p.id !== id));
//     } catch (err) {
//       console.error("Delete post error:", err);
//       alert("Failed to delete post: " + err.message);
//     }
//   };

//   return (
//     <div className="all-posts-container">
//       <h1>All Posts</h1>
//       <div className="all-posts-grid">
//         {posts.map(post => (
//           <div key={post.id} className="post-card">
//             {post.image ? (
//               <img src={`http://localhost:5000/uploads/${post.image}`} alt={post.title} />
//             ) : (
//               <div className="no-image">No Image</div>
//             )}

//             {editing === post.id ? (
//               <div className="edit-section">
//                 <input value={title} onChange={e => setTitle(e.target.value)} />
//                 <textarea value={content} onChange={e => setContent(e.target.value)} />
//                 <button onClick={() => saveEdit(post.id)}>Save</button>
//               </div>
//             ) : (
//               <div className="post-info">
//                 <h4>{post.title}</h4>
//                 <p>{post.content?.slice(0, 100)}...</p>
//                 <span className={`status-badge ${post.status}`}>{post.status}</span>
//                 <div className="post-actions">
//                   <button onClick={() => startEdit(post)}>Edit</button>
//                   <input type="file" onChange={e => setImage(e.target.files[0])} />
//                   <button onClick={() => updateImage(post.id)}>Change Image</button>
//                   <button onClick={() => deletePost(post.id)}>Delete</button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPosts.css";

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Fetch posts error:", err);
      alert("Failed to fetch posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Start editing a post
  const startEdit = (post) => {
    setEditing(post.id);
    setTitle(post.title);
    setContent(post.content);
  };

  // Save edited title/content
  const saveEdit = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/update/${id}`,
        { title, content },
        axiosConfig
      );

      setPosts(posts.map((p) => (p.id === id ? res.data.post : p)));
      setEditing(null);
      alert("Post updated successfully!");
    } catch (err) {
      console.error("Save edit error:", err);
      alert("Failed to save edit: " + (err.response?.data?.message || err.message));
    }
  };

  // Update post image
  const updateImage = async (id) => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/update/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        }
      );

      setPosts(posts.map((p) => (p.id === id ? res.data.post : p)));
      setImage(null);
      alert("Image updated successfully!");
    } catch (err) {
      console.error("Update image error:", err);
      alert("Failed to update image: " + (err.response?.data?.message || err.message));
    }
  };

  // Delete post
  const deletePost = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/posts/${id}`, axiosConfig);

      setPosts(posts.filter((p) => p.id !== id));
      alert("Post deleted successfully!");
    } catch (err) {
      console.error("Delete post error:", err);
      alert("Failed to delete post: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="all-posts-container">
      <h1>All Posts</h1>
      <div className="all-posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            {post.image ? (
              <img src={`http://localhost:5000/uploads/${post.image}`} alt={post.title} />
            ) : (
              <div className="no-image">No Image</div>
            )}

            {editing === post.id ? (
              <div className="edit-section">
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                <button onClick={() => saveEdit(post.id)}>Save</button>
              </div>
            ) : (
              <div className="post-info">
                <h4>{post.title}</h4>
                <p>{post.content?.slice(0, 100)}...</p>
                <span className={`status-badge ${post.status}`}>{post.status}</span>
                <div className="post-actions">
                  <button onClick={() => startEdit(post)}>Edit</button>
                  <input type="file" onChange={(e) => setImage(e.target.files[0])} />
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
