const express = require('express');
const router = express.Router();
const db = require('../config/db');

// API: Get All Appointments (with patient & doctor names)
router.get('/appointments', (req, res) => {
  const sql = `
    SELECT 
  a.appointment_id,
  u_patient.name AS patient_name,
  u_doctor.name AS doctor_name,
  a.date,
  a.time,
  a.specialization,
  a.consultant_fee
FROM appointments a
JOIN patients p ON a.patient_id = p.patient_id
JOIN users u_patient ON p.uid = u_patient.uid
JOIN doctors d ON a.doctor_id = d.doctor_id
JOIN users u_doctor ON d.uid = u_doctor.uid;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching appointments:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

module.exports = router;
