import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import "../../styles/doctor/DoctorInfoCard.css"; // Import the new CSS

const DoctorInfoCard = () => {
  const [doctor, setDoctor] = useState({});
  const [appointments, setAppointments] = useState([]);

  const auth = getAuth();
  const doctorUid = auth.currentUser?.uid;

  useEffect(() => {
    if (doctorUid) {
      axios.get(`http://localhost:5001/doctor/${doctorUid}`)
        .then(res => {
          setDoctor(res.data || {});
        })
        .catch(err => console.error("❌ Error fetching doctor data", err));
    }
  }, [doctorUid]);

  useEffect(() => {
    if (doctor.doctor_id) {
      axios.get(`http://localhost:5001/doctor/appointments/${doctor.doctor_id}`)
        .then(res => {
          setAppointments(res.data || []);
        })
        .catch(err => console.error("❌ Error fetching appointments", err));
    }
  }, [doctor.doctor_id]);

  // Correct Today's Appointment Logic
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];

  const todayAppointments = appointments.filter(appointment => {
    if (!appointment.date) return false; // safety check
    const appointmentDate = new Date(appointment.date);
    const appointmentFormatted = appointmentDate.toISOString().split('T')[0];
    return appointmentFormatted === todayFormatted;
  });

  return (
    <div className="doctor-info-card">
      <h2 className="section-title"> Doctor Information</h2>

      <table className="info-table">
        <tbody>
          <tr><td><strong>Name:</strong></td><td>{doctor.name || 'Loading...'}</td></tr>
          <tr><td><strong>Specialization:</strong></td><td>{doctor.specialization || '-'}</td></tr>
          <tr><td><strong>Phone:</strong></td><td>{doctor.phone_no || '-'}</td></tr>
          <tr><td><strong>Schedule:</strong></td><td>{doctor.schedule || '-'}</td></tr>
        </tbody>
      </table>

      <div className="today-appointments">
        <h2 className="section-title">Today's Appointments</h2>
        <p className="appointment-count">
          {todayAppointments.length} Appointments today
        </p>
      </div>
    </div>
  );
};

export default DoctorInfoCard;
