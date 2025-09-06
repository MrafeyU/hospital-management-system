import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase"; // Ensure Firebase is initialized
import { useNavigate } from "react-router-dom"; // For redirection

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔴 Force Logout on App Start
  useEffect(() => {
    const forceLogout = async () => {
      await signOut(auth);
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      navigate("/"); // Redirect to login page
    };
    forceLogout();
  }, []); // Runs once when app starts
  // ✅ Login Function
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const response = await fetch("http://localhost:5001/getUserRole", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: firebaseUser.uid }),
          });

          if (!response.ok) throw new Error("Failed to fetch user role");

          const data = await response.json();
          if (!data.role) throw new Error("Role not found");

          setUserRole(data.role);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth error:", error);
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Logout Function
  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      navigate("/"); // Redirect to login
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ✅ Show Loading Screen While Checking Authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
