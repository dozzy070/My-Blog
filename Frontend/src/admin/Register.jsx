import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFocus = () => {
    setErrors({});
    setServerError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError("");
    setSuccess("");

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const res = await axios.post("http://localhost:5000/api/admin/register", payload, {
        headers: { "Content-Type": "application/json" }
      });

      setSuccess(res.data.message || "Registration successful");

      setFormData({ name: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container" onClick={handleFocus}>
      <h2>Admin Registration</h2>
      {serverError && <p className="error-message">{serverError}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} onFocus={handleFocus} disabled={loading} />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} onFocus={handleFocus} disabled={loading} />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} onFocus={handleFocus} disabled={loading} />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onFocus={handleFocus} disabled={loading} />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" disabled={loading} className="register-btn">
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/admin/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
