import React, { useState } from "react";
import axios from "axios";
import "../../styles/admin/Users.css";

const RegisterUserForm = ({ onUserRegistered }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "doctor",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/register", formData);
      setSuccess("User registered successfully.");
      onUserRegistered(); // Refresh list
      setFormData({ name: "", email: "", role: "doctor", password: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="user-form">
      <h2>Register New User</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
          <option value="admin">Admin</option>
        </select>
        <input type="password" name="password" placeholder="Temporary Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default RegisterUserForm;
