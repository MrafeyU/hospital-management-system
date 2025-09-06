import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import "../../styles/patients/bookAppointment.css";

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    date: '',
    time: '',
    specialization: '',
    consultant_fee: '5000'
  });

  const [doctors, setDoctors] = useState([]);
  const auth = getAuth();

  // Auto-fetch patient_id based on UID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        axios.post("http://localhost:5001/getPatientId", { uid: user.uid })
          .then(res => {
            setFormData(prev => ({ ...prev, patient_id: res.data.patient_id }));
          })
          .catch(err => {
            console.error("❌ Failed to fetch patient ID", err);
            alert("❌ Could not fetch your patient ID. Try again.");
          });
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch list of doctors
  useEffect(() => {
    axios.get("http://localhost:5001/doctors/list")
      .then(res => setDoctors(res.data))
      .catch(err => {
        console.error("❌ Failed to fetch doctors", err);
        alert("❌ Could not load doctor list.");
      });
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const checkRes = await axios.post('http://localhost:5001/check-duplicate-appointment', {
        patient_id: formData.patient_id,
        doctor_id: formData.doctor_id
      });

      if (checkRes.data.exists) {
        return alert("❌ This appointment already exists!");
      }

      await axios.post("http://localhost:5001/appointments/book", formData);
      alert("✅ Appointment booked successfully!");

      setFormData(prev => ({
        ...prev,
        doctor_id: '',
        date: '',
        time: '',
        specialization: '',
        consultant_fee: ''
      }));
    } catch (error) {
      console.error("❌ Booking error:", error.response?.data || error.message);
      alert(`❌ Failed to book appointment: ${error.response?.data?.error || "Unknown error"}`);
    }
  };

  return (
    <div className="book-appointment-container">
      <div className="book-appointment-box">
        <h2> Book an Appointment</h2>
        <form onSubmit={handleSubmit} className="appointment-form">
          <select name="doctor_id" value={formData.doctor_id} onChange={handleChange} required className="appointment-input">
            <option value="">Select Doctor</option>
            {doctors.map(doc => (
              <option key={doc.doctor_id} value={doc.doctor_id}>
                Dr. {doc.name} ({doc.specialization})
              </option>
            ))}
          </select>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="appointment-input" />
          <input type="time" name="time" value={formData.time} onChange={handleChange} required className="appointment-input" />
          <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization" className="appointment-input" />
          {/* <input type="number" name="consultant_fee" value={formData.consultant_fee} onChange={handleChange} placeholder="Consultant Fee" className="appointment-input" /> */}
          <button type="submit" className="appointment-button">Book Appointment</button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
