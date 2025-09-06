const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Fetch Doctor Data
router.get('/:uid', (req, res) => {
  const uid = req.params.uid;
  const query = `
      SELECT d.doctor_id, u.name, d.specialization, d.phone_no, d.schedule 
      FROM doctors d 
      JOIN users u ON d.uid = u.uid 
      WHERE d.uid = ?
  `;
  db.query(query, [uid], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results[0] || {});
  });
});

// ✅ Fetch Appointments
router.get('/appointments/:doctor_id', (req, res) => {
  const doctor_id = req.params.doctor_id;
  const query = `
      SELECT a.appointment_id, u.name AS patient_name, a.date, a.time, a.consultant_fee 
      FROM appointments a 
      JOIN patients p ON a.patient_id = p.patient_id 
      JOIN users u ON p.uid = u.uid 
      WHERE a.doctor_id = ?
  `;
  db.query(query, [doctor_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// ✅ Delete Appointment
router.delete('/appointments/:appointment_id', (req, res) => {
  const appointmentId = req.params.appointment_id;
  const query = `DELETE FROM appointments WHERE appointment_id = ?`;
  db.query(query, [appointmentId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.affectedRows === 0) return res.status(404).json({ error: "Appointment not found" });
    res.status(200).json({ message: "Appointment deleted successfully" });
  });
});

// ✅ Restore Appointment (Fixed)
router.post('/appointments/restore', (req, res) => {
    const { appointment_id, doctor_id, patient_id, date, time, specialization, consultant_fee } = req.body;
  
    const query = `
      INSERT INTO appointments (appointment_id, doctor_id, patient_id, date, time, specialization, consultant_fee)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(query, [appointment_id, doctor_id, patient_id, date, time, specialization, consultant_fee], (err, results) => {
      if (err) {
        console.error("Error restoring appointment:", err);
        return res.status(500).json({ error: "Database error: " + err.message });
      }
      res.status(200).json({ message: "✅ Appointment restored successfully!" });
    });
  });
  


  // ✅ POST /query (Chatbot)
router.post('/query', async (req, res) => {
    try {
      const { input } = req.body;
      const result = await searchMedicine(input); // Your chatbot logic (search function)
      if (!result) return res.status(404).json({ error: 'No data found' });
      res.json({ result });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error processing your query' });
    }
  });

  // ✅ Update Doctor Info  -- DASHBOARD
router.put('/update/:uid', (req, res) => {
    const { phone_no, schedule, specialization } = req.body;
    const { uid } = req.params;
  
    console.log("Incoming Update:", { phone_no, schedule, specialization, uid }); // <-- Must log
  
    if (!phone_no || !schedule || !specialization || !uid) {
      return res.status(400).json({ error: "❌ Missing fields" });
    }
  
    const sql = `UPDATE doctors SET phone_no = ?, schedule = ?, specialization = ? WHERE uid = ?`;
  
    db.query(sql, [phone_no, schedule, specialization, uid], (err, result) => {
      if (err) {
        console.error("❌ Error updating doctor info:", err);
        return res.status(500).json({ error: "Database error: " + err.message });
      }
      res.json({ message: "✅ Doctor info updated successfully!" });
    });
  });
  
  

// ✅ Get Patients based on Appointments
router.get('/doctor-patients/:doctorId', (req, res) => {
    const doctorId = req.params.doctorId;
  
    const query = `
      SELECT DISTINCT 
        p.patient_id, 
        u.name, 
        p.blood_group, 
        p.dob, 
        p.gender, 
        p.phone_no
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      JOIN users u ON p.uid = u.uid
      WHERE a.doctor_id = ?
    `;
  
    db.query(query, [doctorId], (err, results) => {
      if (err) {
        console.error("❌ Error fetching doctor patients:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json(results);
    });
  });


// ✅ Fetch Latest Vitals for Doctor's Patients  using Appointments
router.get('/doctor-vitals/:doctorId', (req, res) => {
  const doctorId = req.params.doctorId;

  const query = `
    SELECT 
      u.name AS patient_name,
      vs.heart_rate,
      vs.blood_pressure,
      vs.respiratory_rate,
      vs.temperature,
      vs.oxygen_saturation,
      vs.timestamp
    FROM appointments a
    JOIN patients p ON a.patient_id = p.patient_id
    JOIN inhousepatients ihp ON p.patient_id = ihp.patient_id
    JOIN vitalsigns vs ON ihp.ip_id = vs.ip_id
    JOIN users u ON p.uid = u.uid
    WHERE a.doctor_id = ?
    ORDER BY vs.timestamp DESC
  `;

  db.query(query, [doctorId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching vitals:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});



// Schedule Page
// ✅ Fetch Doctor's Schedule
router.get('/doctor-schedule/:doctorId', (req, res) => {
    const doctorId = req.params.doctorId;
  
    const query = `
      SELECT schedule 
      FROM doctors 
      WHERE doctor_id = ?
    `;
  
    db.query(query, [doctorId], (err, results) => {
      if (err) {
        console.error("❌ Error fetching schedule:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json(results[0] || {});
    });
  });
  
  // ✅ Update Doctor's Schedule
  router.post('/update-schedule', (req, res) => {
    const { doctor_id, schedule } = req.body;
  
    const query = `
      UPDATE doctors
      SET schedule = ?
      WHERE doctor_id = ?
    `;
  
    db.query(query, [schedule, doctor_id], (err, result) => {
      if (err) {
        console.error("❌ Error updating schedule:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ message: "✅ Schedule updated successfully!" });
    });
  });

  

module.exports = router;
