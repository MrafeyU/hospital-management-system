import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import "../../styles/doctor/DoctorVitals.css"; // Separate CSS

const getVitalBadge = (type, value) => {
  switch (type) {
    case "oxygen_saturation":
      if (value >= 95) return "🟢";
      if (value >= 92) return "🟡";
      return "🔴";

    case "heart_rate":
      if (value >= 60 && value <= 100) return "🟢";
      if (value > 100 && value <= 120) return "🟡";
      return "🔴";

    case "temperature":
      if (value >= 36.5 && value <= 37.5) return "🟢";
      if (value > 37.5 && value <= 38.5) return "🟡";
      return "🔴";

    case "respiratory_rate":
      if (value >= 12 && value <= 20) return "🟢";
      if (value > 20 && value <= 24) return "🟡";
      return "🔴";

    default:
      return "";
  }
};

const DoctorVitals = () => {
  const [vitalsData, setVitalsData] = useState([]);
  const auth = getAuth();
  const doctorUid = auth.currentUser?.uid;

  useEffect(() => {
    if (doctorUid) {
      axios.get(`http://localhost:5001/doctor/${doctorUid}`)
        .then((res) => {
          const doctorId = res.data.doctor_id;
          if (doctorId) {
            axios.get(`http://localhost:5001/doctor/doctor-vitals/${doctorId}`)
              .then((vitalRes) => setVitalsData(vitalRes.data))
              .catch((err) => console.error("❌ Error fetching vitals", err));
          }
        })
        .catch((err) => console.error("❌ Error fetching doctor info", err));
    }
  }, [doctorUid]);

  // Group vitals by patient name
  const groupedVitals = vitalsData.reduce((acc, vital) => {
    acc[vital.patient_name] = acc[vital.patient_name] || [];
    acc[vital.patient_name].push(vital);
    return acc;
  }, {});

  return (
    <div className="dashboard-card">
      <h3>Patient Vital Monitoring</h3>

      {Object.keys(groupedVitals).length === 0 ? (
        <p>No vitals data available yet.</p>
      ) : (
        Object.entries(groupedVitals).map(([patientName, vitals], index) => (
          <div key={index} className="patient-vital-card">
            <h4>Patient : {patientName}</h4>
            <table className="vitals-table">
              <thead>
                <tr>
                  <th>Heart Rate</th>
                  <th>Blood Pressure</th>
                  <th>Temperature</th>
                  <th>Oxygen Saturation</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {vitals.slice(0, 1).map((vital, idx) => (
                  <tr key={idx}>
                    <td>{vital.heart_rate} bpm {getVitalBadge("heart_rate", vital.heart_rate)}</td>
                    <td>{vital.blood_pressure}</td>
                    <td>{vital.temperature}°C {getVitalBadge("temperature", vital.temperature)}</td>
                    <td>{vital.oxygen_saturation}% {getVitalBadge("oxygen_saturation", vital.oxygen_saturation)}</td>
                    <td>{new Date(vital.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default DoctorVitals;
