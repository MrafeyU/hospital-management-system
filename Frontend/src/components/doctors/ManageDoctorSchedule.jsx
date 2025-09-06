import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import "../../styles/doctor/ManageSchedule.css";

const ManageDoctorSchedule = () => {
  const [schedule, setSchedule] = useState("");
  const [newSchedule, setNewSchedule] = useState("");
  const auth = getAuth();
  const doctorUid = auth.currentUser?.uid;

  useEffect(() => {
    if (doctorUid) {
      axios.get(`http://localhost:5001/doctor/${doctorUid}`)
        .then(res => {
          const doctorId = res.data.doctor_id;
          if (doctorId) {
            axios.get(`http://localhost:5001/doctor/doctor-schedule/${doctorId}`)
              .then((scheduleRes) => {
                setSchedule(scheduleRes.data.schedule || "No schedule set yet.");
                setNewSchedule(scheduleRes.data.schedule || "");
              })
              .catch((err) => console.error("❌ Error fetching schedule", err));
          }
        })
        .catch((err) => console.error("❌ Error fetching doctor info", err));
    }
  }, [doctorUid]);

  const handleUpdateSchedule = async () => {
    try {
      const doctorIdRes = await axios.get(`http://localhost:5001/doctor/${doctorUid}`);
      const doctorId = doctorIdRes.data.doctor_id;

      await axios.post("http://localhost:5001/doctor/update-schedule", {
        doctor_id: doctorId,
        schedule: newSchedule,
      });

      alert("✅ Schedule updated successfully!");
      setSchedule(newSchedule);
    } catch (error) {
      console.error("❌ Error updating schedule", error);
      alert("❌ Failed to update schedule");
    }
  };

  return (
    <div className="dashboard-card">
      <h3>Manage Your Schedule</h3>

      <div className="schedule-section">
        <h4>Current Schedule:</h4>
        <p>{schedule}</p>

        <h4 style={{ marginTop: "20px" }}> Edit Schedule:</h4>
        <textarea
          value={newSchedule}
          onChange={(e) => setNewSchedule(e.target.value)}
          rows={5}
          placeholder="e.g., Mon-Fri 9AM-5PM | Sat 9AM-1PM"
          className="schedule-textarea"
        ></textarea>

        <button onClick={handleUpdateSchedule} className="update-button">
          Update Schedule
        </button>
      </div>
    </div>
  );
};

export default ManageDoctorSchedule;
