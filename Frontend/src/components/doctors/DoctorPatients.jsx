import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import "../../styles/doctor/DoctorPatients.css";

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [doctorId, setDoctorId] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const fetchDoctorId = async () => {
      const user = auth.currentUser;
      if (user?.uid) {
        try {
          const res = await axios.get(`http://localhost:5001/doctor/${user.uid}`);
          if (res.data && res.data.doctor_id) {
            setDoctorId(res.data.doctor_id);
          }
        } catch (error) {
          console.error("❌ Error fetching doctor ID", error);
        }
      }
    };

    fetchDoctorId();
  }, []);

  useEffect(() => {
    if (doctorId) {
      axios.get(`http://localhost:5001/doctor/doctor-patients/${doctorId}`)
        .then(res => {
          setPatients(res.data || []);
        })
        .catch(err => {
          console.error("❌ Error fetching patients", err);
        });
    }
  }, [doctorId]);

  return (
    <div className="doctor-patients-card">
      <h3>Patients Assigned to You</h3>
      {patients.length > 0 ? (
        <table className="doctor-patients-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Patient Name</th>
              <th>Blood Group</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.patient_id}>
                <td>{patient.patient_id}</td>
                <td>{patient.name}</td>
                <td>{patient.blood_group}</td>
                <td>{patient.dob}</td>
                <td>{patient.gender}</td>
                <td>{patient.phone_no}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No patients assigned yet.</p>
      )}
    </div>
  );
};

export default DoctorPatients;
