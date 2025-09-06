import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../api/firebase";
import { useAuth } from "../api/authContext";  // Auth context to update login state
import { useNavigate } from "react-router-dom"; // Navigation hook
import "../styles/Login.css"; // Import CSS file
import Logo from "../logo/hmslogo.png"; // Import HMS logo

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setIsAuthenticated } = useAuth();  // Function to update auth state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      // Authenticate user with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (!user || !user.uid) {
        throw new Error("User authentication failed.");
      }

      // Fetch user role from backend
      const response = await fetch("http://localhost:5001/getUserRole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user role");
      }

      const data = await response.json();

      if (!data.role) {
        throw new Error("User role not found.");
      }

      // ✅ Redirect based on role
      setIsAuthenticated(true);
      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (data.role === "patient") {
        navigate("/patient-dashboard");
      } else {
        throw new Error("Invalid role.");
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
  <div className="shape one"></div>
  <div className="shape two"></div>

  <div className="login-box">
    <div className="welcome-section">
       <h1>HospiSyncAi</h1>
      <p>
        Streamlining patient care and hospital operations with AI-powered insights.
        Your health, our priority.
      </p>
    </div>

    <form onSubmit={handleLogin}>
      <img src={Logo} alt="HMS Logo" className="hms-logo" />
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {error && <p className="error">{error}</p>}
    </form>
  </div>
</div>
  );
  
};

export default Login;
