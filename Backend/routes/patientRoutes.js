const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Fetch Patient Info
router.get('/patient/:uid', (req, res) => {
  const uid = req.params.uid;

  const query = `
    SELECT 
      u.uid,
      u.name,
      u.email,
      p.patient_id,
      p.phone_no,
      p.blood_group,
      p.dob,
      p.gender,
      p.address
    FROM users u
    JOIN patients p ON u.uid = p.uid
    WHERE u.uid = ?
  `;

  db.query(query, [uid], (err, results) => {
    if (err) {
      console.error("❌ Error fetching patient info:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results[0] || {});
  });
});

// ✅ Update Patient Info
router.put('/patient/update/:uid', (req, res) => {
  const uid = req.params.uid;
  const { name, phone_no, address, dob, blood_group, gender } = req.body;

  const updateUser = `
    UPDATE users SET name = ? WHERE uid = ?
  `;
  const updatePatient = `
    UPDATE patients SET phone_no = ?, address = ?, dob = ?, blood_group = ?, gender = ? WHERE uid = ?
  `;

  db.query(updateUser, [name, uid], (err, userResult) => {
    if (err) {
      console.error("❌ Error updating user:", err);
      return res.status(500).json({ error: "Failed to update user" });
    }
    db.query(updatePatient, [phone_no, address, dob, blood_group, gender, uid], (err, patientResult) => {
      if (err) {
        console.error("❌ Error updating patient:", err);
        return res.status(500).json({ error: "Failed to update patient info" });
      }
      res.status(200).json({ message: "✅ Patient info updated successfully!" });
    });
  });
});


// ✅ Fetch Latest Vital Signs for Patient
router.get('/patient/vitals/:uid', (req, res) => {
  const uid = req.params.uid;

  const query = `
    SELECT vs.*
    FROM vitalsigns vs
    JOIN inhousepatients ihp ON vs.ip_id = ihp.ip_id
    JOIN patients p ON ihp.patient_id = p.patient_id
    WHERE p.uid = ?
    ORDER BY vs.timestamp DESC
    LIMIT 5
  `;

  db.query(query, [uid], (err, results) => {
    if (err) {
      console.error("❌ Error fetching vitals:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results || []);
  });
});

// ✅ Fetch Vital Signs for a Patient
router.get('/patient-vitals/:patientId', (req, res) => {
    const patientId = req.params.patientId;
  
    const query = `
      SELECT 
        vs.heart_rate,
        vs.temperature,
        vs.oxygen_saturation,
        vs.timestamp
      FROM vitalsigns vs
      JOIN inhousepatients ihp ON vs.ip_id = ihp.ip_id
      WHERE ihp.patient_id = ?
      ORDER BY vs.timestamp ASC
    `;
  
    db.query(query, [patientId], (err, results) => {
      if (err) {
        console.error('❌ Error fetching patient vitals:', err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json(results);
    });
  });


  // ✅ GET /bills/:patient_id — Get All Bills for Patient
router.get('/:patient_id', (req, res) => {
    const { patient_id } = req.params;
  
    const query = `
      SELECT bill_no, patient_id, date, time, amount
      FROM bills
      WHERE patient_id = ?
      ORDER BY date DESC, time DESC
    `;
  
    db.query(query, [patient_id], (err, results) => {
      if (err) {
        console.error("❌ Failed to fetch bills:", err);
        return res.status(500).json({ error: "Database error while fetching bills" });
      }
      res.status(200).json(results);
    });
  });

  // routes/billRoutes.js
router.get('/patient-bills/:patient_id', (req, res) => {
    const { patient_id } = req.params;
  
    const query = `
      SELECT bill_no, patient_id, date, time, amount
      FROM bills
      WHERE patient_id = ?
      ORDER BY date DESC, time DESC
    `;
  
    db.query(query, [patient_id], (err, results) => {
      if (err) {
        console.error("❌ Failed to fetch bills:", err);
        return res.status(500).json({ error: "Database error while fetching bills" });
      }
      res.status(200).json(results);
    });
  });

module.exports = router;
