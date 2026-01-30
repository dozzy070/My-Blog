import { NavLink } from "react-router-dom";

export default function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <h2 className="logo">Admin</h2>
      <nav>
        <NavLink to="/admin/dashboard">🏠 Dashboard</NavLink>
        <NavLink to="/admin/posts">📄 All Posts</NavLink>
        <NavLink to="/admin/create">✍️ Create Post</NavLink>
      </nav>
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}
