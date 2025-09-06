import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PatientDashboard from "./pages/patient/PatientDashboard";

import ManageUsers from "./pages/admin/ManageUsers";
import AdminAppointments from "./pages/admin/Appointments";
import Reports from "./pages/admin/Reports";
import Billing from "./pages/admin/Billings";

import Patients from "./pages/doctor/Patients";
import DoctorAppointments from "./pages/doctor/Appointments";
import VitalsMonitoring from "./pages/doctor/VitalsMonitoring";
import Schedule from "./pages/doctor/Schedule";

import BookAppointment from "./pages/patient/BookAppointment";
import Vitals from "./pages/patient/vitals";
import MedicalHistory from "./pages/patient/MedicalHistory";
import Bills from "./pages/patient/Bills";

import { useAuth } from "./api/authContext"; // Get authentication state
import axios from "axios"; // Fetch role and in-house status

const App = () => {
  const { isAuthenticated, user, loading } = useAuth(); // Get user from auth context
  const [role, setRole] = useState(null);
  const [inHouse, setInHouse] = useState(false); // Default: false

  useEffect(() => {
    if (user) {
      axios
        .post("http://localhost:5001/getUserRole", { uid: user.uid }) // Use POST instead of GET
        .then((response) => {
          setRole(response.data.role);
          if (response.data.role === "patient") {
            setInHouse(response.data.in_house); // Only update for patients
          }
        })
        .catch((error) => console.error("Error fetching role:", error));
    } else {
      setRole(null);
      setInHouse(false);
    }
  }, [user]); // Runs when user state changes

  // Prevent redirection before authentication is complete
  if (loading) return <div>Loading...</div>;

  console.log("User Authenticated:", isAuthenticated);
  console.log("User:", user);
  console.log("User Role:", role);
  console.log("Is In-House Patient:", inHouse);

  return (
    <Routes>
      {/* Redirect user based on authentication & role */}
      <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to={role === "doctor" ? "/doctor" : role === "admin" ? "/admin" : role === "patient" && inHouse ? "/patient" : "/"} />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={isAuthenticated && role === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
      <Route path="/admin/users" element={isAuthenticated && role === "admin" ? <ManageUsers /> : <Navigate to="/" />} />
      <Route path="/admin/appointments" element={isAuthenticated && role === "admin" ? <AdminAppointments /> : <Navigate to="/" />} />
      <Route path="/admin/reports" element={isAuthenticated && role === "admin" ? <Reports /> : <Navigate to="/" />} />
      <Route path="/admin/billing" element={isAuthenticated && role === "admin" ? <Billing /> : <Navigate to="/" />} />

      {/* Doctor Routes */}
      <Route path="/doctor" element={isAuthenticated && role === "doctor" ? <DoctorDashboard /> : <Navigate to="/" />} />
      <Route path="/doctor/patients" element={isAuthenticated && role === "doctor" ? <Patients /> : <Navigate to="/" />} />
      <Route path="/doctor/appointments" element={isAuthenticated && role === "doctor" ? <DoctorAppointments /> : <Navigate to="/" />} />
      <Route path="/doctor/vitals" element={isAuthenticated && role === "doctor" ? <VitalsMonitoring /> : <Navigate to="/" />} />
      <Route path="/doctor/schedule" element={isAuthenticated && role === "doctor" ? <Schedule /> : <Navigate to="/" />} />

      {/* Patient Routes */}
      <Route path="/patient" element={isAuthenticated && role === "patient" && inHouse ? <PatientDashboard /> : <Navigate to="/" />} />
      <Route path="/patient/appointments" element={isAuthenticated && role === "patient" && inHouse ? <BookAppointment /> : <Navigate to="/" />} />
      <Route path="/patient/history" element={isAuthenticated && role === "patient" && inHouse ? <MedicalHistory /> : <Navigate to="/" />} />
      <Route path="/patient/bills" element={isAuthenticated && role === "patient" && inHouse ? <Bills /> : <Navigate to="/" />} />
      <Route path="/patient/vitals" element={isAuthenticated && role === "patient" && inHouse ? <Vitals /> : <Navigate to="/" />} />
    </Routes>
  );
};

export default App;
