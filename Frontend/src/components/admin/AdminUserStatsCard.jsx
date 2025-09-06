import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/DashboardCard.css";

const AdminUserStatsCard = () => {
  const [stats, setStats] = useState({ admin: 0, doctor: 0, patient: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/admin/user-stats");
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
        setError("Error fetching stats");
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (loading) return <div className="dashboard-card">Loading...</div>;
  if (error) return <div className="dashboard-card error">{error}</div>;

  return (
    <div className="dashboard-card user-card">
      <h3>Total Users</h3>
      <div className="user-stats">
        <div className="user-box admin">Admins: {stats.admin}</div>
        <div className="user-box doctor">Doctors: {stats.doctor}</div>
        <div className="user-box patient">Patients: {stats.patient}</div>
      </div>
    </div>
  );
};

export default AdminUserStatsCard;