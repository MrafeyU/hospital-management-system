import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import "../../styles/patients/PatientInfoCard.css";

const PatientInfoCard = () => {
  const [patient, setPatient] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const auth = getAuth();

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      fetchPatientInfo(uid);
    }
  }, []);

  const fetchPatientInfo = (uid) => {
    axios.get(`http://localhost:5001/patient/${uid}`)
      .then(res => {
        setPatient(res.data);
        setFormData(res.data);
      })
      .catch(err => console.error("❌ Error fetching patient info", err));
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    const uid = auth.currentUser?.uid;
    axios.put(`http://localhost:5001/patient/update/${uid}`, formData)
      .then(res => {
        alert("✅ Info updated successfully!");
        setEditMode(false);
        fetchPatientInfo(uid); // Reload updated info
      })
      .catch(err => {
        console.error("❌ Error updating info", err);
        alert("❌ Failed to update info!");
      });
  };

  return (
    <div className="dashboard-card">
      <h3>Patient Profile</h3>
      <div className="profile-content">
        {!editMode ? (
          <>
            <table className="info-table">
              <tbody>
                <tr><td><strong>Name:</strong></td><td>{patient.name || '-'}</td></tr>
                <tr><td><strong>Email:</strong></td><td>{patient.email || '-'}</td></tr>
                <tr><td><strong>Phone No:</strong></td><td>{patient.phone_no || '-'}</td></tr>
                <tr><td><strong>Gender:</strong></td><td>{patient.gender || '-'}</td></tr>
                <tr><td><strong>DOB:</strong></td><td>{patient.dob ? new Date(patient.dob).toLocaleDateString() : '-'}</td></tr>
                <tr><td><strong>Blood Group:</strong></td><td>{patient.blood_group || '-'}</td></tr>
                <tr><td><strong>Address:</strong></td><td>{patient.address || '-'}</td></tr>
              </tbody>
            </table>
            <button className="edit-button" onClick={handleEditToggle}> Edit Info</button>
          </>
        ) : (
          <>
            <div className="edit-form">
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Name" />
              <input type="text" name="phone_no" value={formData.phone_no || ''} onChange={handleChange} placeholder="Phone No" />
              <input type="text" name="gender" value={formData.gender || ''} onChange={handleChange} placeholder="Gender" />
              <input type="date" name="dob" value={formData.dob ? formData.dob.split('T')[0] : ''} onChange={handleChange} placeholder="DOB" />
              <input type="text" name="blood_group" value={formData.blood_group || ''} onChange={handleChange} placeholder="Blood Group" />
              <input type="text" name="address" value={formData.address || ''} onChange={handleChange} placeholder="Address" />
              <div className="edit-buttons">
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="cancel-button" onClick={handleEditToggle}>Cancel</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientInfoCard;
