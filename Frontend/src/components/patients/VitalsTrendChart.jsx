import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Label } from "recharts";
import "../../styles/patients/VitalsTrendChart.css";

const VitalsTrendChart = () => {
  const [vitals, setVitals] = useState([]);
  const auth = getAuth();
  const patientUid = auth.currentUser?.uid;

  useEffect(() => {
    if (patientUid) {
      axios.post("http://localhost:5001/getPatientId", { uid: patientUid })
        .then(res => {
          const patientId = res.data.patient_id;
          return axios.get(`http://localhost:5001/patient-vitals/${patientId}`);
        })
        .then(res => {
          setVitals(res.data || []);
        })
        .catch(err => {
          console.error("❌ Error fetching vitals", err);
        });
    }
  }, [patientUid]);

  return (
    <div className="dashboard-card">
      <h3>Vitals Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={vitals} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp">
            <Label value="Timestamp" offset={-5} position="insideBottom" style={{ fill: "#399ae0" }} />
          </XAxis>
          <YAxis label={{ value: 'Measurement', angle: -90, position: 'insideLeft', style: { fill: "#399ae0" } }} />
          <Tooltip />
          <Legend verticalAlign="top" height={36}/>
          <Line type="monotone" dataKey="heart_rate" name=" Heart Rate" stroke="rgba(47, 158, 19, 0.7)" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="temperature" name="Temperature" stroke="rgba(57, 170, 224, 0.7)" />
          <Line type="monotone" dataKey="oxygen_saturation" name="O₂ Saturation" stroke="red" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VitalsTrendChart;
