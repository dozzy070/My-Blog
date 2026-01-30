import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./admin.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout">
      <Sidebar onLogout={logout} />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
