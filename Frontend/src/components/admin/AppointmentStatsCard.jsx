import React, { useEffect, useState } from "react";
import "../../styles/admin/DashboardCard.css";

const AppointmentStatsCard = () => {
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/admin/appointment-stats");
        if (!response.ok) throw new Error("Failed to fetch appointment stats");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="dashboard-card">Loading appointment stats...</div>;
  if (error) return <div className="dashboard-card error">Error: {error}</div>;

  return (
    <div className="dashboard-card appointment-card">
      <h3>Appointment Summary</h3>
      <div className="appointment-stats">
        <div className="appointment-box total">Total: {stats.total}</div>
        <div className="appointment-box upcoming">Upcoming: {stats.upcoming}</div>
        <div className="appointment-box completed">Completed: {stats.completed}</div>
        <div className="appointment-box cancelled">Cancelled: {stats.cancelled}</div>
      </div>
    </div>
  );
};

export default AppointmentStatsCard;
