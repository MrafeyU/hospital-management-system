// src/pages/admin/AdminAppointments.jsx

import React, { useEffect, useState } from "react";

import axios from "axios";
import "../../styles/admin/AdminAppointments.css"; // New CSS file

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/admin/appointments")
      .then(response => setAppointments(response.data))
      .catch(error => console.error("Error fetching appointments:", error));
  }, []);

  return (
    
          <div className="appointments-container">
            <h2>Appointments List</h2>
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Specialization</th>
                  <th>Fee</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.appointment_id}>
                    <td>{appt.appointment_id}</td>
                    <td>{appt.patient_name}</td>
                    <td>{appt.doctor_name}</td>
                    <td>{appt.date}</td>
                    <td>{appt.time}</td>
                    <td>{appt.specialization}</td>
                    <td>${appt.consultant_fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
  );
};

export default AdminAppointments;
