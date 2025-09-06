import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import "../../styles/doctor/doctorAppointments.css";

const DoctorAppointments = () => {
  const [doctor, setDoctor] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [lastDeletedAppointment, setLastDeletedAppointment] = useState(null);

  const auth = getAuth();

  // ✅ Fetch Doctor Info
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        fetch(`http://localhost:5001/doctor/${user.uid}`)
          .then((res) => res.json())
          .then((data) => {
            const doctorData = Array.isArray(data) ? data[0] : data;
            setDoctor(doctorData);
          })
          .catch((error) => console.error("Error fetching doctor:", error));
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch Doctor's Appointments
  useEffect(() => {
    if (doctor.doctor_id) {
      fetch(`http://localhost:5001/doctor/appointments/${doctor.doctor_id}`)
        .then((res) => res.json())
        .then((data) => setAppointments(data))
        .catch((error) => console.error("Error fetching appointments:", error));
    }
  }, [doctor.doctor_id]);

  // ✅ Cancel Appointment
  const handleCancel = async (appointmentId) => {
    try {
      const appointmentToDelete = appointments.find(a => a.appointment_id === appointmentId);
      if (!appointmentToDelete) return alert("Appointment not found!");

      const response = await fetch(`http://localhost:5001/doctor/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      setLastDeletedAppointment(appointmentToDelete);
      setAppointments(appointments.filter(a => a.appointment_id !== appointmentId));
      alert("✅ Appointment Cancelled Successfully!");
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("❌ Error cancelling appointment");
    }
  };

  // ✅ Undo Last Cancellation
const handleUndo = async () => {
    if (!lastDeletedAppointment) {
      alert("❌ No appointment to undo.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/doctor/appointments/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lastDeletedAppointment),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to restore appointment");
      }
  
      setAppointments([...appointments, lastDeletedAppointment]);
      setLastDeletedAppointment(null);
      alert("✅ Appointment Restored!");
    } catch (err) {
      console.error("Error restoring appointment:", err);
      alert(`❌ Error restoring appointment: ${err.message}`);
    }
  };
  

  return (
    <div className="appointments-table-container">
      <h2>Appointments Management</h2>

      {lastDeletedAppointment && (
        <button className="undo-button" onClick={handleUndo}>
          Undo Last Cancel
        </button>
      )}

      {appointments.length > 0 ? (
        <table className="appointments-table">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Fee</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.appointment_id}>
                {/* <td>{a.appointment_id}</td> */}
                <td>{a.patient_name}</td>
                <td>{new Date(a.date).toLocaleDateString()}</td>
                <td>{a.time}</td>
                <td>{a.consultant_fee}</td>
                <td>
                  <button className="cancel-button" onClick={() => handleCancel(a.appointment_id)}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
};

export default DoctorAppointments;
