import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";

const DoctorProfileUpdateCard = () => {
  const [formData, setFormData] = useState({
    phone_no: "",
    schedule: "",
    specialization: ""
  });
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const doctorUid = auth.currentUser?.uid;

  useEffect(() => {
    if (doctorUid) {
      axios.get(`http://localhost:5001/doctor/${doctorUid}`)
        .then((res) => {
          const doctor = res.data || {};
          setFormData({
            phone_no: doctor.phone_no || "",
            schedule: doctor.schedule || "",
            specialization: doctor.specialization || ""
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Error fetching doctor info", err);
          setLoading(false);
        });
    }
  }, [doctorUid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5001/doctor/update/${doctorUid}`, formData);
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile", error);
      alert("❌ Failed to update profile. Try again.");
    }
  };

  if (loading) return <div>Loading doctor profile...</div>;

  return (
    <div className="dashboard-card">
      <h3>Edit Doctor Profile</h3>
      <form style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          name="phone_no"
          placeholder="Phone Number"
          value={formData.phone_no}
          onChange={handleChange}
          className="appointment-input"
        />
        <input
          type="text"
          name="schedule"
          placeholder="Schedule"
          value={formData.schedule}
          onChange={handleChange}
          className="appointment-input"
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          className="appointment-input"
        />
        <button
          type="button"
          onClick={handleSave}
          className="appointment-button"
          style={{ backgroundColor: "rgba(47, 158, 19, 0.7)", marginTop: "10px" }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default DoctorProfileUpdateCard;
