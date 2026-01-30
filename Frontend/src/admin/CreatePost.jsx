import { useState } from "react";
import "./CreatePost.css";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const submit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    const res = await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      setImage(null);
      setPreview(null);
      alert("Post created successfully!");
    } else {
      alert("Failed to create post");
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create New Post</h1>
      <div className="form-group">
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" />
      </div>
      <div className="form-group">
        <label>Content</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your post here..." />
      </div>
      <div className="form-group">
        <label>Image</label>
        <input type="file" accept="image/*" onChange={handleImage} />
        {preview && <img src={preview} alt="preview" className="image-preview" />}
      </div>
      <button onClick={submit} className="btn-submit">Publish Post</button>
    </div>
  );
}
