import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";

import BlogNavbar from "./Components/Navbar";
import Footer from "./Components/Footer";

/* Public Pages */
import Home from "./Components/Home";
import About from "./Components/About";
import Blog from "./Components/Blog";

/* Admin Pages */
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import AdminPosts from "./admin/AdminPosts";
import CreatePost from "./admin/CreatePost";
import Login from "./admin/Login";
import Register from "./admin/Register";

/* 🔒 Admin Route Protection */
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/admin/login" replace />;
};

/* Wrapper to control Navbar/Footer visibility */
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="d-flex flex-column min-vh-100">
      {!isAdminRoute && <BlogNavbar />}

      <Container fluid className="flex-fill p-0">
        {children}
      </Container>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <LayoutWrapper>
      <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />

          {/* ===== ADMIN AUTH ===== */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />

          {/* ===== ADMIN PROTECTED ROUTES ===== */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="create" element={<CreatePost />} />
          </Route>

          {/* ===== 404 ===== */}
          <Route path="*" element={<h1 className="text-center mt-5">404 - Page Not Found</h1>} />
        </Routes>
      </LayoutWrapper>
  );
}

export default App;
