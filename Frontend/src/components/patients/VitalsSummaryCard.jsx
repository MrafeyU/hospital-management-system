import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import CountUp from "react-countup";
import "../../styles/patients/VitalsSummaryCard.css";

const VitalsSummaryCard = () => {
  const [vitals, setVitals] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      axios.get(`http://localhost:5001/patient/vitals/${uid}`)
        .then(res => setVitals(res.data))
        .catch(err => console.error("❌ Error fetching vitals", err));
    }
  }, []);

  const latest = vitals[0] || {};

  return (
    <div className="dashboard-card">
      <h3>Latest Vital Signs</h3>
      <div className="vitals-grid">
        <div className="vital-card">
          <p>Heart Rate</p>
          <h2><CountUp end={latest.heart_rate || 0} duration={2} /> bpm</h2>
        </div>
        <div className="vital-card">
          <p>Blood Pressure</p>
          <h2>{latest.blood_pressure || "N/A"}</h2>
        </div>
        <div className="vital-card">
          <p>Temperature</p>
          <h2><CountUp end={latest.temperature || 0} duration={2} /> °C</h2>
        </div>
        <div className="vital-card">
          <p>Oxygen Saturation</p>
          <h2><CountUp end={latest.oxygen_saturation || 0} duration={2} /> %</h2>
        </div>
      </div>
    </div>
  );
};

export default VitalsSummaryCard;
